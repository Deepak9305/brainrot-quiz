import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { Trophy, Zap, Flame, RotateCcw, Home, Sparkles, Award, Share2 } from 'lucide-react';
import { QuizSessionState, UserStats } from '../types';
import { soundManager } from '../utils/audio';
import { getDailyChallengeNumber } from '../utils/daily';

interface ResultsModalProps {
  session: QuizSessionState;
  stats: UserStats;
  streakExtended: boolean;
  onPlayAgain: () => void;
  onReturnToModes: () => void;
  onOpenStreakModal: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  session,
  stats,
  streakExtended,
  onPlayAgain,
  onReturnToModes,
  onOpenStreakModal,
}) => {
  const [shareStatus, setShareStatus] = useState('SHARE RESULT');
  const total = session.correctCount + session.wrongCount;
  const accuracy = total > 0 ? Math.round((session.correctCount / total) * 100) : 0;

  const handleShare = async () => {
    const shareText = session.mode === 'daily'
      ? `BRAINROT DAILY #${getDailyChallengeNumber()}\n${session.correctCount}/${session.questions.length} 🧠\n🔥 ${stats.streak}-day streak\n🛡️ ${stats.streakFreezes} freezes`
      : session.mode === 'rush'
        ? `BRAINROT RUSH\n${session.score.toLocaleString()} pts\n${session.correctCount} correct\n${session.highestCombo}x combo`
        : session.mode === 'challenge'
          ? `BRAINROT CHALLENGE\n${session.challengeVictory ? 'FINAL BOSS CLEARED' : `DEFEATED — WAVE ${session.highestChallengeWave}`}\n❤️ ${session.lives} heart${session.lives === 1 ? '' : 's'} remaining`
          : `BRAINROT QUIZ\n${accuracy}% BRAINROTTED\nScore: ${session.score.toLocaleString()}\n${session.highestCombo}x combo\nRank: ${rankTitle}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Brainrot Quiz result', text: shareText });
        setShareStatus('SHARED');
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        setShareStatus('COPIED TO CLIPBOARD');
      } else {
        setShareStatus('SCREENSHOT THIS CARD');
      }
    } catch {
      setShareStatus('SHARE CANCELLED');
    }
    window.setTimeout(() => setShareStatus('SHARE RESULT'), 2200);
  };

  // Grade determination
  let rankGrade = 'SSS';
  let rankTitle = 'GIGA SIGMA OVERLORD 🗿';
  let rankColor = 'from-yellow-400 via-pink-500 to-purple-500';

  if (accuracy === 100) {
    rankGrade = 'SSS';
    rankTitle = 'BEYOND SAVING 🗿';
    rankColor = 'from-yellow-400 via-pink-500 to-purple-500';
  } else if (accuracy >= 90) {
    rankGrade = 'S';
    rankTitle = 'UNSPOKEN RIZZLER 🔥';
    rankColor = 'from-cyan-400 to-blue-500';
  } else if (accuracy >= 75) {
    rankGrade = 'A';
    rankTitle = 'CHILL GUY IN OHIO 🐕';
    rankColor = 'from-emerald-400 to-teal-500';
  } else if (accuracy >= 60) {
    rankGrade = 'B';
    rankTitle = 'FANUM TAX RECRUIT 🍕';
    rankColor = 'from-amber-400 to-orange-500';
  } else if (accuracy >= 40) {
    rankGrade = 'C';
    rankTitle = 'CASUAL SCROLLER';
    rankColor = 'from-orange-400 to-zinc-500';
  } else {
    rankGrade = 'F';
    rankTitle = 'SKIBIDI NPC CASUALTY 🚽';
    rankColor = 'from-red-500 to-zinc-600';
  }

  // Trigger celebratory confetti on high scores
  useEffect(() => {
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const celebration = accuracy >= 90 || session.dailyPerfect || session.isNewHighScore || session.challengeVictory;
    if (!reducedMotion && celebration) {
      try {
        confetti({
          particleCount: session.dailyPerfect || session.challengeVictory ? 100 : 65,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#eab308', '#06b6d4', '#a855f7'],
        });
      } catch {}
    }
  }, [accuracy, session.dailyPerfect, session.isNewHighScore, session.challengeVictory]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-lg bg-zinc-950 border-4 border-yellow-400 rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(250,204,21,0.4)] text-center overflow-hidden"
      >
        {/* Retro Header Tag */}
        <div className="inline-block bg-yellow-400 text-black font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          QUIZ REPORT DECLASSIFIED
        </div>

        {/* Grade Badge */}
        <div className="my-2">
          <div className={`text-6xl sm:text-7xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-r ${rankColor} drop-shadow-md`}>
            RANK {rankGrade}
          </div>
          <div className="text-sm sm:text-base font-black text-zinc-200 mt-1 uppercase tracking-wide">
            {rankTitle}
          </div>
        </div>

        {/* Streak Extended Celebration Alert */}
        {streakExtended && (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="my-3 p-3 rounded-2xl bg-gradient-to-r from-orange-600/30 to-amber-600/30 border-2 border-orange-500 text-orange-300 flex items-center justify-center gap-2 font-mono text-xs font-bold shadow-[0_0_15px_rgba(249,115,22,0.4)]"
          >
            <Flame className="w-5 h-5 text-orange-400 fill-orange-400 animate-bounce" />
            <span>DAILY STREAK EXTENDED TO {stats.streak} DAYS! 🔥</span>
          </motion.div>
        )}

        {/* Score & Aura Grid */}
        <div className="grid grid-cols-2 gap-2.5 my-3">
          <div className="bg-zinc-900 border border-yellow-500/40 rounded-xl p-3">
            <span className="text-zinc-500 block text-[10px] font-mono">SCORE</span>
            <span className="text-lg font-black text-yellow-300">{session.score.toLocaleString()}</span>
            {session.isNewHighScore && <span className="block text-[9px] font-black text-pink-400">NEW HIGH SCORE</span>}
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
            <span className="text-zinc-500 block text-[10px] font-mono">ANSWERED</span>
            <span className="text-lg font-black text-cyan-300">{session.questionsAnswered}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 my-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
            <span className="text-zinc-500 block text-[10px] font-mono">ACCURACY</span>
            <span className="text-lg font-black text-green-400">{accuracy}%</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
            <span className="text-zinc-500 block text-[10px] font-mono">MAX COMBO</span>
            <span className="text-lg font-black text-pink-400">{session.highestCombo}x</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
            <span className="text-zinc-500 block text-[10px] font-mono">AURA GAINED</span>
            <span className="text-lg font-black text-yellow-400 flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-yellow-400" />
              +{session.earnedAura}
            </span>
          </div>
        </div>

        <div className="mb-2 rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-xs font-mono text-zinc-300">
          {session.mode === 'rush' && <span>RUSH: {session.questionsAnswered} rapid answers • personal best {stats.highestRushScore.toLocaleString()} pts</span>}
          {session.mode === 'challenge' && <span className={session.challengeVictory ? 'text-emerald-300' : 'text-red-300'}>{session.challengeVictory ? 'CHALLENGE CLEARED • FINAL BOSS DEFEATED' : `DEFEATED — WAVE ${session.highestChallengeWave}`} • {session.lives} heart{session.lives === 1 ? '' : 's'} left</span>}
          {session.mode === 'daily' && <span>DAILY #{getDailyChallengeNumber()}: {session.isPracticeRun ? 'PRACTICE RUN • no streak or reward changes' : session.dailyPerfect ? 'PERFECT DAILY • +500 Aura bonus' : 'Reward progress saved locally'}</span>}
          {session.mode !== 'rush' && session.mode !== 'challenge' && session.mode !== 'daily' && <span>MIX: {session.correctCount} correct across {new Set(session.questions.map((question) => question.category ?? question.mode)).size} clue families</span>}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 mt-5">
          <button
            onClick={() => {
              soundManager.play('level_up');
              onPlayAgain();
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-yellow-400 hover:from-pink-400 hover:to-yellow-300 text-black font-black text-sm py-3 px-4 rounded-xl cursor-pointer shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-transform active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            PLAY AGAIN
          </button>

          <button
            onClick={() => {
              soundManager.play('countdown_tick');
              onReturnToModes();
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-sm py-3 px-4 rounded-xl border border-zinc-600 transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            ALL MODES
          </button>
        </div>

        <button
          onClick={handleShare}
          className="w-full mt-3 flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-sm py-3 px-4 rounded-xl cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-transform active:scale-95"
        >
          <Share2 className="w-4 h-4" />
          {shareStatus}
        </button>

        {/* Daily Streak Calendar Shortcut */}
        <button
          onClick={() => {
            soundManager.play('level_up');
            onOpenStreakModal();
          }}
          className="w-full mt-3 text-xs font-mono text-amber-400 hover:text-amber-300 hover:underline cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Award className="w-3.5 h-3.5" />
          Check Streak Milestones & Claim Daily Gifts
        </button>
      </motion.div>
    </div>
  );
};
