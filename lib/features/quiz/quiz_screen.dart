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
          padding: const EdgeInsets.fromLTRB(16, 10, 16, 14),
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
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: Text(
                      widget.mode.title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: AppColors.muted,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  if (session.streak >= 2)
                    Text(
                      '${session.streak} streak',
                      style: const TextStyle(
                        color: AppColors.orange,
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 10),
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
                      const SizedBox(height: 18),
                      Text(
                        question.question,
                        style: const TextStyle(
                          fontSize: 24,
                          height: 1.1,
                          fontWeight: FontWeight.w900,
                          letterSpacing: -.65,
                        ),
                      ),
                      const SizedBox(height: 17),
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
                          const SizedBox(height: 8),
                      ],
                      if (session.isAnswered) ...[
                        const SizedBox(height: 12),
                        _FeedbackBar(
                          correct: isCorrect,
                          points: isCorrect
                              ? '+${_earnedPoints(session.streak)}'
                              : null,
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

  int _earnedPoints(int streak) =>
      (100 *
              (streak >= 10
                  ? 3
                  : streak >= 5
                      ? 2
                      : streak >= 3
                          ? 1.5
                          : 1))
          .round();

  Future<void> _confirmExit() async {
    final leave = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text(
          'Leave round?',
          style: TextStyle(fontWeight: FontWeight.w800),
        ),
        content: const Text('This round will not be saved.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Stay'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Leave'),
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
        Material(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(11),
          child: InkWell(
            onTap: onExit,
            borderRadius: BorderRadius.circular(11),
            child: Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                border: Border.all(color: AppColors.border),
                borderRadius: BorderRadius.circular(11),
              ),
              alignment: Alignment.center,
              child: const Icon(
                Icons.close_rounded,
                size: 19,
                color: AppColors.muted,
              ),
            ),
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            children: [
              Row(
                children: [
                  Text(
                    '$questionNumber of $questionCount',
                    style: const TextStyle(
                      color: AppColors.muted,
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const Spacer(),
                  if (secondsLeft != null)
                    Text(
                      '0:${secondsLeft.toString().padLeft(2, '0')}',
                      style: TextStyle(
                        color: secondsLeft! <= 10 ? AppColors.red : AppColors.ink,
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                      ),
                    )
                  else
                    Text(
                      '$score pts',
                      style: const TextStyle(
                        color: AppColors.muted,
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
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

class _FeedbackBar extends StatelessWidget {
  const _FeedbackBar({required this.correct, this.points});

  final bool correct;
  final String? points;

  @override
  Widget build(BuildContext context) {
    final color = correct ? AppColors.lime : AppColors.red;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 13, vertical: 11),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Icon(
            correct ? Icons.check_rounded : Icons.close_rounded,
            color: color,
            size: 18,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              correct ? 'Correct' : 'Wrong',
              style: TextStyle(
                color: color,
                fontSize: 12,
                fontWeight: FontWeight.w800,
              ),
            ),
          ),
          if (points != null)
            Text(
              points!,
              style: const TextStyle(
                color: AppColors.muted,
                fontSize: 11,
                fontWeight: FontWeight.w700,
              ),
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
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.border),
        ),
        child: const Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.visibility_off_rounded,
              size: 34,
              color: AppColors.subtle,
            ),
            SizedBox(height: 8),
            Text(
              'Image hidden',
              style: TextStyle(
                color: AppColors.muted,
                fontSize: 12,
                fontWeight: FontWeight.w600,
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
    final (icon, label) = switch (question.questionType) {
      QuestionType.emoji => (Icons.tag_faces_rounded, 'Emoji'),
      QuestionType.slang => (Icons.chat_bubble_outline_rounded, 'Slang'),
      QuestionType.finishMeme => (Icons.format_quote_rounded, 'Finish the meme'),
      _ => (Icons.psychology_alt_outlined, 'Text'),
    };

    final visual = switch (question.questionType) {
      QuestionType.emoji => '🐊  ✈️  💣',
      QuestionType.slang => 'internet slang',
      QuestionType.finishMeme => 'complete the line',
      _ => 'quick check',
    };

    return Container(
      height: 130,
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Icon(icon, color: AppColors.muted, size: 17),
              const SizedBox(width: 6),
              Text(
                label,
                style: const TextStyle(
                  color: AppColors.muted,
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          Text(
            visual,
            style: TextStyle(
              fontSize: question.questionType == QuestionType.emoji ? 30 : 19,
              fontWeight: FontWeight.w800,
              letterSpacing: -.3,
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
                  width: 30,
                  height: 30,
                  child: CircularProgressIndicator(
                    strokeWidth: 3,
                    color: mode.accent,
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  'Loading ${mode.title}',
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
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
