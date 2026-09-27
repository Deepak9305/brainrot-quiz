import { UserStats } from '../types';

const STORAGE_KEY = 'brainrot_quiz_save_v1';

const getTodayString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getYesterdayString = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const INITIAL_USER_STATS: UserStats = {
  streak: 1,
  longestStreak: 1,
  lastPlayedDate: getTodayString(),
  lastDailyCompletedDate: '',
  auraPoints: 500, // starting aura
  streakFreezes: 1,
  quizzesCompleted: 0,
  totalCorrect: 0,
  totalWrong: 0,
  highestRushScore: 0,
  highestChallengeWave: 0,
  unlockedTitles: ['Brainrot NPC', 'Skibidi Cadet'],
  currentTitle: 'Brainrot NPC',
  crtEnabled: true,
  scanlinesEnabled: true,
  screenShakeEnabled: true,
  soundEnabled: true,
  claimedDays: [1],
};

export function loadUserStats(): UserStats {
  if (typeof window === 'undefined') return INITIAL_USER_STATS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveUserStats(INITIAL_USER_STATS);
      return INITIAL_USER_STATS;
    }
    const data = JSON.parse(raw) as UserStats;
    
    // Check streak validity on load
    const today = getTodayString();
    const yesterday = getYesterdayString();

    if (data.lastPlayedDate !== today) {
      if (data.lastPlayedDate === yesterday) {
        // Logged in today after playing yesterday: ready to extend
      } else {
        // More than 1 day missed!
        if (data.streakFreezes > 0 && data.streak > 1) {
          // Use a streak freeze!
          data.streakFreezes -= 1;
          data.lastPlayedDate = yesterday; // save the streak
        } else if (data.lastPlayedDate !== yesterday) {
          // Streak broken
          data.streak = 1;
        }
      }
    }

    return { ...INITIAL_USER_STATS, ...data };
  } catch {
    return INITIAL_USER_STATS;
  }
}

export function saveUserStats(stats: UserStats): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
}

export function recordGameCompletion(
  currentStats: UserStats,
  isCorrectTotal: number,
  isWrongTotal: number,
  earnedAura: number,
  mode: string,
  extraScore = 0
): { updatedStats: UserStats; streakExtended: boolean } {
  const today = getTodayString();
  const yesterday = getYesterdayString();
  let streak = currentStats.streak;
  let streakExtended = false;

  // Streak logic
  if (currentStats.lastPlayedDate !== today) {
    if (currentStats.lastPlayedDate === yesterday) {
      streak += 1;
      streakExtended = true;
    } else {
      streak = 1;
      streakExtended = true;
    }
  }

  const longestStreak = Math.max(currentStats.longestStreak, streak);
  const updatedStats: UserStats = {
    ...currentStats,
    streak,
    longestStreak,
    lastPlayedDate: today,
    auraPoints: currentStats.auraPoints + earnedAura,
    quizzesCompleted: currentStats.quizzesCompleted + 1,
    totalCorrect: currentStats.totalCorrect + isCorrectTotal,
    totalWrong: currentStats.totalWrong + isWrongTotal,
    highestRushScore: mode === 'rush' ? Math.max(currentStats.highestRushScore, extraScore) : currentStats.highestRushScore,
    highestChallengeWave: mode === 'challenge' ? Math.max(currentStats.highestChallengeWave, extraScore) : currentStats.highestChallengeWave,
  };

  // Unlockable Titles based on achievements
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
  if (currentStats.claimedDays.includes(dayNumber)) {
    return { updatedStats: currentStats, rewardText: 'Already claimed!' };
  }

  const newClaimed = [...currentStats.claimedDays, dayNumber];
  let auraGain = 150;
  let freezeGain = 0;
  let rewardText = '+150 Aura Points';

  if (dayNumber === 3) {
    freezeGain = 1;
    rewardText = '+1 Streak Freeze Shield 🛡️';
  } else if (dayNumber === 5) {
    auraGain = 500;
    rewardText = '+500 Aura & Rizz Boost 🔥';
  } else if (dayNumber === 7) {
    auraGain = 1000;
    freezeGain = 1;
    rewardText = 'JACKPOT! +1000 Aura & +1 Freeze 👑';
  } else {
    auraGain = dayNumber * 100;
    rewardText = `+${auraGain} Aura Points ⚡`;
  }

  const updated: UserStats = {
    ...currentStats,
    claimedDays: newClaimed,
    auraPoints: currentStats.auraPoints + auraGain,
    streakFreezes: currentStats.streakFreezes + freezeGain,
  };

  saveUserStats(updated);
  return { updatedStats: updated, rewardText };
}
