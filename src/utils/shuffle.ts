import { Question } from '../types';

/**
 * Shuffles the options of a question and updates the correctAnswer index
 * to guarantee variety across A, B, C, and D.
 */
export function shuffleQuestion(q: Question): Question {
  const correctOptionText = q.options[q.correctAnswer];
  const shuffledOptions = [...q.options];

  // Fisher-Yates shuffle
  for (let i = shuffledOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffledOptions[i];
    shuffledOptions[i] = shuffledOptions[j];
    shuffledOptions[j] = temp;
  }

  const newCorrectIndex = shuffledOptions.indexOf(correctOptionText);

  return {
    ...q,
    options: shuffledOptions,
    correctAnswer: newCorrectIndex >= 0 ? newCorrectIndex : 0,
  };
}

export function prepareQuizQuestions(questions: Question[]): Question[] {
  return questions.map(q => shuffleQuestion(q));
}
