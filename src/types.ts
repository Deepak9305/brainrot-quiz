export type GameMode = 
  | 'mix'
  | 'image'
  | 'emoji'
  | 'slang'
  | 'sound'
  | 'voice'
  | 'rush'
  | 'daily'
  | 'challenge';

export type SoundEffectType = 
  | 'vine_boom'
  | 'airhorn'
  | 'metal_pipe'
  | 'roblox_oof'
  | 'bruh'
  | 'correct'
  | 'wrong'
  | 'level_up'
  | 'game_over'
  | 'countdown_tick'
  | 'sad_violin'
  | 'illuminati'
  | 'discord_ping'
  | 'windows_error'
  | 'dun_dun_dun';

export type QuestionType =
  | 'standard'
  | 'image_identification'
  | 'image_crop'
  | 'image_detail'
  | 'silhouette'
  | 'emoji_decode'
  | 'sound_recreation'
  | 'quote_identification'
  | 'complete_phrase'
  | 'origin'
  | 'true_or_cap'
  | 'odd_one_out'
  | 'platform_matching'
  | 'timeline'
  | 'era_identification'
  | 'meme_evolution'
  | 'format_recognition';

export type QuestionEra =
  | 'classic'
  | 'early_web'
  | '1990s'
  | '2000s'
  | 'early_2000s'
  | 'mid_2000s'
  | 'late_2000s'
  | 'early_2010s'
  | 'mid_2010s'
  | 'late_2010s'
  | 'early_2020s'
  | '2025'
  | '2026'
  | 'italian_brainrot'
  | 'current';

export type QuestionCategory =
  | 'modern'
  | 'modern_memes'
  | 'italian_brainrot'
  | 'slang'
  | 'internet_slang'
  | 'classic_memes'
  | 'meme_formats'
  | 'reaction_memes'
  | 'emoji'
  | 'quote'
  | 'sound'
  | 'social_media'
  | 'internet_history'
  | 'internet_tech'
  | 'gaming_culture'
  | 'youtube'
  | 'streaming'
  | 'creator_culture'
  | 'viral_videos'
  | 'digital_nostalgia'
  | 'challenge'
  | 'rush';

export type StreakStatus = 'active' | 'protected' | 'expired';

export interface RewardCycle {
  cycleStartDate: string;
  cycleNumber: number;
  completedDays: number;
  claimedDays: number[];
}

export interface Question {
  id: string;
  mode: GameMode;
  question: string;
  subtitle?: string;
  // Visual content for image or emoji modes
  visualType?: 'image' | 'emoji' | 'ascii' | 'sound_test' | 'voice_clip';
  visualContent?: string; // image url/svg identifier, emoji string, ascii art, sound trigger key, etc.
  useMediaAsQuestion?: boolean; // Explicit opt-in; owning media does not automatically make a question visual.
  imageUrl?: string; // Legacy field; bundled media uses imageAsset instead.
  imageAsset?: string;
  imageVariant?: 'standard' | 'crop' | 'detail' | 'silhouette';
  questionType?: QuestionType;
  era?: QuestionEra;
  category?: QuestionCategory;
  topic?: string;
  freshness?: 'evergreen' | 'current' | 'seasonal';
  subjectKey?: string;
  challengeWave?: number;
  tags?: string[];
  eligibleForRush?: boolean;
  eligibleForDaily?: boolean;
  weight?: number;
  sourceLabel?: string;
  options: string[];
  correctAnswer: number; // 0 to 3 index
  explanation: string;
  memeContext: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'sigma';
  audioClip?: SoundEffectType; // For sound mode
  voiceText?: string; // For voice mode TTS
  speakerName?: string;
  voicePitch?: number;
  voiceRate?: number;
}

export interface UserStats {
  streak: number;
  longestStreak: number;
  lastPlayedDate: string; // YYYY-MM-DD
  lastDailyCompletedDate: string; // YYYY-MM-DD
  auraPoints: number;
  streakFreezes: number;
  recentQuestionIds: string[];
  recentVisualSubjectKeys: string[];
  quizzesCompleted: number;
  totalCorrect: number;
  totalWrong: number;
  correctByCategory: Record<string, number>;
  highestRushScore: number;
  highestChallengeWave: number;
  challengeWins: number;
  finalBossWins: number;
  unlockedTitles: string[];
  currentTitle: string;
  unlockedAchievements: string[];
  personalBests: Record<string, number>;
  unlockedCosmetics: string[];
  equippedTheme: string;
  equippedCardStyle: string;
  equippedEffect: string;
  discoveredSubjects: string[];
  archiveMilestonesClaimed: number[];
  crtEnabled: boolean;
  scanlinesEnabled: boolean;
  screenShakeEnabled: boolean;
  soundEnabled: boolean;
  claimedDays: number[]; // Deprecated compatibility mirror for older saves.
  rewardCycle: RewardCycle;
  streakStatus: StreakStatus;
  protectedMissedDays: number;
}

export interface QuizSessionState {
  mode: GameMode;
  questions: Question[];
  currentIndex: number;
  score: number;
  correctCount: number;
  wrongCount: number;
  combo: number;
  highestCombo: number;
  timeLeft: number; // For rush or timed questions
  lives: number; // For challenge mode
  maxLives: number;
  isFinished: boolean;
  selectedOption: number | null;
  isAnswered: boolean;
  earnedAura: number;
  streakExtended: boolean;
  startedAt: number;
  questionStartedAt: number;
  rushEndsAt: number | null;
  questionTimesMs: number[];
  questionsAnswered: number;
  challengeWave: number;
  highestChallengeWave: number;
  challengeVictory: boolean;
  finalBossDefeated: boolean;
  isPracticeRun: boolean;
  isNewHighScore: boolean;
  scoreEvents: string[];
  dailyPerfect: boolean;
  correctByCategory: Record<string, number>;
  answeredSubjectKeys: string[];
  answeredQuestionIds: string[];
  auraBreakdown?: {
    answers: number;
    perfectBonus: number;
    archiveBonus: number;
  };
}
