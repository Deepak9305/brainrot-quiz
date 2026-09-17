import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:brainrot_quiz/core/models/game_mode.dart';
import 'package:brainrot_quiz/core/models/player_progress.dart';
import 'package:brainrot_quiz/core/models/question.dart';
import 'package:brainrot_quiz/data/question_repository.dart';
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
