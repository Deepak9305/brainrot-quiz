import React, { useState } from 'react';
import { Flame, Zap, Volume2, VolumeX, Monitor, Shield, Music, Trophy, Settings } from 'lucide-react';
import { UserStats } from '../types';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  stats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
  onOpenStreakModal: () => void;
  onOpenSoundboard: () => void;
  onOpenCollection: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  onUpdateStats,
  onOpenStreakModal,
  onOpenSoundboard,
  onOpenCollection,
}) => {
  const [isUtilityOpen, setIsUtilityOpen] = useState(false);
  const toggleSound = () => {
    const next = !stats.soundEnabled;
    soundManager.setMuted(!next);
    if (next) soundManager.play('correct');
    onUpdateStats({ soundEnabled: next });
  };

  const toggleCRT = () => {
    soundManager.play('countdown_tick');
    onUpdateStats({ 
      crtEnabled: !stats.crtEnabled,
      scanlinesEnabled: !stats.scanlinesEnabled
    });
  };

  return (
    <header className="relative z-30 w-full max-w-5xl mx-auto px-4 pt-4 pb-3">
      <div className="theme-accent-border flex flex-wrap items-center justify-between gap-3 bg-zinc-900/90 backdrop-blur-md border-2 rounded-2xl p-3 sm:p-4 shadow-[0_0_20px_rgba(236,72,153,0.3)]">
        {/* Logo and Rank */}
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-tr from-pink-600 to-yellow-400 rounded-xl flex items-center justify-center text-2xl border-2 border-white shadow-[0_0_12px_rgba(244,63,94,0.6)] transform -rotate-3 hover:rotate-0 transition-transform">
            🧠
            <span className="absolute -bottom-1 -right-1 text-xs">🚽</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-300 drop-shadow-sm font-sans">
                BRAINROT QUIZ
              </h1>
              <span className="hidden sm:inline-block bg-pink-500 text-black text-[9px] font-black uppercase px-1.5 py-0.5 rounded tracking-widest">
                RETRO HYPER-EDITION
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-mono">
              <span className="text-pink-400 font-bold">TITLE:</span>
              <span className="bg-zinc-800 text-yellow-300 font-bold px-2 py-0.5 rounded border border-zinc-700">
                {stats.currentTitle}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Pills & Streak Button */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Daily Streak Button */}
          <button
            id="streak-status-btn"
            onClick={() => {
              soundManager.play('level_up');
              onOpenStreakModal();
            }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-orange-600/20 hover:from-amber-500/30 hover:to-orange-600/30 border border-orange-500/80 text-orange-300 hover:text-orange-200 font-black px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-[0_0_10px_rgba(249,115,22,0.3)] active:scale-95"
            title="Open Daily Streak Calendar"
          >
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-bounce" />
            <span className="font-mono text-sm tracking-wider font-extrabold">{stats.streak} DAY{stats.streak > 1 ? 'S' : ''}</span>
            {stats.streakStatus === 'protected' && <span className="text-[9px] font-black text-cyan-200 bg-cyan-950/80 border border-cyan-500 px-1 rounded">SAFE</span>}
            {stats.streakStatus === 'expired' && <span className="text-[9px] font-black text-red-200 bg-red-950/80 border border-red-500 px-1 rounded">RESET</span>}
            {stats.streakFreezes > 0 && (
              <span className="flex items-center text-[10px] bg-cyan-900/80 text-cyan-300 px-1 rounded ml-1 border border-cyan-500" title={`${stats.streakFreezes} Streak Freeze Shield(s) equipped`}>
                <Shield className="w-2.5 h-2.5 mr-0.5" />
                {stats.streakFreezes}
              </span>
            )}
          </button>

          {/* Aura Points Pill */}
          <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/60 text-yellow-300 px-3 py-1.5 rounded-xl font-mono text-sm font-bold shadow-[0_0_10px_rgba(234,179,8,0.2)]">
            <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span>{stats.auraPoints} AURA</span>
          </div>

          {/* Soundboard Modal Button */}
          <button
            id="collection-btn"
            onClick={() => {
              soundManager.play('countdown_tick');
              onOpenCollection();
            }}
            className="p-2 rounded-xl border border-yellow-500/70 bg-yellow-950/40 text-yellow-300 hover:bg-yellow-900/50 transition-colors cursor-pointer"
            title="Open achievements, archive, shop, and profile"
          >
            <Trophy className="w-4 h-4" />
          </button>

          <div className="hidden items-center gap-2 sm:flex">
          <button
            id="soundboard-btn"
            onClick={() => {
              soundManager.play('airhorn');
              onOpenSoundboard();
            }}
            className="p-2 bg-purple-950/80 hover:bg-purple-900 border border-purple-500 text-purple-300 rounded-xl transition-colors cursor-pointer"
            title="Open Offline Meme Soundboard"
          >
            <Music className="w-4 h-4" />
          </button>

          {/* CRT FX Toggle */}
          <button
            id="crt-toggle-btn"
            onClick={toggleCRT}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              stats.crtEnabled
                ? 'bg-cyan-600/30 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                : 'bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:text-zinc-200'
            }`}
            title="Toggle CRT Scanlines & Flicker"
          >
            <Monitor className="w-4 h-4" />
          </button>

          {/* Sound Mute Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={toggleSound}
            className="p-2 bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 rounded-xl transition-colors cursor-pointer"
            title={stats.soundEnabled ? 'Mute audio' : 'Unmute audio'}
          >
            {stats.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-green-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-red-400" />
            )}
          </button>
          </div>

          <button
            onClick={() => setIsUtilityOpen((open) => !open)}
            className="rounded-xl border border-zinc-700 bg-zinc-800/80 p-2 text-zinc-300 transition-colors hover:text-white sm:hidden"
            title="Open settings"
            aria-expanded={isUtilityOpen}
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
        {isUtilityOpen && <div className="absolute right-3 top-[calc(100%+8px)] z-50 flex w-48 flex-col gap-2 rounded-2xl border border-zinc-700 bg-zinc-950/95 p-3 shadow-[0_0_30px_rgba(0,0,0,0.55)] sm:hidden">
          <div className="text-[10px] font-mono font-black text-cyan-300">UTILITY SETTINGS</div>
          <button onClick={() => { onOpenSoundboard(); setIsUtilityOpen(false); }} className="flex min-h-11 items-center gap-2 rounded-xl border border-purple-500/60 bg-purple-950/70 px-3 text-left text-xs font-bold text-purple-200"><Music className="h-4 w-4" /> SOUND PLAYGROUND</button>
          <button onClick={() => { toggleCRT(); setIsUtilityOpen(false); }} className="flex min-h-11 items-center gap-2 rounded-xl border border-cyan-500/60 bg-cyan-950/60 px-3 text-left text-xs font-bold text-cyan-200"><Monitor className="h-4 w-4" /> CRT + SCANLINES</button>
          <button onClick={() => { toggleSound(); setIsUtilityOpen(false); }} className="flex min-h-11 items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 text-left text-xs font-bold text-zinc-200">{stats.soundEnabled ? <Volume2 className="h-4 w-4 text-green-400" /> : <VolumeX className="h-4 w-4 text-red-400" />} SOUND EFFECTS</button>
        </div>}
      </div>
    </header>
  );
};
