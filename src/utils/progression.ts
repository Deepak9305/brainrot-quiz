import { AchievementContext, ACHIEVEMENT_DEFINITIONS } from '../data/achievements';
import { TITLE_DEFINITIONS } from '../data/titles';
import { QuizSessionState, UserStats } from '../types';

export function evaluateTitleConditions(stats: UserStats): string[] {
  return TITLE_DEFINITIONS
    .filter((definition) => definition.condition(stats))
    .map((definition) => definition.title);
}

/** Titles are historical unlocks. A condition may stop being true later, but
 * an earned title remains available for the player to equip. */
export function evaluateTitles(stats: UserStats): string[] {
  return [...new Set(['Brainrot NPC', ...stats.unlockedTitles, ...evaluateTitleConditions(stats)])];
}

export function evaluateAchievementConditions(stats: UserStats, session?: QuizSessionState): string[] {
  const context: AchievementContext = { stats, session };
  return ACHIEVEMENT_DEFINITIONS
    .filter((definition) => definition.condition(context))
    .map((definition) => definition.id);
}

/** Achievements are historical unlocks. Conditions can stop being true later,
 * but an earned achievement must remain in the save forever. */
export function evaluateAchievements(stats: UserStats, session?: QuizSessionState): string[] {
  return [...new Set([...stats.unlockedAchievements, ...evaluateAchievementConditions(stats, session)])];
}
