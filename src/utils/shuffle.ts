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
  avoidSubjects?: string[];
}

function difficultyTarget(index: number, total: number): Question['difficulty'][] {
  const ratio = total <= 1 ? 0 : index / (total - 1);
  if (ratio < 0.2) return ['easy', 'medium'];
  if (ratio < 0.6) return ['medium', 'easy', 'hard'];
  if (ratio < 0.9) return ['medium', 'hard', 'sigma'];
  return ['hard', 'sigma', 'medium'];
}

/**
 * Builds a session by balancing recency, subject reuse, category variety and
 * a readable difficulty curve. It still has a random tie-breaker, so replay
 * does not feel like the same list with the options moved around.
 */
export function prepareQuizQuestions(questions: Question[], options: PrepareOptions = {}): Question[] {
  const random = options.random ?? Math.random;
  const limit = Math.min(options.limit ?? questions.length, questions.length);
  const recentRank = new Map((options.recentIds ?? []).map((id, index) => [id, index]));
  const remaining = [...questions];
  const selected: Question[] = [];
  const categoryCounts = new Map<string, number>();
  const subjectCounts = new Map<string, number>();
  const avoidSubjects = new Set(options.avoidSubjects ?? []);

  while (selected.length < limit && remaining.length > 0) {
    const targetDifficulties = difficultyTarget(selected.length, limit);
    const candidates = remaining.filter((question) => {
      const subject = question.subjectKey ?? question.visualContent ?? question.id;
      const lastSubject = selected[selected.length - 1]?.subjectKey ?? selected[selected.length - 1]?.visualContent;
      return subject !== lastSubject || remaining.length === 1;
    });
    const pool = candidates.length > 0 ? candidates : remaining;

    const scored = pool.map((question) => {
      const category = question.category ?? question.mode;
      const subject = question.subjectKey ?? question.visualContent ?? question.id;
      const recent = recentRank.get(question.id);
      const recencyPenalty = recent === undefined ? 0 : 45 + Math.max(0, 100 - recent);
      const categoryPenalty = (categoryCounts.get(category) ?? 0) * 35;
      const subjectPenalty = (subjectCounts.get(subject) ?? 0) * 90;
      const avoidPenalty = avoidSubjects.has(subject) ? 120 : 0;
      const difficultyPenalty = targetDifficulties.includes(question.difficulty) ? 0 : 30;
      return { question, score: recencyPenalty + categoryPenalty + subjectPenalty + avoidPenalty + difficultyPenalty + random() * 18 };
    });

    scored.sort((a, b) => a.score - b.score);
    const chosen = scored[0].question;
    const index = remaining.indexOf(chosen);
    remaining.splice(index, 1);
    selected.push(shuffleQuestion(chosen, random));
    const category = chosen.category ?? chosen.mode;
    const subject = chosen.subjectKey ?? chosen.visualContent ?? chosen.id;
    categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
    subjectCounts.set(subject, (subjectCounts.get(subject) ?? 0) + 1);
  }

  return selected;
}

export function buildChallengeQuestions(questions: Question[], random: RandomSource = Math.random): Question[] {
  const targets = [2, 2, 2, 2, 2, 1];
  const selected: Question[] = [];
  const used = new Set<string>();

  targets.forEach((target, index) => {
    const wave = index + 1;
    const wavePool = questions.filter((question) => (question.challengeWave ?? inferChallengeWave(question)) === wave && !used.has(question.id));
    const fallback = questions.filter((question) => !used.has(question.id) && question.difficulty !== 'easy');
    const picked = prepareQuizQuestions(wavePool.length >= target ? wavePool : fallback, { limit: target, random });
    picked.forEach((question) => {
      used.add(question.id);
      selected.push({ ...question, challengeWave: wave });
    });
  });

  return selected;
}

function inferChallengeWave(question: Question): number {
  const match = question.id.match(/(?:chg|challenge)[_-]?(\d+)/i);
  if (!match) return question.difficulty === 'sigma' ? 6 : question.difficulty === 'hard' ? 4 : 2;
  return Math.min(6, Number(match[1]));
}

export function appendRecentQuestionIds(existing: string[], questions: Question[], max = 100): string[] {
  const ids = [...questions.map((question) => question.id), ...existing];
  return [...new Set(ids)].slice(0, max);
}
