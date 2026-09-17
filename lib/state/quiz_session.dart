import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/models/game_mode.dart';
import '../core/models/question.dart';

final quizSessionProvider = NotifierProvider<QuizSessionNotifier, QuizSession?>(
  QuizSessionNotifier.new,
);

class QuizSession {
  const QuizSession({
    required this.mode,
    required this.questions,
    this.currentIndex = 0,
    this.score = 0,
    this.correctAnswers = 0,
    this.streak = 0,
    this.bestStreak = 0,
    this.selectedAnswer,
    this.isAnswered = false,
    this.lastWasCorrect,
    this.secondsLeft = 60,
    this.resultProcessed = false,
    this.rewardedBonusClaimed = false,
  });

  final GameMode mode;
  final List<QuizQuestion> questions;
  final int currentIndex;
  final int score;
  final int correctAnswers;
  final int streak;
  final int bestStreak;
  final int? selectedAnswer;
  final bool isAnswered;
  final bool? lastWasCorrect;
  final int secondsLeft;
  final bool resultProcessed;
  final bool rewardedBonusClaimed;

  QuizQuestion get currentQuestion => questions[currentIndex];
  bool get isRush => mode == GameMode.rush;
  bool get isComplete => isRush
      ? secondsLeft <= 0
      : currentIndex >= questions.length - 1 && isAnswered;
  double get progress => isRush
      ? secondsLeft / 60
      : (currentIndex + (isAnswered ? 1 : 0)) / questions.length;
  String get multiplierLabel => streak >= 10
      ? '×3'
      : streak >= 5
          ? '×2'
          : streak >= 3
              ? '×1.5'
              : '×1';

  QuizSession copyWith({
    int? currentIndex,
    int? score,
    int? correctAnswers,
    int? streak,
    int? bestStreak,
    int? selectedAnswer,
    bool clearSelection = false,
    bool? isAnswered,
    bool? lastWasCorrect,
    bool clearFeedback = false,
    int? secondsLeft,
    bool? resultProcessed,
    bool? rewardedBonusClaimed,
  }) {
    return QuizSession(
      mode: mode,
      questions: questions,
      currentIndex: currentIndex ?? this.currentIndex,
      score: score ?? this.score,
      correctAnswers: correctAnswers ?? this.correctAnswers,
      streak: streak ?? this.streak,
      bestStreak: bestStreak ?? this.bestStreak,
      selectedAnswer: clearSelection
          ? null
          : selectedAnswer ?? this.selectedAnswer,
      isAnswered: isAnswered ?? this.isAnswered,
      lastWasCorrect: clearFeedback
          ? null
          : lastWasCorrect ?? this.lastWasCorrect,
      secondsLeft: secondsLeft ?? this.secondsLeft,
      resultProcessed: resultProcessed ?? this.resultProcessed,
      rewardedBonusClaimed:
          rewardedBonusClaimed ?? this.rewardedBonusClaimed,
    );
  }
}

class QuizSessionNotifier extends Notifier<QuizSession?> {
  @override
  QuizSession? build() => null;

  void start(GameMode mode, List<QuizQuestion> questions) {
    state = QuizSession(
      mode: mode,
      questions: questions,
      secondsLeft: mode == GameMode.rush ? 60 : 0,
    );
  }

  void answer(int index) {
    final session = state;
    if (session == null ||
        session.isAnswered ||
        index < 0 ||
        index >= session.currentQuestion.answers.length) {
      return;
    }

    final correct = index == session.currentQuestion.correctAnswer;
    final nextStreak = correct ? session.streak + 1 : 0;
    final multiplier = nextStreak >= 10
        ? 3
        : nextStreak >= 5
            ? 2
            : nextStreak >= 3
                ? 1.5
                : 1;
    final points = correct ? (100 * multiplier).round() : 0;
    final penalizedSeconds = session.secondsLeft - 2;

    state = session.copyWith(
      selectedAnswer: index,
      isAnswered: true,
      lastWasCorrect: correct,
      correctAnswers: session.correctAnswers + (correct ? 1 : 0),
      score: session.score + points,
      streak: nextStreak,
      bestStreak: nextStreak > session.bestStreak
          ? nextStreak
          : session.bestStreak,
      secondsLeft: session.isRush && !correct
          ? (penalizedSeconds < 0 ? 0 : penalizedSeconds)
          : session.secondsLeft,
    );
  }

  void next() {
    final session = state;
    if (session == null || !session.isAnswered) return;

    if (session.isRush) {
      if (session.currentIndex >= session.questions.length - 1) {
        state = session.copyWith(secondsLeft: 0);
        return;
      }
      state = session.copyWith(
        currentIndex: session.currentIndex + 1,
        clearSelection: true,
        isAnswered: false,
        clearFeedback: true,
      );
      return;
    }

    if (session.currentIndex < session.questions.length - 1) {
      state = session.copyWith(
        currentIndex: session.currentIndex + 1,
        clearSelection: true,
        isAnswered: false,
        clearFeedback: true,
      );
    }
  }

  void tick() {
    final session = state;
    if (session == null || !session.isRush || session.secondsLeft <= 0) return;
    state = session.copyWith(secondsLeft: session.secondsLeft - 1);
  }

  void finish() {
    final session = state;
    if (session == null) return;
    state = session.copyWith(secondsLeft: 0);
  }

  bool markResultProcessed() {
    final session = state;
    if (session == null || session.resultProcessed) return false;
    state = session.copyWith(resultProcessed: true);
    return true;
  }

  bool markRewardedBonusClaimed() {
    final session = state;
    if (session == null || session.rewardedBonusClaimed) return false;
    state = session.copyWith(rewardedBonusClaimed: true);
    return true;
  }
}
