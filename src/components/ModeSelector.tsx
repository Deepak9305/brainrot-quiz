import React from 'react';
import { motion } from 'motion/react';
import { 
  ImageIcon, 
  Smile, 
  BookOpen, 
  Volume2, 
  Mic, 
  Timer, 
  Calendar, 
  Swords, 
  Sparkles,
  Trophy,
  Flame,
  Star
} from 'lucide-react';
import { GameMode, UserStats } from '../types';
import { soundManager } from '../utils/audio';

interface ModeSelectorProps {
  stats: UserStats;
  onSelectMode: (mode: GameMode) => void;
  onOpenStreakModal: () => void;
}

interface ModeCardInfo {
  id: GameMode;
  title: string;
  badge: string;
  badgeColor: string;
  icon: React.ReactNode;
  description: string;
  highlight: string;
  glowColor: string;
  borderColor: string;
  accentBg: string;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  stats,
  onSelectMode,
  onOpenStreakModal,
}) => {
  const modes: ModeCardInfo[] = [
    {
      id: 'mix',
      title: 'Brainrot Mix',
      badge: 'BEST START',
      badgeColor: 'bg-pink-500 text-black',
      icon: <Sparkles className="w-6 h-6 text-pink-300" />,
      description: 'A replayable blend of local character clues, emoji, slang, quotes, and classic internet lore.',
      highlight: '10 mixed questions',
      glowColor: 'hover:shadow-[0_0_25px_rgba(236,72,153,0.4)]',
      borderColor: 'border-pink-500/70',
      accentBg: 'from-pink-950/50 via-zinc-900 to-black',
    },
    {
      id: 'daily',
      title: 'Daily Mode',
      badge: 'STREAK FUEL',
      badgeColor: 'bg-orange-500 text-black',
      icon: <Calendar className="w-6 h-6 text-orange-400" />,
      description: 'Ten deterministic questions per calendar day. Complete it once to extend your streak.',
      highlight: `Streak: ${stats.streak} Days 🔥`,
      glowColor: 'hover:shadow-[0_0_25px_rgba(249,115,22,0.4)]',
      borderColor: 'border-orange-500/70',
      accentBg: 'from-orange-950/40 via-zinc-900 to-black',
    },
    {
      id: 'image',
      title: 'Image Mode',
      badge: 'LOCAL MEDIA',
      badgeColor: 'bg-pink-500 text-black',
      icon: <ImageIcon className="w-6 h-6 text-pink-400" />,
      description: 'Identify sourced local references from the modern Italian Brainrot character family.',
      highlight: 'No random stock photos',
      glowColor: 'hover:shadow-[0_0_25px_rgba(236,72,153,0.4)]',
      borderColor: 'border-pink-500/70',
      accentBg: 'from-pink-950/40 via-zinc-900 to-black',
    },
    {
      id: 'emoji',
      title: 'Emoji Mode',
      badge: 'DECODE GEN-Z',
      badgeColor: 'bg-yellow-400 text-black',
      icon: <Smile className="w-6 h-6 text-yellow-400" />,
      description: 'Translate cryptic emoji strings like 🤫🧏‍♂️ and 🍕🥷🍗 into brainrot history.',
      highlight: 'Emoji Hieroglyphics',
      glowColor: 'hover:shadow-[0_0_25px_rgba(250,204,21,0.4)]',
      borderColor: 'border-yellow-500/70',
      accentBg: 'from-yellow-950/40 via-zinc-900 to-black',
    },
    {
      id: 'slang',
      title: 'Slang Mode',
      badge: 'DICTIONARY',
      badgeColor: 'bg-cyan-400 text-black',
      icon: <BookOpen className="w-6 h-6 text-cyan-400" />,
      description: 'Test your vocabulary: Rizz, Gyatt, Fanum Tax, Mogging, Negative Aura, and looksmaxxing.',
      highlight: 'Gen Alpha Slang Test',
      glowColor: 'hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]',
      borderColor: 'border-cyan-500/70',
      accentBg: 'from-cyan-950/40 via-zinc-900 to-black',
    },
    {
      id: 'sound',
      title: 'Sound Mode',
      badge: 'SOUND RECREATION',
      badgeColor: 'bg-purple-400 text-black',
      icon: <Volume2 className="w-6 h-6 text-purple-400" />,
      description: 'Tap to hear original game recreations and identify the internet moment they reference.',
      highlight: 'Fair recreation clues',
      glowColor: 'hover:shadow-[0_0_25px_rgba(192,132,252,0.4)]',
      borderColor: 'border-purple-500/70',
      accentBg: 'from-purple-950/40 via-zinc-900 to-black',
    },
    {
      id: 'voice',
      title: 'Voice Mode',
      badge: 'SYNTH NARRATION',
      badgeColor: 'bg-emerald-400 text-black',
      icon: <Mic className="w-6 h-6 text-emerald-400" />,
      description: 'A neutral browser narrator reads a quote. Guess the phrase, meme, or context—not an impersonation.',
      highlight: 'Quote challenge',
      glowColor: 'hover:shadow-[0_0_25px_rgba(52,211,153,0.4)]',
      borderColor: 'border-emerald-500/70',
      accentBg: 'from-emerald-950/40 via-zinc-900 to-black',
    },
    {
      id: 'rush',
      title: 'Rush Mode',
      badge: '60s SPEEDRUN',
      badgeColor: 'bg-red-500 text-white',
      icon: <Timer className="w-6 h-6 text-red-400" />,
      description: 'Fast-paced 60-second time attack! Rapid-fire questions and combo multipliers.',
      highlight: `High Score: ${stats.highestRushScore} pts`,
      glowColor: 'hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]',
      borderColor: 'border-red-500/70',
      accentBg: 'from-red-950/40 via-zinc-900 to-black',
    },
    {
      id: 'challenge',
      title: 'Challenge Mode',
      badge: '3 HEARTS BOSS',
      badgeColor: 'bg-indigo-500 text-white',
      icon: <Swords className="w-6 h-6 text-indigo-400" />,
      description: 'Survive 5 escalating boss waves, then defeat the Final Boss with only 3 lives.',
      highlight: `Highest Wave: ${stats.highestChallengeWave}/6`,
      glowColor: 'hover:shadow-[0_0_25px_rgba(99,102,241,0.4)]',
      borderColor: 'border-indigo-500/70',
      accentBg: 'from-indigo-950/40 via-zinc-900 to-black',
    },
  ];

  const handleCardClick = (mode: GameMode) => {
    soundManager.play('level_up');
    onSelectMode(mode);
  };

  return (
    <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-4 space-y-6">
      {/* Daily Banner Hero */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-yellow-400/80 bg-gradient-to-r from-amber-950/60 via-zinc-900 to-purple-950/60 p-4 sm:p-5 shadow-[0_0_25px_rgba(250,204,21,0.25)]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse">
              🔥
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="bg-amber-400 text-black font-black text-[10px] px-2 py-0.5 rounded tracking-wider uppercase">
                  DAILY STREAK CHECK-IN
                </span>
                <span className="text-zinc-400 text-xs font-mono">CORE QUIZ OFFLINE</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                Keep the {stats.streak}-Day Streak Alive!
              </h2>
              <p className="text-zinc-300 text-xs sm:text-sm mt-0.5 max-w-lg">
                Complete your Daily Mode quiz or claim your daily reward in the streak calendar to earn Aura and Title badges.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="quick-daily-btn"
              onClick={() => handleCardClick('daily')}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-sm px-5 py-2.5 rounded-xl cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-transform active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              PLAY DAILY
            </button>
            <button
              id="open-calendar-btn"
              onClick={() => {
                soundManager.play('level_up');
                onOpenStreakModal();
              }}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-sm px-3.5 py-2.5 rounded-xl border border-zinc-600 transition-colors cursor-pointer"
              title="Open Daily Calendar"
            >
              📅 REWARDS
            </button>
          </div>
        </div>
      </div>

      {/* Mode Grid Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-black italic tracking-wide text-white flex items-center gap-2">
            <Star className="theme-primary-text w-5 h-5 fill-current" />
            SELECT GAME MODE
          </h3>
          <p className="text-zinc-400 text-xs font-mono">9 CHAOTIC TEST MODES • PURE RETRO ARCADE</p>
        </div>
        <div className="text-right font-mono text-xs text-zinc-400">
          COMPLETED: <span className="theme-secondary-text font-bold">{stats.quizzesCompleted}</span> QUIZZES
        </div>
      </div>

      {/* Grid of 8 Modes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {modes.map((mode, index) => (
          <motion.div
            key={mode.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleCardClick(mode.id)}
            className={`group relative flex flex-col justify-between p-4 rounded-2xl bg-gradient-to-b ${mode.accentBg} border-2 ${mode.borderColor} transition-all duration-200 cursor-pointer shadow-md ${mode.glowColor}`}
          >
            {/* Top Bar */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-700 group-hover:scale-110 transition-transform">
                  {mode.icon}
                </div>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${mode.badgeColor} tracking-wider shadow-sm`}>
                  {mode.badge}
                </span>
              </div>

              <h4 className="theme-primary-text text-base font-black text-white group-hover:text-white transition-colors tracking-tight">
                {mode.title}
              </h4>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                {mode.description}
              </p>
            </div>

            {/* Bottom Highlight */}
            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400 group-hover:text-white transition-colors">
                {mode.highlight}
              </span>
              <span className="theme-primary-text font-black group-hover:translate-x-1 transition-transform">
                START →
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats Summary Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 text-center font-mono text-xs">
        <div>
          <span className="text-zinc-500 block text-[10px]">TOTAL CORRECT</span>
          <span className="text-green-400 font-bold text-sm">{stats.totalCorrect}</span>
        </div>
        <div>
          <span className="text-zinc-500 block text-[10px]">LONGEST STREAK</span>
          <span className="text-orange-400 font-bold text-sm">{stats.longestStreak} DAYS</span>
        </div>
        <div>
          <span className="text-zinc-500 block text-[10px]">RUSH HIGH SCORE</span>
          <span className="text-red-400 font-bold text-sm">{stats.highestRushScore} PTS</span>
        </div>
        <div>
          <span className="text-zinc-500 block text-[10px]">CHALLENGE BEST</span>
          <span className="text-indigo-400 font-bold text-sm">WAVE {stats.highestChallengeWave}</span>
        </div>
      </div>
    </div>
  );
};
