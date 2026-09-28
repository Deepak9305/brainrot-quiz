import { Question } from '../types';

export const DIFFICULTY_MULTIPLIER: Record<Question['difficulty'], number> = {
  easy: 1,
  medium: 1.2,
  hard: 1.5,
  sigma: 2,
};

export function comboMultiplier(combo: number): number {
  if (combo >= 8) return 2;
  if (combo >= 5) return 1.5;
  if (combo >= 3) return 1.2;
  return 1;
}

export function calculateRushScore(difficulty: Question['difficulty'], combo: number, answerTimeMs: number, isCorrect: boolean): number {
  if (!isCorrect) return 0;
  const speedBonus = answerTimeMs < 1_000 ? 75 : answerTimeMs < 2_000 ? 50 : 0;
  return Math.round((100 + speedBonus) * comboMultiplier(combo) * DIFFICULTY_MULTIPLIER[difficulty]);
}

export function calculateNormalScore(combo: number, isCorrect: boolean): number {
  if (!isCorrect) return 0;
  return 100 + Math.min(300, Math.max(0, combo - 1) * 25);
}

export function calculateAuraGain(difficulty: Question['difficulty'], combo: number, isCorrect: boolean): number {
  if (!isCorrect) return 0;
  const comboBonus = combo === 3 ? 10 : combo === 5 ? 20 : combo >= 8 ? 30 : 0;
  const difficultyBonus = difficulty === 'sigma' ? 20 : difficulty === 'hard' ? 10 : 0;
  return 30 + comboBonus + difficultyBonus;
}
