import { RewardCycle, StreakStatus, UserStats } from '../types';
import { evaluateAchievements, evaluateTitles } from './progression';

export const SAVE_SCHEMA_VERSION = 3;
export const MAX_STREAK_FREEZES = 3;
const STORAGE_KEY = 'brainrot_quiz_save_v3';
const LEGACY_STORAGE_KEYS = ['brainrot_quiz_save_v2', 'brainrot_quiz_save_v1'];

export function getDateString(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function daysBetween(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0;
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 86_400_000));
}

export interface StreakEvaluation {
  stats: UserStats;
  status: StreakStatus;
  missedDays: number;
  canBeProtected: boolean;
}

export const INITIAL_USER_STATS: UserStats = {
  streak: 0,
  longestStreak: 0,
  lastPlayedDate: '',
  lastDailyCompletedDate: '',
  auraPoints: 500,
  streakFreezes: 1,
  recentQuestionIds: [],
  quizzesCompleted: 0,
  totalCorrect: 0,
  totalWrong: 0,
  correctByCategory: {},
  highestRushScore: 0,
  highestChallengeWave: 0,
  unlockedTitles: ['Brainrot NPC', 'Skibidi Cadet'],
  currentTitle: 'Brainrot NPC',
  unlockedAchievements: [],
  personalBests: {},
  crtEnabled: true,
  scanlinesEnabled: true,
  screenShakeEnabled: true,
  soundEnabled: true,
  claimedDays: [],
  rewardCycle: {
    cycleStartDate: '',
    cycleNumber: 1,
    completedDays: 0,
    claimedDays: [],
  },
  streakStatus: 'active',
  protectedMissedDays: 0,
};

function sanitizeRewardCycle(data: Partial<UserStats>): RewardCycle {
  const incoming = data.rewardCycle;
  const legacyClaimed = Array.isArray(data.claimedDays)
    ? data.claimedDays.filter((day) => Number.isInteger(day) && day >= 1 && day <= 7)
    : [];
  const claimedDays = Array.isArray(incoming?.claimedDays)
    ? incoming.claimedDays.filter((day) => Number.isInteger(day) && day >= 1 && day <= 7)
    : legacyClaimed;
  const completedDays = Math.min(
    7,
    Math.max(
      0,
      Number.isInteger(incoming?.completedDays)
        ? Number(incoming?.completedDays)
        : Math.max(legacyClaimed.length, ...legacyClaimed, 0),
    ),
  );

  return {
    cycleStartDate: typeof incoming?.cycleStartDate === 'string' ? incoming.cycleStartDate : data.lastDailyCompletedDate ?? '',
    cycleNumber: Math.max(1, Number(incoming?.cycleNumber) || 1),
    completedDays,
    claimedDays: [...new Set(claimedDays)],
  };
}

function sanitizeStats(data: Partial<UserStats>): UserStats {
  const stats: UserStats = {
    ...INITIAL_USER_STATS,
    ...data,
    auraPoints: Math.max(0, Number(data.auraPoints ?? INITIAL_USER_STATS.auraPoints) || 0),
    streakFreezes: Math.min(MAX_STREAK_FREEZES, Math.max(0, Number(data.streakFreezes ?? INITIAL_USER_STATS.streakFreezes) || 0)),
    recentQuestionIds: Array.isArray(data.recentQuestionIds) ? data.recentQuestionIds.filter(Boolean).slice(0, 100) : [],
    unlockedTitles: Array.isArray(data.unlockedTitles) && data.unlockedTitles.length > 0
      ? [...new Set(data.unlockedTitles.filter(Boolean))]
      : INITIAL_USER_STATS.unlockedTitles,
    unlockedAchievements: Array.isArray(data.unlockedAchievements) ? [...new Set(data.unlockedAchievements.filter(Boolean))] : [],
    personalBests: data.personalBests && typeof data.personalBests === 'object' ? data.personalBests : {},
    correctByCategory: data.correctByCategory && typeof data.correctByCategory === 'object' ? data.correctByCategory : {},
    claimedDays: Array.isArray(data.claimedDays) ? data.claimedDays.filter((day) => day >= 1 && day <= 7) : [],
    rewardCycle: sanitizeRewardCycle(data),
    streakStatus: data.streakStatus === 'protected' || data.streakStatus === 'expired' ? data.streakStatus : 'active',
    protectedMissedDays: Math.max(0, Number(data.protectedMissedDays) || 0),
  };

  if (!stats.lastDailyCompletedDate && stats.quizzesCompleted === 0) {
    stats.streak = 0;
    stats.longestStreak = 0;
  }
  stats.claimedDays = [...stats.rewardCycle.claimedDays];
  return stats;
}

export function loadUserStats(): UserStats {
  if (typeof window === 'undefined') return { ...INITIAL_USER_STATS };
  try {
    const raw = [STORAGE_KEY, ...LEGACY_STORAGE_KEYS]
      .map((key) => localStorage.getItem(key))
      .find(Boolean);
    if (!raw) return { ...INITIAL_USER_STATS };
    return sanitizeStats(JSON.parse(raw) as Partial<UserStats>);
  } catch {
    return { ...INITIAL_USER_STATS };
  }
}

export function saveUserStats(stats: UserStats): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizeStats(stats)));
  } catch {
    // Offline progress is best-effort. Gameplay must continue if storage is blocked.
  }
}

/** Evaluate the visible state without consuming a shield. */
export function evaluateStreakState(currentStats: UserStats, date = new Date()): StreakEvaluation {
  const today = getDateString(date);
  if (!currentStats.lastDailyCompletedDate) {
    return { stats: { ...currentStats, streakStatus: 'active', protectedMissedDays: 0 }, status: 'active', missedDays: 0, canBeProtected: false };
  }

  const elapsedDays = daysBetween(currentStats.lastDailyCompletedDate, today);
  const missedDays = Math.max(0, elapsedDays - 1);
  if (missedDays === 0) {
    return { stats: { ...currentStats, streakStatus: 'active', protectedMissedDays: 0 }, status: 'active', missedDays: 0, canBeProtected: false };
  }

  if (currentStats.streakFreezes >= missedDays) {
    return {
      stats: { ...currentStats, streakStatus: 'protected', protectedMissedDays: missedDays },
      status: 'protected',
      missedDays,
      canBeProtected: true,
    };
  }

  return {
    stats: { ...currentStats, streak: 0, streakStatus: 'expired', protectedMissedDays: 0 },
    status: 'expired',
    missedDays,
    canBeProtected: false,
  };
}

function advanceRewardCycle(cycle: RewardCycle, today: string): RewardCycle {
  if (cycle.completedDays >= 7) {
    return { cycleStartDate: today, cycleNumber: cycle.cycleNumber + 1, completedDays: 1, claimedDays: [] };
  }
  return {
    cycleStartDate: cycle.cycleStartDate || today,
    cycleNumber: cycle.cycleNumber || 1,
    completedDays: Math.min(7, cycle.completedDays + 1),
    claimedDays: [...cycle.claimedDays],
  };
}

export function recordGameCompletion(
  currentStats: UserStats,
  correctTotal: number,
  wrongTotal: number,
  earnedAura: number,
  mode: string,
  extraScore = 0,
  dailyPerfect = false,
  correctByCategory: Record<string, number> = {},
  date = new Date(),
): { updatedStats: UserStats; streakExtended: boolean; usedFreeze: number; dailyPerfectBonus: number } {
  const today = getDateString(date);
  const evaluated = evaluateStreakState(currentStats, date);
  const isDaily = mode === 'daily';
  const alreadyCompletedDaily = isDaily && currentStats.lastDailyCompletedDate === today;
  const dailyFirstCompletion = isDaily && !alreadyCompletedDaily;
  const dailyGap = currentStats.lastDailyCompletedDate ? daysBetween(currentStats.lastDailyCompletedDate, today) : 0;
  const missedDays = Math.max(0, dailyGap - 1);

  let streak = evaluated.stats.streak;
  let streakFreezes = evaluated.stats.streakFreezes;
  let streakExtended = false;
  let usedFreeze = 0;

  if (dailyFirstCompletion) {
    if (!currentStats.lastDailyCompletedDate || dailyGap === 0) {
      streak = 1;
    } else if (missedDays > 0 && currentStats.streakFreezes >= missedDays) {
      usedFreeze = missedDays;
      streakFreezes -= missedDays;
      streak = Math.max(0, currentStats.streak) + missedDays + 1;
    } else if (dailyGap === 1) {
      streak = Math.max(0, currentStats.streak) + 1;
    } else {
      streak = 1;
    }
    streakExtended = true;
  }

  const dailyPerfectBonus = dailyFirstCompletion && dailyPerfect ? 500 : 0;
  const rewardCycle = dailyFirstCompletion
    ? advanceRewardCycle(evaluated.stats.rewardCycle, today)
    : evaluated.stats.rewardCycle;
  const mergedCategoryCounts = { ...evaluated.stats.correctByCategory };
  Object.entries(correctByCategory).forEach(([category, count]) => {
    mergedCategoryCounts[category] = (mergedCategoryCounts[category] ?? 0) + count;
  });

  const updatedStats: UserStats = {
    ...evaluated.stats,
    streak,
    streakFreezes: Math.max(0, streakFreezes),
    streakStatus: 'active',
    protectedMissedDays: 0,
    longestStreak: Math.max(evaluated.stats.longestStreak, streak),
    lastPlayedDate: today,
    lastDailyCompletedDate: dailyFirstCompletion ? today : evaluated.stats.lastDailyCompletedDate,
    auraPoints: evaluated.stats.auraPoints + (alreadyCompletedDaily ? 0 : earnedAura + dailyPerfectBonus),
    quizzesCompleted: evaluated.stats.quizzesCompleted + 1,
    totalCorrect: evaluated.stats.totalCorrect + correctTotal,
    totalWrong: evaluated.stats.totalWrong + wrongTotal,
    correctByCategory: mergedCategoryCounts,
    highestRushScore: mode === 'rush' ? Math.max(evaluated.stats.highestRushScore, extraScore) : evaluated.stats.highestRushScore,
    highestChallengeWave: mode === 'challenge' ? Math.max(evaluated.stats.highestChallengeWave, extraScore) : evaluated.stats.highestChallengeWave,
    rewardCycle,
    claimedDays: [...rewardCycle.claimedDays],
    personalBests: {
      ...evaluated.stats.personalBests,
      ...(mode === 'rush' && extraScore > (evaluated.stats.personalBests.rush ?? 0) ? { rush: extraScore } : {}),
      ...(mode === 'challenge' && extraScore > (evaluated.stats.personalBests.challenge ?? 0) ? { challenge: extraScore } : {}),
    },
  };

  updatedStats.unlockedTitles = evaluateTitles(updatedStats);
  updatedStats.unlockedAchievements = evaluateAchievements(updatedStats);
  if (!updatedStats.currentTitle || !updatedStats.unlockedTitles.includes(updatedStats.currentTitle)) {
    updatedStats.currentTitle = updatedStats.unlockedTitles[updatedStats.unlockedTitles.length - 1] ?? 'Brainrot NPC';
  }

  saveUserStats(updatedStats);
  return { updatedStats, streakExtended, usedFreeze, dailyPerfectBonus };
}

export function claimDailyReward(currentStats: UserStats, dayNumber: number): { updatedStats: UserStats; rewardText: string } {
  const cycle = currentStats.rewardCycle;
  if (dayNumber < 1 || dayNumber > 7 || dayNumber > cycle.completedDays) {
    return { updatedStats: currentStats, rewardText: 'Complete more Daily Challenges to unlock this day.' };
  }
  if (cycle.claimedDays.includes(dayNumber)) {
    return { updatedStats: currentStats, rewardText: 'Already claimed!' };
  }

  let auraGain = dayNumber * 100;
  let freezeGain = 0;
  let rewardText = `+${auraGain} Aura Points`;
  if (dayNumber === 3) {
    if (currentStats.streakFreezes < MAX_STREAK_FREEZES) {
      freezeGain = 1;
      rewardText = '+1 Streak Freeze Shield';
    } else {
      auraGain = 300;
      rewardText = 'FREEZE INVENTORY FULL • +300 Aura instead';
    }
  } else if (dayNumber === 5) {
    auraGain = 500;
    rewardText = '+500 Aura Boost';
  } else if (dayNumber === 7) {
    auraGain = currentStats.streakFreezes < MAX_STREAK_FREEZES ? 1000 : 1500;
    freezeGain = currentStats.streakFreezes < MAX_STREAK_FREEZES ? 1 : 0;
    rewardText = freezeGain ? 'JACKPOT! +1000 Aura +1 Freeze' : 'JACKPOT! +1500 Aura • Freeze inventory full';
  }

  const nextCycle = { ...cycle, claimedDays: [...cycle.claimedDays, dayNumber].sort((a, b) => a - b) };
  const updatedStats = sanitizeStats({
    ...currentStats,
    rewardCycle: nextCycle,
    claimedDays: nextCycle.claimedDays,
    auraPoints: currentStats.auraPoints + auraGain,
    streakFreezes: Math.min(MAX_STREAK_FREEZES, currentStats.streakFreezes + freezeGain),
  });
  saveUserStats(updatedStats);
  return { updatedStats, rewardText };
}

export function buyStreakFreeze(currentStats: UserStats, cost = 400): { updatedStats: UserStats; message: string; ok: boolean } {
  if (currentStats.streakFreezes >= MAX_STREAK_FREEZES) {
    return { updatedStats: currentStats, message: 'FREEZE INVENTORY FULL', ok: false };
  }
  if (currentStats.auraPoints < cost) {
    return { updatedStats: currentStats, message: 'Not enough Aura. Keep cooking.', ok: false };
  }
  const updatedStats = sanitizeStats({
    ...currentStats,
    auraPoints: currentStats.auraPoints - cost,
    streakFreezes: currentStats.streakFreezes + 1,
  });
  saveUserStats(updatedStats);
  return { updatedStats, message: 'Purchased +1 Streak Freeze Shield!', ok: true };
}
