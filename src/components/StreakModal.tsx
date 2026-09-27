import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Flame, 
  Shield, 
  Check, 
  X, 
  Gift, 
  Zap, 
  Trophy, 
  Lock, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { UserStats } from '../types';
import { claimDailyReward, saveUserStats } from '../utils/storage';
import { soundManager } from '../utils/audio';

interface StreakModalProps {
  stats: UserStats;
  onClose: () => void;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
}

export const StreakModal: React.FC<StreakModalProps> = ({
  stats,
  onClose,
  onUpdateStats,
}) => {
  const [claimMessage, setClaimMessage] = useState<string>('');

  const dailyDays = [
    { day: 1, title: 'Day 1', reward: '+100 Aura', icon: '⚡' },
    { day: 2, title: 'Day 2', reward: '+200 Aura', icon: '⚡' },
    { day: 3, title: 'Day 3', reward: 'Streak Freeze', icon: '🛡️' },
    { day: 4, title: 'Day 4', reward: '+400 Aura', icon: '⚡' },
    { day: 5, title: 'Day 5', reward: '+500 Aura Boost', icon: '🔥' },
    { day: 6, title: 'Day 6', reward: '+600 Aura', icon: '⚡' },
    { day: 7, title: 'Day 7', reward: '1,000 Aura + Crown', icon: '👑' },
  ];

  const handleClaim = (dayNumber: number) => {
    soundManager.play('level_up');
    const { updatedStats, rewardText } = claimDailyReward(stats, dayNumber);
    onUpdateStats(updatedStats);
    setClaimMessage(rewardText);
    setTimeout(() => setClaimMessage(''), 3000);
  };

  const handleBuyFreeze = () => {
    const cost = 400;
    if (stats.auraPoints < cost) {
      soundManager.play('wrong');
      setClaimMessage('Not enough Aura! Complete quizzes to earn more.');
      setTimeout(() => setClaimMessage(''), 3000);
      return;
    }

    soundManager.play('correct');
    const updated = {
      ...stats,
      auraPoints: stats.auraPoints - cost,
      streakFreezes: stats.streakFreezes + 1,
    };
    saveUserStats(updated);
    onUpdateStats(updated);
    setClaimMessage('Purchased +1 Streak Freeze Shield! 🛡️');
    setTimeout(() => setClaimMessage(''), 3000);
  };

  const handleSelectTitle = (title: string) => {
    soundManager.play('countdown_tick');
    const updated = { ...stats, currentTitle: title };
    saveUserStats(updated);
    onUpdateStats(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-xl bg-zinc-950 border-3 border-orange-500 rounded-3xl p-5 sm:p-6 shadow-[0_0_40px_rgba(249,115,22,0.35)] space-y-5 my-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/20 border border-orange-500/60 text-orange-300 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase mb-2">
            <Flame className="w-3.5 h-3.5 fill-orange-400" />
            <span>DAILY HABIT & STREAK SYSTEM</span>
          </div>
          <h2 className="text-2xl font-black text-white italic tracking-tight">
            YOUR MEME GRINDSET
          </h2>
          <p className="text-zinc-400 text-xs mt-0.5">
            Log in daily, maintain your streak, and unlock legendary Brainrot titles.
          </p>
        </div>

        {/* Streak Stats Card */}
        <div className="grid grid-cols-3 gap-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-3 text-center">
          <div>
            <span className="text-zinc-500 block text-[10px] font-mono">CURRENT STREAK</span>
            <div className="flex items-center justify-center gap-1 text-orange-400 font-black text-lg">
              <Flame className="w-4 h-4 fill-orange-400" />
              <span>{stats.streak} Days</span>
            </div>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px] font-mono">ALL-TIME RECORD</span>
            <div className="text-yellow-400 font-black text-lg">
              {stats.longestStreak} Days
            </div>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px] font-mono">SHIELDS ACTIVE</span>
            <div className="flex items-center justify-center gap-1 text-cyan-400 font-black text-lg">
              <Shield className="w-4 h-4" />
              <span>{stats.streakFreezes}</span>
            </div>
          </div>
        </div>

        {/* Notification / Toast */}
        {claimMessage && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500 text-amber-300 text-center text-xs font-mono font-bold"
          >
            {claimMessage}
          </motion.div>
        )}

        {/* 7-Day Rewards Calendar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-zinc-300 flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-pink-400" />
              7-DAY CHECK-IN CALENDAR:
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">RESET EVERY CYCLE</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {dailyDays.map((item) => {
              const isClaimed = stats.claimedDays.includes(item.day);
              const canClaim = !isClaimed && stats.streak >= item.day;

              return (
                <div
                  key={item.day}
                  className={`relative flex flex-col items-center justify-between p-2 rounded-xl border text-center transition-all ${
                    isClaimed
                      ? 'bg-zinc-900/60 border-zinc-800 text-zinc-500'
                      : canClaim
                      ? 'bg-gradient-to-b from-amber-500/30 to-zinc-900 border-amber-400 text-white shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                      : 'bg-zinc-900/30 border-zinc-800/80 text-zinc-500'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold block">{item.title}</span>
                  <div className="my-1.5 text-xl">{item.icon}</div>
                  <span className="text-[9px] font-mono leading-tight block mb-1.5 font-bold">
                    {item.reward}
                  </span>

                  {isClaimed ? (
                    <span className="text-[9px] font-mono text-green-400 font-bold flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" /> CLAIMED
                    </span>
                  ) : canClaim ? (
                    <button
                      onClick={() => handleClaim(item.day)}
                      className="w-full bg-amber-400 hover:bg-amber-300 text-black font-black text-[9px] py-1 rounded cursor-pointer transition-transform active:scale-95"
                    >
                      CLAIM
                    </button>
                  ) : (
                    <span className="text-[9px] font-mono text-zinc-600 flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" /> DAY {item.day}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Streak Shield Shop */}
        <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500 text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                Streak Freeze Shield
                <span className="text-[10px] text-zinc-400 font-mono font-normal">Auto-saves 1 missed day</span>
              </h4>
              <p className="text-[11px] text-zinc-400">
                You currently have <strong className="text-cyan-300">{stats.streakFreezes}</strong> shields active.
              </p>
            </div>
          </div>

          <button
            onClick={handleBuyFreeze}
            className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs px-3 py-2 rounded-xl cursor-pointer transition-transform active:scale-95 whitespace-nowrap shadow-[0_0_10px_rgba(6,182,212,0.4)]"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            400 AURA
          </button>
        </div>

        {/* Unlocked Titles Showcase */}
        <div>
          <span className="text-xs font-mono font-bold text-zinc-300 block mb-2">
            YOUR UNLOCKED TITLES ({stats.unlockedTitles.length}):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {stats.unlockedTitles.map((title) => {
              const isSelected = stats.currentTitle === title;
              return (
                <button
                  key={title}
                  onClick={() => handleSelectTitle(title)}
                  className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-yellow-400 text-black border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]'
                      : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-zinc-500'
                  }`}
                >
                  {isSelected && '✓ '}
                  {title}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
