import { UserStats } from '../types';

const STORAGE_KEY = 'brainrot_quiz_save_v2';

function getDateString(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getYesterdayString(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return getDateString(date);
}

export const INITIAL_USER_STATS: UserStats = {
  streak: 0,
  longestStreak: 0,
  lastPlayedDate: '',
  lastDailyCompletedDate: '',
  auraPoints: 500,
  streakFreezes: 1,
  quizzesCompleted: 0,
  totalCorrect: 0,
  totalWrong: 0,
  highestRushScore: 0,
  highestChallengeWave: 0,
  recentQuestionIds: [],
  unlockedTitles: ['Brainrot NPC', 'Skibidi Cadet'],
  currentTitle: 'Brainrot NPC',
  crtEnabled: true,
  scanlinesEnabled: true,
  screenShakeEnabled: true,
  soundEnabled: true,
  claimedDays: [],
};

function sanitizeStats(data: Partial<UserStats>): UserStats {
  const stats: UserStats = {
    ...INITIAL_USER_STATS,
    ...data,
    recentQuestionIds: Array.isArray(data.recentQuestionIds) ? data.recentQuestionIds.filter(Boolean).slice(0, 40) : [],
    unlockedTitles: Array.isArray(data.unlockedTitles) && data.unlockedTitles.length > 0
      ? data.unlockedTitles
      : INITIAL_USER_STATS.unlockedTitles,
    claimedDays: Array.isArray(data.claimedDays) ? data.claimedDays.filter((day) => day >= 1 && day <= 7) : [],
  };

  // Migrate the former prototype's default streak so a fresh player starts at zero.
  if (!stats.lastDailyCompletedDate && stats.quizzesCompleted === 0) {
    stats.streak = 0;
    stats.longestStreak = 0;
  }

  return stats;
}

export function loadUserStats(): UserStats {
  if (typeof window === 'undefined') return { ...INITIAL_USER_STATS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem('brainrot_quiz_save_v1');
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

export function recordGameCompletion(
  currentStats: UserStats,
  correctTotal: number,
  wrongTotal: number,
  earnedAura: number,
  mode: string,
  extraScore = 0,
): { updatedStats: UserStats; streakExtended: boolean } {
  const today = getDateString();
  const yesterday = getYesterdayString();
  const isDaily = mode === 'daily';
  const alreadyCompletedDaily = isDaily && currentStats.lastDailyCompletedDate === today;
  let streak = currentStats.streak;
  let streakExtended = false;

  // Only the Daily Challenge advances the daily streak. Replaying it cannot farm rewards.
  if (isDaily && !alreadyCompletedDaily) {
    streak = currentStats.lastDailyCompletedDate === yesterday ? streak + 1 : 1;
    streakExtended = true;
  }

  const updatedStats: UserStats = {
    ...currentStats,
    streak,
    longestStreak: Math.max(currentStats.longestStreak, streak),
    lastPlayedDate: today,
    lastDailyCompletedDate: isDaily && !alreadyCompletedDaily ? today : currentStats.lastDailyCompletedDate,
    auraPoints: currentStats.auraPoints + (alreadyCompletedDaily ? 0 : earnedAura),
    quizzesCompleted: currentStats.quizzesCompleted + 1,
    totalCorrect: currentStats.totalCorrect + correctTotal,
    totalWrong: currentStats.totalWrong + wrongTotal,
    highestRushScore: mode === 'rush' ? Math.max(currentStats.highestRushScore, extraScore) : currentStats.highestRushScore,
    highestChallengeWave: mode === 'challenge' ? Math.max(currentStats.highestChallengeWave, extraScore) : currentStats.highestChallengeWave,
  };

  const titles = [...updatedStats.unlockedTitles];
  if (updatedStats.streak >= 3 && !titles.includes('Ohio Survivor')) titles.push('Ohio Survivor');
  if (updatedStats.streak >= 7 && !titles.includes('Mewing Master')) titles.push('Mewing Master');
  if (updatedStats.auraPoints >= 2000 && !titles.includes('Fanum Tax Collector')) titles.push('Fanum Tax Collector');
  if (updatedStats.highestRushScore >= 10 && !titles.includes('Speed Demon Rizzler')) titles.push('Speed Demon Rizzler');
  if (updatedStats.quizzesCompleted >= 15 && !titles.includes('Giga Chad Mogger')) titles.push('Giga Chad Mogger');
  if (updatedStats.streak >= 14 && !titles.includes('Supreme Brainrot God')) titles.push('Supreme Brainrot God');
  updatedStats.unlockedTitles = titles;

  saveUserStats(updatedStats);
  return { updatedStats, streakExtended };
}

export function claimDailyReward(currentStats: UserStats, dayNumber: number): { updatedStats: UserStats; rewardText: string } {
  if (dayNumber < 1 || dayNumber > 7 || dayNumber > currentStats.streak) {
    return { updatedStats: currentStats, rewardText: 'Complete Daily Brainrot to unlock this day.' };
  }
  if (currentStats.claimedDays.includes(dayNumber)) {
    return { updatedStats: currentStats, rewardText: 'Already claimed!' };
  }

  let auraGain = dayNumber * 100;
  let freezeGain = 0;
  let rewardText = `+${auraGain} Aura Points`;
  if (dayNumber === 3) {
    freezeGain = 1;
    rewardText = '+1 Streak Freeze Shield';
  } else if (dayNumber === 5) {
    auraGain = 500;
    rewardText = '+500 Aura Boost';
  } else if (dayNumber === 7) {
    auraGain = 1000;
    freezeGain = 1;
    rewardText = 'JACKPOT! +1000 Aura +1 Freeze';
  }

  const updatedStats = {
    ...currentStats,
    claimedDays: [...currentStats.claimedDays, dayNumber],
    auraPoints: currentStats.auraPoints + auraGain,
    streakFreezes: currentStats.streakFreezes + freezeGain,
  };
  saveUserStats(updatedStats);
  return { updatedStats, rewardText };
}
