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
      // Core gameplay remains playable even when a browser/webview asset
      // request is temporarily unavailable.
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
      if (_flashVisible == false) setState(() => _flashVisible = true);
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
      ref
          .read(audioServiceProvider)
          .playCorrect(
            hapticsEnabled: settings.haptics,
            soundEnabled: settings.soundEffects,
          );
    } else {
      ref
          .read(audioServiceProvider)
          .playWrong(
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
    ref
        .read(progressProvider.notifier)
        .completeQuiz(
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
    if (_loading) {
      return _QuizLoading(mode: widget.mode);
    }
    final session = ref.watch(quizSessionProvider);
    if (session == null) return const SizedBox.shrink();
    final question = session.currentQuestion;
    final progress = widget.mode == GameMode.rush
        ? session.secondsLeft / 60
        : (session.currentIndex + (session.isAnswered ? 1 : 0)) /
              session.questions.length;
    final isCorrect = session.isAnswered && session.lastWasCorrect == true;
    final feedback = isCorrect
        ? _positiveFeedback(session.streak)
        : 'COOKED 💀';
    return Scaffold(
      body: AppBackground(
        accent: widget.mode.accent,
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 9, 16, 18),
            child: Column(
              children: [
                Row(
                  children: [
                    _HudIconButton(
                      tooltip: 'Pause quiz',
                      icon: Icons.pause_rounded,
                      onPressed: _confirmExit,
                    ),
                    const SizedBox(width: 4),
                    Expanded(
                      child: ProgressBar(
                        value: progress,
                        color: widget.mode.accent,
                        height: 8,
                      ),
                    ),
                    const SizedBox(width: 8),
                    if (widget.mode == GameMode.rush)
                      _TimerChip(seconds: session.secondsLeft),
                    if (widget.mode != GameMode.rush)
                      _CounterChip(
                        label:
                            '${session.currentIndex + 1}/${session.questions.length}',
                      ),
                    const SizedBox(width: 8),
                    _MiniScore(value: session.score),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    _ModeTag(mode: widget.mode),
                    const Spacer(),
                    _StreakChip(
                      label: session.multiplierLabel,
                      streak: session.streak,
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                Expanded(
                  child: SingleChildScrollView(
                    physics: const BouncingScrollPhysics(),
                    child: Column(
                      children: [
                        _QuestionMedia(
                          question: question,
                          flashVisible: _flashVisible,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          question.question,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 23,
                            height: 1.05,
                            fontWeight: FontWeight.w900,
                            letterSpacing: -.5,
                          ),
                        ),
                        const SizedBox(height: 17),
                        for (
                          var index = 0;
                          index < question.answers.length;
                          index++
                        ) ...[
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
                          const SizedBox(height: 16),
                          AnimatedSwitcher(
                            duration: const Duration(milliseconds: 250),
                            child: Container(
                              key: ValueKey(
                                '$isCorrect-${session.currentIndex}',
                              ),
                              width: double.infinity,
                              padding: const EdgeInsets.symmetric(
                                horizontal: 16,
                                vertical: 13,
                              ),
                              decoration: BoxDecoration(
                                color:
                                    (isCorrect ? AppColors.lime : AppColors.red)
                                        .withValues(alpha: .12),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color:
                                      (isCorrect
                                              ? AppColors.lime
                                              : AppColors.red)
                                          .withValues(alpha: .5),
                                ),
                              ),
                              child: Row(
                                children: [
                                  Icon(
                                    isCorrect
                                        ? Icons.auto_awesome_rounded
                                        : Icons.warning_amber_rounded,
                                    color: isCorrect
                                        ? AppColors.lime
                                        : AppColors.red,
                                    size: 21,
                                  ),
                                  const SizedBox(width: 9),
                                  Expanded(
                                    child: Text(
                                      feedback,
                                      style: TextStyle(
                                        color: isCorrect
                                            ? AppColors.lime
                                            : AppColors.red,
                                        fontWeight: FontWeight.w900,
                                        letterSpacing: .7,
                                      ),
                                    ),
                                  ),
                                  Text(
                                    isCorrect
                                        ? '+${(100 * (session.streak >= 10
                                                  ? 3
                                                  : session.streak >= 5
                                                  ? 2
                                                  : session.streak >= 3
                                                  ? 1.5
                                                  : 1)).round()} AURA'
                                        : '-500 AURA',
                                    style: const TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w900,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                ),
                if (session.isAnswered && widget.mode == GameMode.rush)
                  const Padding(
                    padding: EdgeInsets.only(top: 10),
                    child: Text(
                      'Next one loading...',
                      style: TextStyle(
                        color: AppColors.muted,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  String _positiveFeedback(int streak) {
    if (streak >= 10) return 'LOCKED IN 🔥';
    if (streak >= 5) return 'ABSOLUTE CINEMA';
    if (streak >= 3) return '+AURA ENERGY';
    return 'BRAIN STILL FUNCTIONING';
  }

  Future<void> _confirmExit() async {
    final leave = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.surface,
        title: const Text(
          'Pause the brainrot?',
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
            child: const Text('EXIT'),
          ),
        ],
      ),
    );
    if (!mounted || leave != true) return;
    context.go('/');
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
          color: AppColors.surfaceRaised,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: AppColors.border),
        ),
        child: const Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.visibility_off_rounded,
              size: 42,
              color: AppColors.muted,
            ),
            SizedBox(height: 10),
            Text(
              'MEMORY LOCKED',
              style: TextStyle(
                color: AppColors.muted,
                fontWeight: FontWeight.w900,
                letterSpacing: 1.6,
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
    return BrainrotImage(assetPath: question.imageAsset, height: 190);
  }
}

class _QuizLoading extends StatelessWidget {
  const _QuizLoading({required this.mode});

  final GameMode mode;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: AppBackground(
        accent: mode.accent,
        child: SafeArea(
          child: Center(
            child: Padding(
              padding: const EdgeInsets.all(28),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const BrainrotLogo(center: true),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: 112,
                    height: 112,
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(28),
                      child: Image.asset(
                        mode.imageAsset ??
                            'assets/images/tralalero_tralala.webp',
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  const SizedBox(height: 18),
                  Text(
                    'LOADING ${mode.title.toUpperCase()}',
                    style: TextStyle(
                      color: mode.accent,
                      fontSize: 12,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 1.4,
                    ),
                  ),
                  const SizedBox(height: 10),
                  SizedBox(
                    width: 150,
                    child: ProgressBar(
                      value: .72,
                      color: mode.accent,
                      height: 6,
                    ),
                  ),
                  const SizedBox(height: 10),
                  const Text(
                    'Waking up the brain cells...',
                    style: TextStyle(
                      color: AppColors.muted,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _PromptMedia extends StatelessWidget {
  const _PromptMedia({required this.question});

  final QuizQuestion question;

  @override
  Widget build(BuildContext context) {
    final (label, icon, color, visual) = switch (question.questionType) {
      QuestionType.emoji => (
        'EMOJI DECODER',
        Icons.tag_faces_rounded,
        AppColors.orange,
        '🐊  ✈️  💣',
      ),
      QuestionType.slang => (
        'SLANG CHECK',
        Icons.chat_bubble_rounded,
        AppColors.purple,
        'FLUENT INTERNET',
      ),
      QuestionType.finishMeme => (
        'FINISH THE MEME',
        Icons.auto_awesome_rounded,
        AppColors.pink,
        'BRO REALLY THOUGHT...',
      ),
      _ => (
        'BRAIN CHECK',
        Icons.psychology_alt_rounded,
        AppColors.cyan,
        'ONE BRAIN CELL',
      ),
    };
    final promptAsset = switch (question.questionType) {
      QuestionType.emoji => 'assets/images/bombardiro_crocodilo.jpg',
      QuestionType.finishMeme => 'assets/images/brr_brr_patapim.jpg',
      QuestionType.slang => 'assets/images/tralalero_tralala.webp',
      _ => 'assets/images/tung_tung_tung_sahur.webp',
    };
    return Container(
      height: 142,
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        image: DecorationImage(
          image: AssetImage(promptAsset),
          fit: BoxFit.cover,
          opacity: .24,
        ),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [color.withValues(alpha: .2), AppColors.surface],
        ),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: color.withValues(alpha: .55)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Icon(icon, color: color, size: 18),
              const SizedBox(width: 7),
              Text(
                label,
                style: TextStyle(
                  color: color,
                  fontSize: 11,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 1.2,
                ),
              ),
            ],
          ),
          Text(
            visual,
            style: TextStyle(
              color: AppColors.ink,
              fontSize: question.questionType == QuestionType.emoji ? 30 : 21,
              fontWeight: FontWeight.w900,
              letterSpacing: -.5,
            ),
          ),
        ],
      ),
    );
  }
}

class _ModeTag extends StatelessWidget {
  const _ModeTag({required this.mode});
  final GameMode mode;

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
    decoration: BoxDecoration(
      color: mode.accent.withValues(alpha: .15),
      borderRadius: BorderRadius.circular(10),
    ),
    child: Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(mode.icon, size: 14, color: mode.accent),
        const SizedBox(width: 5),
        Text(
          mode.title.toUpperCase(),
          style: TextStyle(
            color: mode.accent,
            fontSize: 10,
            fontWeight: FontWeight.w900,
            letterSpacing: .6,
          ),
        ),
      ],
    ),
  );
}

class _MiniScore extends StatelessWidget {
  const _MiniScore({required this.value});
  final int value;
  @override
  Widget build(BuildContext context) => _CounterChip(
    icon: Icons.bolt_rounded,
    iconColor: AppColors.lime,
    label: '$value',
  );
}

class _HudIconButton extends StatelessWidget {
  const _HudIconButton({
    required this.tooltip,
    required this.icon,
    required this.onPressed,
  });

  final String tooltip;
  final IconData icon;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) => Container(
    width: 38,
    height: 38,
    decoration: BoxDecoration(
      color: AppColors.surface,
      borderRadius: BorderRadius.circular(12),
      border: Border.all(color: AppColors.border),
    ),
    child: IconButton(
      tooltip: tooltip,
      padding: EdgeInsets.zero,
      onPressed: onPressed,
      icon: Icon(icon, size: 20),
    ),
  );
}

class _CounterChip extends StatelessWidget {
  const _CounterChip({this.icon, this.iconColor, required this.label});

  final IconData? icon;
  final Color? iconColor;
  final String label;

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 7),
    decoration: BoxDecoration(
      color: AppColors.surface,
      borderRadius: BorderRadius.circular(10),
      border: Border.all(color: AppColors.border),
    ),
    child: Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (icon != null) ...[
          Icon(icon, size: 16, color: iconColor ?? AppColors.ink),
          const SizedBox(width: 3),
        ],
        Text(label, style: const TextStyle(fontWeight: FontWeight.w900)),
      ],
    ),
  );
}

class _StreakChip extends StatelessWidget {
  const _StreakChip({required this.label, required this.streak});

  final String label;
  final int streak;

  @override
  Widget build(BuildContext context) {
    final active = streak >= 2;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: active
            ? AppColors.orange.withValues(alpha: .16)
            : AppColors.surface,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(
          color: active
              ? AppColors.orange.withValues(alpha: .55)
              : AppColors.border,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.local_fire_department_rounded,
            size: 16,
            color: active ? AppColors.orange : AppColors.muted,
          ),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(
              color: active ? AppColors.orange : AppColors.ink,
              fontWeight: FontWeight.w900,
            ),
          ),
        ],
      ),
    );
  }
}

class _TimerChip extends StatelessWidget {
  const _TimerChip({required this.seconds});
  final int seconds;
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 5),
    decoration: BoxDecoration(
      color: seconds <= 10
          ? AppColors.red.withValues(alpha: .2)
          : AppColors.surface,
      borderRadius: BorderRadius.circular(9),
      border: Border.all(
        color: seconds <= 10 ? AppColors.red : AppColors.border,
      ),
    ),
    child: Text(
      '0:${seconds.toString().padLeft(2, '0')}',
      style: TextStyle(
        color: seconds <= 10 ? AppColors.red : AppColors.ink,
        fontWeight: FontWeight.w900,
      ),
    ),
  );
}
