import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/models/game_mode.dart';
import '../../core/models/question.dart';
import '../../core/theme/app_theme.dart';
import '../../data/question_repository.dart';
import '../../state/providers.dart';
import '../../state/quiz_session.dart';
import '../../widgets/common.dart';

class QuizScreen extends ConsumerStatefulWidget {
  const QuizScreen({super.key, required this.mode});

  final GameMode mode;

  @override
  ConsumerState<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends ConsumerState<QuizScreen> {
  final QuestionRepository _repository = QuestionRepository();
  Timer? _rushTimer;
  Timer? _flashTimer;
  bool _loading = true;
  bool _flashVisible = true;
  bool _finishing = false;

  @override
  void initState() {
    super.initState();
    _loadQuestions();
  }

  @override
  void dispose() {
    _rushTimer?.cancel();
    _flashTimer?.cancel();
    super.dispose();
  }

  Future<void> _loadQuestions() async {
    final questionCount = widget.mode == GameMode.rush ? 20 : 10;
    late final List<QuizQuestion> questions;

    try {
      questions = await _repository
          .questionsFor(widget.mode, count: questionCount)
          .timeout(const Duration(seconds: 4));
    } catch (_) {
      questions = _repository.fallbackQuestions(count: questionCount);
    }

    if (!mounted) return;
    ref.read(quizSessionProvider.notifier).start(widget.mode, questions);
    setState(() => _loading = false);

    for (final asset
        in questions
            .map((question) => question.imageAsset)
            .whereType<String>()
            .take(3)) {
      precacheImage(AssetImage(asset), context);
    }

    if (widget.mode == GameMode.rush) {
      _rushTimer = Timer.periodic(const Duration(seconds: 1), (_) {
        final session = ref.read(quizSessionProvider);
        if (session == null || session.secondsLeft <= 0) {
          _finish();
        } else {
          ref.read(quizSessionProvider.notifier).tick();
        }
      });
    }

    _startFlashTimer();
  }

  void _startFlashTimer() {
    _flashTimer?.cancel();
    final session = ref.read(quizSessionProvider);
    if (session?.currentQuestion.questionType != QuestionType.flash) {
      if (!_flashVisible) setState(() => _flashVisible = true);
      return;
    }

    setState(() => _flashVisible = true);
    _flashTimer = Timer(_flashDuration(session!.currentQuestion), () {
      if (mounted) setState(() => _flashVisible = false);
    });
  }

  Duration _flashDuration(QuizQuestion question) =>
      switch (question.difficulty.toLowerCase()) {
        'insane' => const Duration(milliseconds: 250),
        'hard' => const Duration(milliseconds: 500),
        'medium' => const Duration(milliseconds: 700),
        _ => const Duration(milliseconds: 1000),
      };

  void _onAnswer(int index) {
    final session = ref.read(quizSessionProvider);
    if (session == null || session.isAnswered) return;

    final settings = ref.read(progressProvider);
    final question = session.currentQuestion;
    ref.read(quizSessionProvider.notifier).answer(index);

    if (index == question.correctAnswer) {
      ref.read(audioServiceProvider).playCorrect(
            hapticsEnabled: settings.haptics,
            soundEnabled: settings.soundEffects,
          );
    } else {
      ref.read(audioServiceProvider).playWrong(
            hapticsEnabled: settings.haptics,
            soundEnabled: settings.soundEffects,
          );
    }

    final answeredIndex = session.currentIndex;
    Future<void>.delayed(const Duration(milliseconds: 850), () {
      if (!mounted || _finishing) return;
      final latest = ref.read(quizSessionProvider);
      if (latest == null ||
          latest.currentIndex != answeredIndex ||
          !latest.isAnswered) {
        return;
      }

      if (widget.mode == GameMode.rush ||
          answeredIndex < latest.questions.length - 1) {
        ref.read(quizSessionProvider.notifier).next();
        _startFlashTimer();
      } else {
        _finish();
      }
    });
  }

  void _finish() {
    if (_finishing || !mounted) return;
    _finishing = true;
    _rushTimer?.cancel();

    final session = ref.read(quizSessionProvider);
    if (session == null) return;

    ref.read(progressProvider.notifier).completeQuiz(
          score: session.score,
          correct: session.correctAnswers,
          bestStreak: session.bestStreak,
          daily: widget.mode == GameMode.daily,
        );
    ref.read(analyticsServiceProvider).track('quiz_completed', {
      'mode': widget.mode.name,
      'score': session.score,
    });
    context.go('/results');
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) return _QuizLoading(mode: widget.mode);

    final session = ref.watch(quizSessionProvider);
    if (session == null) return const SizedBox.shrink();

    final question = session.currentQuestion;
    final progress = widget.mode == GameMode.rush
        ? session.secondsLeft / 60
        : (session.currentIndex + (session.isAnswered ? 1 : 0)) /
            session.questions.length;
    final isCorrect = session.isAnswered && session.lastWasCorrect == true;

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 10, 16, 16),
          child: Column(
            children: [
              _QuizHeader(
                mode: widget.mode,
                progress: progress,
                questionNumber: session.currentIndex + 1,
                questionCount: session.questions.length,
                score: session.score,
                secondsLeft:
                    widget.mode == GameMode.rush ? session.secondsLeft : null,
                onExit: _confirmExit,
              ),
              const SizedBox(height: 18),
              Row(
                children: [
                  Expanded(
                    child: Text(
                      widget.mode.title.toUpperCase(),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: AppColors.muted,
                        fontSize: 10,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 1.2,
                      ),
                    ),
                  ),
                  _StreakLabel(
                    streak: session.streak,
                    label: session.multiplierLabel,
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Expanded(
                child: SingleChildScrollView(
                  physics: const BouncingScrollPhysics(),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _QuestionMedia(
                        question: question,
                        flashVisible: _flashVisible,
                      ),
                      const SizedBox(height: 20),
                      Text(
                        question.question,
                        style: const TextStyle(
                          fontSize: 25,
                          height: 1.08,
                          fontWeight: FontWeight.w900,
                          letterSpacing: -.8,
                        ),
                      ),
                      const SizedBox(height: 18),
                      for (var index = 0;
                          index < question.answers.length;
                          index++) ...[
                        AnswerCard(
                          index: index,
                          answer: question.answers[index],
                          onTap: () => _onAnswer(index),
                          selected: session.selectedAnswer == index,
                          correct: question.correctAnswer == index,
                          revealed: session.isAnswered,
                        ),
                        if (index != question.answers.length - 1)
                          const SizedBox(height: 9),
                      ],
                      if (session.isAnswered) ...[
                        const SizedBox(height: 14),
                        _FeedbackBar(
                          correct: isCorrect,
                          label: isCorrect
                              ? _positiveFeedback(session.streak)
                              : 'COOKED',
                          points: isCorrect
                              ? '+${_earnedAura(session.streak)} AURA'
                              : '-500 AURA',
                        ),
                      ],
                      const SizedBox(height: 8),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  int _earnedAura(int streak) =>
      (100 *
              (streak >= 10
                  ? 3
                  : streak >= 5
                      ? 2
                      : streak >= 3
                          ? 1.5
                          : 1))
          .round();

  String _positiveFeedback(int streak) {
    if (streak >= 10) return 'LOCKED IN';
    if (streak >= 5) return 'ABSOLUTE CINEMA';
    if (streak >= 3) return 'AURA UP';
    return 'STILL COOKING';
  }

  Future<void> _confirmExit() async {
    final leave = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text(
          'Leave this round?',
          style: TextStyle(fontWeight: FontWeight.w900),
        ),
        content: const Text('Your current round will not be saved.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('KEEP PLAYING'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('LEAVE'),
          ),
        ],
      ),
    );

    if (!mounted || leave != true) return;
    context.go('/');
  }
}

class _QuizHeader extends StatelessWidget {
  const _QuizHeader({
    required this.mode,
    required this.progress,
    required this.questionNumber,
    required this.questionCount,
    required this.score,
    required this.secondsLeft,
    required this.onExit,
  });

  final GameMode mode;
  final double progress;
  final int questionNumber;
  final int questionCount;
  final int score;
  final int? secondsLeft;
  final VoidCallback onExit;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        _HeaderButton(icon: Icons.close_rounded, onTap: onExit),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            children: [
              Row(
                children: [
                  Text(
                    '$questionNumber/$questionCount',
                    style: const TextStyle(
                      color: AppColors.muted,
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const Spacer(),
                  if (secondsLeft != null)
                    Text(
                      '0:${secondsLeft.toString().padLeft(2, '0')}',
                      style: TextStyle(
                        color: secondsLeft! <= 10
                            ? AppColors.red
                            : AppColors.ink,
                        fontSize: 11,
                        fontWeight: FontWeight.w900,
                      ),
                    )
                  else
                    Text(
                      '$score AURA',
                      style: const TextStyle(
                        color: AppColors.ink,
                        fontSize: 11,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 7),
              ProgressBar(value: progress, color: mode.accent, height: 5),
            ],
          ),
        ),
      ],
    );
  }
}

class _HeaderButton extends StatelessWidget {
  const _HeaderButton({required this.icon, required this.onTap});

  final IconData icon;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: AppColors.surface,
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          width: 38,
          height: 38,
          decoration: BoxDecoration(
            border: Border.all(color: AppColors.border),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, size: 19, color: AppColors.muted),
        ),
      ),
    );
  }
}

class _StreakLabel extends StatelessWidget {
  const _StreakLabel({required this.streak, required this.label});

  final int streak;
  final String label;

  @override
  Widget build(BuildContext context) {
    final active = streak >= 2;
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(
          Icons.local_fire_department_rounded,
          size: 15,
          color: active ? AppColors.orange : AppColors.subtle,
        ),
        const SizedBox(width: 4),
        Text(
          label,
          style: TextStyle(
            color: active ? AppColors.orange : AppColors.muted,
            fontSize: 11,
            fontWeight: FontWeight.w900,
          ),
        ),
      ],
    );
  }
}

class _FeedbackBar extends StatelessWidget {
  const _FeedbackBar({
    required this.correct,
    required this.label,
    required this.points,
  });

  final bool correct;
  final String label;
  final String points;

  @override
  Widget build(BuildContext context) {
    final color = correct ? AppColors.lime : AppColors.red;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(color: color, shape: BoxShape.circle),
          ),
          const SizedBox(width: 9),
          Expanded(
            child: Text(
              label,
              style: TextStyle(
                color: color,
                fontSize: 12,
                fontWeight: FontWeight.w900,
                letterSpacing: .4,
              ),
            ),
          ),
          Text(
            points,
            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900),
          ),
        ],
      ),
    );
  }
}

class _QuestionMedia extends StatelessWidget {
  const _QuestionMedia({required this.question, required this.flashVisible});

  final QuizQuestion question;
  final bool flashVisible;

  @override
  Widget build(BuildContext context) {
    if (question.questionType == QuestionType.sound) {
      return AudioButton(audioAsset: question.audioAsset);
    }

    if (question.questionType == QuestionType.flash && !flashVisible) {
      return Container(
        height: 190,
        width: double.infinity,
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.border),
        ),
        child: const Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.visibility_off_rounded, size: 36, color: AppColors.muted),
            SizedBox(height: 9),
            Text(
              'IMAGE GONE',
              style: TextStyle(
                color: AppColors.muted,
                fontSize: 11,
                fontWeight: FontWeight.w900,
                letterSpacing: 1.2,
              ),
            ),
          ],
        ),
      );
    }

    if (question.questionType == QuestionType.text ||
        question.questionType == QuestionType.slang ||
        question.questionType == QuestionType.finishMeme ||
        question.questionType == QuestionType.emoji) {
      return _PromptMedia(question: question);
    }

    return BrainrotImage(assetPath: question.imageAsset, height: 200);
  }
}

class _PromptMedia extends StatelessWidget {
  const _PromptMedia({required this.question});

  final QuizQuestion question;

  @override
  Widget build(BuildContext context) {
    final (label, icon, visual) = switch (question.questionType) {
      QuestionType.emoji => ('EMOJI ROUND', Icons.tag_faces_rounded, '🐊  ✈️  💣'),
      QuestionType.slang => ('SLANG ROUND', Icons.chat_bubble_outline_rounded, 'FLUENT INTERNET?'),
      QuestionType.finishMeme => ('FINISH IT', Icons.format_quote_rounded, 'BRO REALLY THOUGHT...'),
      _ => ('BRAIN CHECK', Icons.psychology_alt_outlined, 'ONE BRAIN CELL'),
    };

    return Container(
      height: 142,
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Icon(icon, color: AppColors.muted, size: 17),
              const SizedBox(width: 7),
              Text(
                label,
                style: const TextStyle(
                  color: AppColors.muted,
                  fontSize: 10,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 1.1,
                ),
              ),
            ],
          ),
          Text(
            visual,
            style: TextStyle(
              fontSize: question.questionType == QuestionType.emoji ? 30 : 21,
              fontWeight: FontWeight.w900,
              letterSpacing: -.6,
            ),
          ),
        ],
      ),
    );
  }
}

class _QuizLoading extends StatelessWidget {
  const _QuizLoading({required this.mode});

  final GameMode mode;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(28),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                SizedBox(
                  width: 96,
                  height: 96,
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(24),
                    child: Image.asset(
                      mode.imageAsset ?? 'assets/images/tralalero_tralala.webp',
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                Text(
                  mode.title.toUpperCase(),
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w900,
                    letterSpacing: .8,
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: 140,
                  child: ProgressBar(value: .72, color: mode.accent, height: 5),
                ),
                const SizedBox(height: 10),
                const Text(
                  'Loading round…',
                  style: TextStyle(
                    color: AppColors.muted,
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
