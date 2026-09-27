import { UserStats, QuizSessionState } from '../types';

export interface AchievementContext {
  stats: UserStats;
  session?: QuizSessionState;
}

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  condition: (context: AchievementContext) => boolean;
}

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  { id: 'first-rot', title: 'FIRST ROT', description: 'Complete your first quiz.', condition: ({ stats }) => stats.quizzesCompleted >= 1 },
  { id: 'locked-in', title: 'LOCKED IN', description: 'Get five correct in a row.', condition: ({ stats, session }) => Math.max(stats.personalBests.combo ?? 0, session?.highestCombo ?? 0) >= 5 },
  { id: 'aura-farmer', title: 'AURA FARMER', description: 'Earn 5,000 Aura.', condition: ({ stats }) => stats.auraPoints >= 5_000 },
  { id: 'perfect-rot', title: 'PERFECT ROT', description: 'Get 10/10 in Brainrot Mix.', condition: ({ session }) => session?.mode === 'mix' && session.correctCount === 10 && session.wrongCount === 0 },
  { id: 'italian-scholar', title: 'ITALIAN SCHOLAR', description: 'Answer 25 Italian Brainrot questions correctly.', condition: ({ stats }) => (stats.correctByCategory.italian_brainrot ?? 0) >= 25 },
  { id: 'speed-demon', title: 'SPEED DEMON', description: 'Hit a 5,000-point Rush score.', condition: ({ stats }) => stats.highestRushScore >= 5_000 },
  { id: 'last-heart', title: 'LAST HEART', description: 'Finish Challenge with one heart left.', condition: ({ session }) => session?.mode === 'challenge' && session.isFinished && session.lives === 1 },
  { id: 'daily-grinder', title: 'DAILY GRINDER', description: 'Reach a seven-day Daily streak.', condition: ({ stats }) => stats.streak >= 7 },
  { id: 'touch-grass', title: 'TOUCH GRASS', description: 'Complete 50 quizzes.', condition: ({ stats }) => stats.quizzesCompleted >= 50 },
  { id: 'final-boss', title: 'FINAL BOSS', description: 'Clear the Challenge Final Boss.', condition: ({ stats, session }) => stats.finalBossWins >= 1 || session?.challengeVictory === true },
];
