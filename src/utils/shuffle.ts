import { Question } from '../types';

export type RandomSource = () => number;

export function fisherYates<T>(items: T[], random: RandomSource = Math.random): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function shuffleQuestion(question: Question, random: RandomSource = Math.random): Question {
  const correctOptionText = question.options[question.correctAnswer];
  const shuffledOptions = fisherYates(question.options, random);
  const newCorrectIndex = shuffledOptions.indexOf(correctOptionText);

  return {
    ...question,
    options: shuffledOptions,
    correctAnswer: newCorrectIndex >= 0 ? newCorrectIndex : 0,
  };
}

interface PrepareOptions {
  limit?: number;
  recentIds?: string[];
  random?: RandomSource;
}

/** Builds a replayable session with unseen-question preference and safe shuffling. */
export function prepareQuizQuestions(questions: Question[], options: PrepareOptions = {}): Question[] {
  const random = options.random ?? Math.random;
  const limit = options.limit ?? questions.length;
  const recent = new Set(options.recentIds ?? []);
  const fresh = questions.filter((question) => !recent.has(question.id));
  const seen = questions.filter((question) => recent.has(question.id));
  const ordered = [...fisherYates(fresh, random), ...fisherYates(seen, random)];

  return ordered
    .slice(0, Math.min(limit, ordered.length))
    .map((question) => shuffleQuestion(question, random));
}

export function appendRecentQuestionIds(existing: string[], questions: Question[], max = 40): string[] {
  const ids = [...questions.map((question) => question.id), ...existing];
  return [...new Set(ids)].slice(0, max);
}
