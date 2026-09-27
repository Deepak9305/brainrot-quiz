import React from 'react';
import { motion } from 'motion/react';
import { Volume2, X, Music, Sparkles } from 'lucide-react';
import { SoundEffectType } from '../types';
import { soundManager } from '../utils/audio';

interface SoundboardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SoundPad {
  id: SoundEffectType;
  label: string;
  emoji: string;
  color: string;
  border: string;
}

export const SoundboardDrawer: React.FC<SoundboardDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sounds: SoundPad[] = [
    { id: 'vine_boom', label: 'Vine Boom', emoji: '💥', color: 'from-amber-600 to-red-600', border: 'border-red-500' },
    { id: 'metal_pipe', label: 'Metal Pipe', emoji: '🚰', color: 'from-zinc-600 to-slate-700', border: 'border-cyan-400' },
    { id: 'airhorn', label: 'MLG Airhorn', emoji: '📢', color: 'from-yellow-500 to-amber-600', border: 'border-yellow-400' },
    { id: 'roblox_oof', label: 'Roblox Oof', emoji: '💀', color: 'from-blue-600 to-indigo-700', border: 'border-blue-400' },
    { id: 'bruh', label: 'Bruh Sound', emoji: '🗿', color: 'from-emerald-600 to-teal-700', border: 'border-emerald-400' },
    { id: 'illuminati', label: 'Illuminati', emoji: '🔺', color: 'from-purple-600 to-violet-800', border: 'border-purple-400' },
    { id: 'sad_violin', label: 'Sad Violin', emoji: '🎻', color: 'from-pink-600 to-rose-700', border: 'border-pink-400' },
    { id: 'discord_ping', label: 'Discord Ping', emoji: '💬', color: 'from-indigo-600 to-blue-700', border: 'border-indigo-400' },
    { id: 'windows_error', label: 'Windows Error', emoji: '🛑', color: 'from-amber-600 to-yellow-700', border: 'border-yellow-400' },
    { id: 'dun_dun_dun', label: 'Dun Dun Dun!', emoji: '⚡', color: 'from-rose-600 to-red-800', border: 'border-rose-400' },
    { id: 'level_up', label: '8-Bit Victory', emoji: '🎮', color: 'from-cyan-500 to-blue-600', border: 'border-cyan-300' },
    { id: 'game_over', label: 'Wasted / Loss', emoji: '📉', color: 'from-red-700 to-zinc-800', border: 'border-red-400' },
  ];

  const handlePadClick = (id: SoundEffectType) => {
    soundManager.play(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="relative w-full max-w-lg bg-zinc-950 border-3 border-purple-500 rounded-3xl p-5 shadow-[0_0_40px_rgba(168,85,247,0.4)]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-purple-600 text-white shadow-md">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white italic tracking-wide">
              OFFLINE MEME SOUNDBOARD
            </h3>
            <p className="text-zinc-400 text-xs font-mono">
              Web Audio Synthesizer • Instant Zero Latency
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {sounds.map((pad) => (
            <motion.button
              key={pad.id}
              whileTap={{ scale: 0.92 }}
              onClick={() => handlePadClick(pad.id)}
              className={`p-3 rounded-2xl bg-gradient-to-br ${pad.color} border-2 ${pad.border} flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-md hover:brightness-110 active:brightness-95 transition-all text-white`}
            >
              <span className="text-2xl">{pad.emoji}</span>
              <span className="font-mono text-[11px] font-bold tracking-tight text-center">
                {pad.label}
              </span>
            </motion.button>
          ))}
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              soundManager.speakMemeText('Erm, what the sigma?');
            }}
            className="text-xs text-purple-300 hover:text-purple-100 font-mono underline cursor-pointer"
          >
            🎙️ Test Speech Synthesizer ("Erm, what the sigma?")
          </button>
        </div>
      </motion.div>
    </div>
  );
};
