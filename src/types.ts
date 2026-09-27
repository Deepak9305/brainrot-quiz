export type GameMode = 
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

export interface Question {
  id: string;
  mode: GameMode;
  question: string;
  subtitle?: string;
  // Visual content for image or emoji modes
  visualType?: 'image' | 'emoji' | 'ascii' | 'sound_test' | 'voice_clip';
  visualContent?: string; // image url/svg identifier, emoji string, ascii art, sound trigger key, etc.
  imageUrl?: string; // Real accurate meme image URL
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
  quizzesCompleted: number;
  totalCorrect: number;
  totalWrong: number;
  highestRushScore: number;
  highestChallengeWave: number;
  unlockedTitles: string[];
  currentTitle: string;
  crtEnabled: boolean;
  scanlinesEnabled: boolean;
  screenShakeEnabled: boolean;
  soundEnabled: boolean;
  claimedDays: number[]; // Day 1-7 in current week cycle
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
}
