import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:brainrot_quiz/core/models/game_mode.dart';
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

  testWidgets('bundled question assets load from the Flutter asset bundle', (
    tester,
  ) async {
    final questions = await QuestionRepository().questionsFor(
      GameMode.mix,
      count: 15,
    );
    expect(questions, hasLength(15));
    expect(
      questions.any(
        (question) =>
            question.imageAsset == 'assets/images/tralalero_tralala.webp',
      ),
      isTrue,
    );
  });
}
