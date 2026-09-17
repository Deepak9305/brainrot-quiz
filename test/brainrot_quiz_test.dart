import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:brainrot_quiz/core/models/game_mode.dart';
import 'package:brainrot_quiz/core/models/player_progress.dart';
import 'package:brainrot_quiz/core/models/question.dart';
import 'package:brainrot_quiz/data/question_repository.dart';
import 'package:brainrot_quiz/services/storage_service.dart';
import 'package:brainrot_quiz/state/providers.dart';
import 'package:brainrot_quiz/state/quiz_session.dart';

void main() {
  test('question parsing clamps invalid answer indexes', () {
    final question = QuizQuestion.fromJson({
      'id': 'test',
      'question': 'Pick one',
      'answers': ['A', 'B'],
      'correctAnswer': 99,
      'questionType': 'text',
    });
    expect(question.correctAnswer, 1);
    expect(question.questionType, QuestionType.text);
  });

  test('correct answer increases streak and score', () {
    final container = ProviderContainer();
    addTearDown(container.dispose);
    final notifier = container.read(quizSessionProvider.notifier);
    notifier.start(GameMode.mix, const [
      QuizQuestion(
        id: '1',
        category: 'mix',
        difficulty: 'easy',
        questionType: QuestionType.text,
        question: 'Pick A',
        answers: ['A', 'B'],
        correctAnswer: 0,
      ),
    ]);
    notifier.answer(0);
    final session = container.read(quizSessionProvider)!;
    expect(session.correctAnswers, 1);
    expect(session.streak, 1);
    expect(session.score, 100);
    expect(session.isAnswered, isTrue);
  });

  test('wrong rush answer applies the time penalty', () {
    final container = ProviderContainer();
    addTearDown(container.dispose);
    final notifier = container.read(quizSessionProvider.notifier);
    notifier.start(GameMode.rush, const [
      QuizQuestion(
        id: '1',
        category: 'mix',
        difficulty: 'easy',
        questionType: QuestionType.text,
        question: 'Pick A',
        answers: ['A', 'B'],
        correctAnswer: 0,
      ),
    ]);
    notifier.answer(1);
    expect(container.read(quizSessionProvider)!.secondsLeft, 58);
    expect(container.read(quizSessionProvider)!.streak, 0);
  });

  test('rush time penalty never goes negative', () {
    final container = ProviderContainer();
    addTearDown(container.dispose);
    final notifier = container.read(quizSessionProvider.notifier);
    notifier.start(GameMode.rush, const [
      QuizQuestion(
        id: '1',
        category: 'mix',
        difficulty: 'easy',
        questionType: QuestionType.text,
        question: 'Pick A',
        answers: ['A', 'B'],
        correctAnswer: 0,
      ),
    ]);
    for (var i = 0; i < 59; i++) {
      notifier.tick();
    }
    notifier.answer(1);
    expect(container.read(quizSessionProvider)!.secondsLeft, 0);
  });

  test('purchased theme survives progress serialization', () {
    final progress = const PlayerProgress().copyWith(
      coins: 500,
      ownedThemes: const ['acid', 'purple'],
      equippedTheme: 'purple',
    );
    final restored = PlayerProgress.fromJson(progress.toJson());
    expect(restored.ownedThemes, containsAll(['acid', 'purple']));
    expect(restored.equippedTheme, 'purple');
  });

  test('legacy or malformed progress is sanitized instead of crashing', () {
    final restored = PlayerProgress.fromJson({
      'coins': -50,
      'xp': '125',
      'level': 0,
      'seenIntro': 'true',
      'soundEffects': 0,
      'achievements': {
        'perfect': 1,
        'zero': 'false',
        'unknown': 'true',
      },
      'ownedThemes': 'not-a-list',
      'equippedTheme': 'purple',
    });

    expect(restored.coins, 0);
    expect(restored.xp, 125);
    expect(restored.level, 1);
    expect(restored.seenIntro, isTrue);
    expect(restored.soundEffects, isFalse);
    expect(restored.achievements['perfect'], isTrue);
    expect(restored.achievements['zero'], isFalse);
    expect(restored.ownedThemes, ['acid']);
    expect(restored.equippedTheme, 'acid');
  });

  test('daily replay cannot farm coins xp or quiz completions', () async {
    final container = await _progressContainer();
    addTearDown(container.dispose);
    final notifier = container.read(progressProvider.notifier);

    notifier.completeQuiz(
      score: 1800,
      correct: 10,
      bestStreak: 10,
      daily: true,
      questionCount: 10,
    );
    final first = container.read(progressProvider);

    notifier.completeQuiz(
      score: 700,
      correct: 5,
      bestStreak: 2,
      daily: true,
      questionCount: 10,
    );
    final replay = container.read(progressProvider);

    expect(replay.coins, first.coins);
    expect(replay.xp, first.xp);
    expect(replay.completedQuizzes, first.completedQuizzes);
    expect(replay.lifetimeCoinsEarned, first.lifetimeCoinsEarned);
    expect(replay.dailyStreak, first.dailyStreak);
    expect(replay.dailyScore, first.dailyScore);
  });

  test('rush cannot unlock fixed 10-question score achievements', () async {
    final container = await _progressContainer();
    addTearDown(container.dispose);
    final notifier = container.read(progressProvider.notifier);

    notifier.completeQuiz(
      score: 2200,
      correct: 10,
      bestStreak: 10,
      questionCount: 40,
      isRush: true,
    );
    var progress = container.read(progressProvider);
    expect(progress.achievements['perfect'], isNot(true));

    await notifier.resetProgress();
    notifier.completeQuiz(
      score: 0,
      correct: 0,
      bestStreak: 0,
      questionCount: 40,
      isRush: true,
    );
    progress = container.read(progressProvider);
    expect(progress.achievements['zero'], isNot(true));
  });

  test('normal ten-question rounds still unlock score achievements', () async {
    final container = await _progressContainer();
    addTearDown(container.dispose);
    final notifier = container.read(progressProvider.notifier);

    notifier.completeQuiz(
      score: 1800,
      correct: 10,
      bestStreak: 10,
      questionCount: 10,
    );
    expect(container.read(progressProvider).achievements['perfect'], isTrue);
  });

  testWidgets('every active mode loads a full unique round', (tester) async {
    const modes = [
      GameMode.mix,
      GameMode.italianBrainrot,
      GameMode.guessSound,
      GameMode.oneSecond,
      GameMode.slang,
      GameMode.finishMeme,
      GameMode.ogBrainrot,
      GameMode.impossible,
      GameMode.daily,
    ];

    for (final mode in modes) {
      final questions = await QuestionRepository().questionsFor(mode, count: 10);
      expect(questions, hasLength(10), reason: '${mode.name} should fill a round');
      expect(
        questions.map((question) => question.id).toSet(),
        hasLength(10),
        reason: '${mode.name} should not repeat questions in one round',
      );
      expect(
        questions.where((question) => question.questionType == QuestionType.sound),
        isEmpty,
        reason: '${mode.name} must not serve silent audio questions',
      );
    }
  });

  testWidgets('emoji mode contains real emoji questions instead of sound prompts', (
    tester,
  ) async {
    final questions = await QuestionRepository().questionsFor(
      GameMode.guessSound,
      count: 10,
    );
    expect(questions, hasLength(10));
    expect(
      questions.every((question) => question.questionType == QuestionType.emoji),
      isTrue,
    );
  });

  testWidgets('rush can supply forty unique questions without looping', (
    tester,
  ) async {
    final questions = await QuestionRepository().questionsFor(
      GameMode.rush,
      count: 40,
    );
    expect(questions, hasLength(40));
    expect(questions.map((question) => question.id).toSet(), hasLength(40));
  });

  testWidgets('mixed mode includes more than Italian character content', (
    tester,
  ) async {
    final questions = await QuestionRepository().questionsFor(
      GameMode.mix,
      count: 20,
    );
    final categories = questions.map((question) => question.category).toSet();
    expect(questions, hasLength(20));
    expect(categories.length, greaterThanOrEqualTo(4));
  });
}

Future<ProviderContainer> _progressContainer() async {
  SharedPreferences.setMockInitialValues({});
  final preferences = await SharedPreferences.getInstance();
  return ProviderContainer(
    overrides: [
      storageServiceProvider.overrideWithValue(StorageService(preferences)),
    ],
  );
}
