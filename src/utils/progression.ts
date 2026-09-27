import { AchievementContext, ACHIEVEMENT_DEFINITIONS } from '../data/achievements';
import { TITLE_DEFINITIONS } from '../data/titles';
import { QuizSessionState, UserStats } from '../types';

export function evaluateTitles(stats: UserStats): string[] {
  const unlocked = TITLE_DEFINITIONS
    .filter((definition) => definition.condition(stats))
    .map((definition) => definition.title);
  return [...new Set(unlocked)];
}

export function evaluateAchievements(stats: UserStats, session?: QuizSessionState): string[] {
  const context: AchievementContext = { stats, session };
  const unlocked = ACHIEVEMENT_DEFINITIONS
    .filter((definition) => definition.condition(context))
    .map((definition) => definition.id);
  return [...new Set(unlocked)];
}
