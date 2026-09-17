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
    // Rush gets a much larger unique pool so a fast player does not loop the
    // same handful of questions during a single 60-second run.
    final questionCount = widget.mode == GameMode.rush ? 40 : 10;
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

    for (final asset in questions
        .map((question) => question.imageAsset)
        .whereType<String>()
        .take(5)) {
      precacheImage(AssetImage(asset), context);
    }

    if (widget.mode == GameMode.rush) {
      _rushTimer = Timer.periodic(const Duration(seconds: 1), (_) {
        final session = ref.read(quizSessionProvider);
        if (session == null || session.secondsLeft <= 0) {
          _finish();
          return;
        }
        ref.read(quizSessionProvider.notifier).tick();
        final latest = ref.read(quizSessionProvider);
        if (latest != null && latest.secondsLeft <= 0) _finish();
      });
    }

    _startFlashTimer();
  }

  void _startFlashTimer() {
    _flashTimer?.cancel();
    final session = ref.read(quizSessionProvider);
    final question = session?.currentQuestion;

    if (question == null ||
        question.questionType != QuestionType.flash ||
        question.imageAsset == null) {
      if (!_flashVisible && mounted) setState(() => _flashVisible = true);
      return;
    }

    if (mounted) setState(() => _flashVisible = true);
    _flashTimer = Timer(_flashDuration(question), () {
      if (mounted) setState(() => _flashVisible = false);
    });
  }

  Duration _flashDuration(QuizQuestion question) =>
      switch (question.difficulty.toLowerCase()) {
        'insane' => const Duration(milliseconds: 350),
        'hard' => const Duration(milliseconds: 550),
        'medium' => const Duration(milliseconds: 800),
        _ => const Duration(milliseconds: 1100),
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
    Future<void>.delayed(const Duration(milliseconds: 1150), () {
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
    _flashTimer?.cancel();

    final session = ref.read(quizSessionProvider);
    if (session == null) return;

    ref.read(progressProvider.notifier).completeQuiz(
          score: session.score,
          correct: session.correctAnswers,
          bestStreak: session.bestStreak,
          daily: widget.mode == GameMode.daily,
          questionCount: session.questions.length,
          isRush: session.isRush,
        );
    ref.read(analyticsServiceProvider).track('quiz_completed', {
      'mode': widget.mode.name,
      'score': session.score,
      'correct': session.correctAnswers,
    });
    context.go('/results');
  }

  bool _hasVisual(QuizQuestion question) {
    if (question.imageAsset == null || question.imageAsset!.trim().isEmpty) {
      return false;
    }
    return question.questionType == QuestionType.imageChoice ||
        question.questionType == QuestionType.flash ||
        question.questionType == QuestionType.silhouette ||
        question.questionType == QuestionType.zoom;
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) return _QuizLoading(mode: widget.mode);

    final session = ref.watch(quizSessionProvider);
    if (session == null || session.questions.isEmpty) {
      return const SizedBox.shrink();
    }

    final question = session.currentQuestion;
    final progress = widget.mode == GameMode.rush
        ? session.secondsLeft / 60
        : (session.currentIndex + (session.isAnswered ? 1 : 0)) /
            session.questions.length;
    final isCorrect = session.isAnswered && session.lastWasCorrect == true;
    final correctText = question.answers[question.correctAnswer];

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
              const SizedBox(height: 14),
              Row(
                children: [
                  _QuestionTag(question: question),
                  const Spacer(),
                  if (session.streak >= 2)
                    Text(
                      '${session.streak} streak · ${session.multiplierLabel}',
                      style: const TextStyle(
                        color: AppColors.orange,
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                      ),
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
                      if (_hasVisual(question)) ...[
                        _QuestionMedia(
                          question: question,
                          flashVisible: _flashVisible,
                        ),
                        const SizedBox(height: 18),
                      ],
                      Text(
                        question.question,
                        style: const TextStyle(
                          fontSize: 25,
                          height: 1.08,
                          fontWeight: FontWeight.w900,
                          letterSpacing: -.7,
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
                          const SizedBox(height: 8),
                      ],
                      if (session.isAnswered) ...[
                        const SizedBox(height: 12),
                        _FeedbackBar(
                          correct: isCorrect,
                          correctAnswer: correctText,
                          explanation: question.explanation,
                          points: isCorrect
                              ? '+${_earnedPoints(session.streak)}'
                              : null,
                        ),
                      ],
                      const SizedBox(height: 10),
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
                    secondsLeft == null
                        ? '$questionNumber of $questionCount'
                        : widgetLabel(mode),
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
                        fontSize: 13,
                        fontWeight: FontWeight.w900,
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

  static String widgetLabel(GameMode mode) => mode.title;
}

class _QuestionTag extends StatelessWidget {
  const _QuestionTag({required this.question});

  final QuizQuestion question;

  @override
  Widget build(BuildContext context) {
    final label = switch (question.questionType) {
      QuestionType.imageChoice => 'IMAGE',
      QuestionType.flash => 'FLASH',
      QuestionType.finishMeme => 'FINISH IT',
      QuestionType.emoji => 'EMOJI',
      QuestionType.slang => 'SLANG',
      QuestionType.silhouette => 'SILHOUETTE',
      QuestionType.zoom => 'ZOOM',
      QuestionType.sound => 'AUDIO',
      QuestionType.text => question.category.toUpperCase(),
    };

    return Text(
      '$label · ${question.difficulty.toUpperCase()}',
      style: const TextStyle(
        color: AppColors.muted,
        fontSize: 10,
        fontWeight: FontWeight.w800,
        letterSpacing: .65,
      ),
    );
  }
}

class _FeedbackBar extends StatelessWidget {
  const _FeedbackBar({
    required this.correct,
    required this.correctAnswer,
    this.explanation,
    this.points,
  });

  final bool correct;
  final String correctAnswer;
  final String? explanation;
  final String? points;

  @override
  Widget build(BuildContext context) {
    final color = correct ? AppColors.lime : AppColors.red;
    final detail = explanation?.trim().isNotEmpty == true
        ? explanation!.trim()
        : correct
            ? null
            : 'Correct answer: $correctAnswer';

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 13, vertical: 11),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            correct ? Icons.check_rounded : Icons.close_rounded,
            color: color,
            size: 18,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  correct ? 'Correct' : 'Not quite',
                  style: TextStyle(
                    color: color,
                    fontSize: 12,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                if (detail != null) ...[
                  const SizedBox(height: 3),
                  Text(
                    detail,
                    style: const TextStyle(
                      color: AppColors.muted,
                      fontSize: 11,
                      height: 1.3,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ],
            ),
          ),
          if (points != null) ...[
            const SizedBox(width: 8),
            Text(
              points!,
              style: const TextStyle(
                color: AppColors.muted,
                fontSize: 11,
                fontWeight: FontWeight.w800,
              ),
            ),
          ],
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
              'Image hidden — answer from memory',
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

    return BrainrotImage(
      assetPath: question.imageAsset,
      height: 200,
      semanticLabel: 'Quiz image',
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
                  'Building a fresh ${mode.title} round…',
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
