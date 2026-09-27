import React, { useState } from 'react';

interface MemeArtProps {
  type: string;
  imageUrl?: string;
  altText?: string;
}

export const MemeArt: React.FC<MemeArtProps> = ({ type, imageUrl, altText }) => {
  const [imageFailed, setImageFailed] = useState(false);

  // If real accurate image is provided and hasn't errored out, display it with retro arcade frame!
  if (imageUrl && !imageFailed) {
    return (
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto rounded-2xl overflow-hidden border-4 border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.5)] bg-zinc-950 group">
        <img
          src={imageUrl}
          alt={altText || 'Accurate Meme Image'}
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono font-bold bg-black/70 px-2 py-1 rounded border border-pink-400 text-pink-300">
          <span>AUTHENTIC MEME ARCHIVE</span>
          <span className="text-yellow-400">HD SCAN</span>
        </div>
      </div>
    );
  }

  // Fallback high-fidelity vector / canvas renders
  switch (type) {
    case 'doge_shiba':
      return (
        <div className="relative w-56 h-56 mx-auto flex items-center justify-center bg-amber-950/40 border-4 border-yellow-400 rounded-2xl shadow-[0_0_25px_rgba(250,204,21,0.5)] overflow-hidden p-4">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="70" fill="#f59e0b" stroke="#78350f" strokeWidth="4" />
            <ellipse cx="65" cy="55" rx="15" ry="25" fill="#d97706" stroke="#78350f" strokeWidth="3" transform="rotate(-20 65 55)" />
            <ellipse cx="135" cy="55" rx="15" ry="25" fill="#d97706" stroke="#78350f" strokeWidth="3" transform="rotate(20 135 55)" />
            <ellipse cx="100" cy="120" rx="30" ry="22" fill="#fef3c7" />
            <polygon points="95,108 105,108 100,116" fill="#1c1917" />
            <circle cx="80" cy="90" r="8" fill="#1c1917" />
            <circle cx="82" cy="88" r="2.5" fill="#fff" />
            <circle cx="120" cy="90" r="8" fill="#1c1917" />
            <circle cx="122" cy="88" r="2.5" fill="#fff" />
            <text x="30" y="45" fill="#ec4899" fontSize="12" fontFamily="monospace" fontWeight="bold">much wow</text>
            <text x="125" y="165" fill="#06b6d4" fontSize="12" fontFamily="monospace" fontWeight="bold">so amaze</text>
          </svg>
          <div className="absolute top-2 right-2 bg-yellow-400 text-black font-black text-[9px] px-1.5 py-0.5 rounded">
            ORIGINAL DOGE
          </div>
        </div>
      );

    case 'rock_eyebrow':
      return (
        <div className="relative w-56 h-56 mx-auto flex items-center justify-center bg-zinc-950 border-4 border-yellow-400 rounded-2xl shadow-[0_0_25px_rgba(250,204,21,0.5)] overflow-hidden p-4">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <ellipse cx="100" cy="100" rx="55" ry="70" fill="#a1a1aa" stroke="#3f3f46" strokeWidth="4" />
            {/* Raised left eyebrow (camera right) */}
            <path d="M115,50 Q135,35 155,58" stroke="#18181b" strokeWidth="8" strokeLinecap="round" fill="none" />
            {/* Normal right eyebrow */}
            <path d="M45,75 Q65,65 85,75" stroke="#18181b" strokeWidth="6" strokeLinecap="round" fill="none" />
            {/* Wide skeptical eye */}
            <ellipse cx="135" cy="72" rx="14" ry="10" fill="#fff" stroke="#000" strokeWidth="2" />
            <circle cx="135" cy="72" r="5" fill="#000" />
            <ellipse cx="65" cy="82" rx="11" ry="8" fill="#fff" stroke="#000" strokeWidth="2" />
            <circle cx="65" cy="82" r="4" fill="#000" />
            <path d="M90,135 Q100,128 115,133" stroke="#18181b" strokeWidth="4" fill="none" />
          </svg>
          <div className="absolute bottom-2 bg-black text-yellow-300 font-mono text-[10px] px-2 py-0.5 rounded border border-yellow-500">
            *BOOM SOUND EFFECT*
          </div>
        </div>
      );

    case 'toilet_head':
      return (
        <div className="relative w-56 h-56 mx-auto flex items-center justify-center bg-zinc-900 border-4 border-yellow-400 rounded-2xl shadow-[0_0_25px_rgba(250,204,21,0.5)] overflow-hidden p-4">
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
            <rect x="50" y="60" width="100" height="50" rx="8" fill="#e2e8f0" stroke="#0f172a" strokeWidth="5" />
            <rect x="45" y="50" width="110" height="15" rx="4" fill="#cbd5e1" stroke="#0f172a" strokeWidth="4" />
            <circle cx="65" cy="72" r="5" fill="#94a3b8" />
            <path d="M60,110 C60,160 140,160 140,110 Z" fill="#f8fafc" stroke="#0f172a" strokeWidth="5" />
            <ellipse cx="100" cy="110" rx="40" ry="12" fill="#38bdf8" stroke="#0284c7" strokeWidth="3" />
            <path d="M75,150 L65,185 L135,185 L125,150 Z" fill="#cbd5e1" stroke="#0f172a" strokeWidth="4" />
            <circle cx="100" cy="75" r="28" fill="#fbcfe8" stroke="#0f172a" strokeWidth="4" />
            <path d="M76,68 Q100,45 124,68 Q100,60 76,68 Z" fill="#334155" />
            <circle cx="90" cy="73" r="5" fill="#ffffff" stroke="#000" strokeWidth="2" />
            <circle cx="90" cy="73" r="2" fill="#000" />
            <circle cx="110" cy="73" r="5" fill="#ffffff" stroke="#000" strokeWidth="2" />
            <circle cx="110" cy="73" r="2" fill="#000" />
            <ellipse cx="100" cy="88" rx="8" ry="6" fill="#991b1b" stroke="#000" strokeWidth="2" />
            <text x="135" y="60" fontSize="18" fill="#f43f5e" fontWeight="bold">🎵</text>
            <text x="50" y="55" fontSize="16" fill="#06b6d4" fontWeight="bold">🎶</text>
          </svg>
          <div className="absolute top-2 right-2 bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white">
            SKIBIDI LEVEL 999
          </div>
        </div>
      );

    case 'mewing_jaw':
      return (
        <div className="relative w-56 h-56 mx-auto flex items-center justify-center bg-zinc-950 border-4 border-cyan-400 rounded-2xl shadow-[0_0_25px_rgba(34,211,238,0.5)] overflow-hidden p-4">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <polygon points="100,20 150,55 145,120 125,165 100,185 75,165 55,120 50,55" fill="#18181b" stroke="#22d3ee" strokeWidth="4" />
            <line x1="60" y1="90" x2="85" y2="125" stroke="#38bdf8" strokeWidth="3" />
            <line x1="140" y1="90" x2="115" y2="125" stroke="#38bdf8" strokeWidth="3" />
            <line x1="75" y1="165" x2="100" y2="185" stroke="#a855f7" strokeWidth="4" />
            <line x1="125" y1="165" x2="100" y2="185" stroke="#a855f7" strokeWidth="4" />
            <path d="M72,75 Q85,70 95,76" stroke="#22d3ee" strokeWidth="4" fill="none" />
            <path d="M105,76 Q115,70 128,75" stroke="#22d3ee" strokeWidth="4" fill="none" />
            <rect x="96" y="115" width="8" height="35" rx="4" fill="#fbbf24" stroke="#000" strokeWidth="2" />
          </svg>
          <div className="absolute bottom-2 left-2 bg-cyan-950 border border-cyan-400 text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
            🤫 BYE BYE 🧏‍♂️
          </div>
        </div>
      );

    case 'chill_guy':
      return (
        <div className="relative w-56 h-56 mx-auto flex items-center justify-center bg-amber-950/40 border-4 border-amber-400 rounded-2xl shadow-[0_0_20px_rgba(251,191,36,0.4)] overflow-hidden p-4">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="80" fill="#78350f" opacity="0.4" />
            <ellipse cx="100" cy="70" rx="35" ry="30" fill="#d97706" stroke="#451a03" strokeWidth="4" />
            <ellipse cx="65" cy="75" rx="12" ry="25" fill="#b45309" stroke="#451a03" strokeWidth="4" />
            <ellipse cx="135" cy="75" rx="12" ry="25" fill="#b45309" stroke="#451a03" strokeWidth="4" />
            <path d="M85,68 Q92,62 100,68" stroke="#1c1917" strokeWidth="3" fill="none" />
            <path d="M105,68 Q112,62 120,68" stroke="#1c1917" strokeWidth="3" fill="none" />
            <path d="M92,85 Q100,90 108,85" stroke="#1c1917" strokeWidth="3" fill="none" />
            <rect x="70" y="100" width="60" height="70" rx="10" fill="#9ca3af" stroke="#374151" strokeWidth="4" />
            <ellipse cx="66" cy="140" rx="10" ry="16" fill="#b45309" stroke="#374151" strokeWidth="3" />
            <ellipse cx="134" cy="140" rx="10" ry="16" fill="#b45309" stroke="#374151" strokeWidth="3" />
            <rect x="74" y="150" width="52" height="10" rx="2" fill="#3b82f6" />
          </svg>
          <div className="absolute bottom-2 text-center text-amber-300 font-bold text-xs bg-black/80 px-2 py-0.5 rounded border border-amber-500">
            LOWKEY UNBOTHERED
          </div>
        </div>
      );

    case 'grimace_shake':
      return (
        <div className="relative w-56 h-56 mx-auto flex items-center justify-center bg-purple-950 border-4 border-purple-500 rounded-2xl shadow-[0_0_25px_rgba(168,85,247,0.5)] overflow-hidden p-4">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <polygon points="70,60 130,60 120,165 80,165" fill="#7e22ce" stroke="#f3e8ff" strokeWidth="4" />
            <line x1="100" y1="20" x2="115" y2="70" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
            <path d="M65,60 C65,40 85,35 100,35 C115,35 135,40 135,60 Z" fill="#ffffff" stroke="#c084fc" strokeWidth="3" />
            <circle cx="100" cy="32" r="7" fill="#dc2626" />
            <path d="M85,60 Q90,90 95,75 Q100,105 105,70" fill="none" stroke="#d8b4fe" strokeWidth="4" strokeLinecap="round" />
            <ellipse cx="90" cy="110" rx="5" ry="6" fill="#ffffff" />
            <circle cx="90" cy="110" r="2" fill="#000" />
            <ellipse cx="110" cy="110" rx="5" ry="6" fill="#ffffff" />
            <circle cx="110" cy="110" r="2" fill="#000" />
            <path d="M92,125 Q100,135 108,125" stroke="#ffffff" strokeWidth="3" fill="none" />
          </svg>
          <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded animate-pulse">
            ⚠️ DO NOT DRINK
          </div>
        </div>
      );

    case 'smurf_cat':
      return (
        <div className="relative w-56 h-56 mx-auto flex items-center justify-center bg-cyan-950 border-4 border-cyan-300 rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.5)] overflow-hidden p-4">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path d="M40,90 C40,30 160,30 160,90 Z" fill="#0284c7" stroke="#38bdf8" strokeWidth="4" />
            <circle cx="70" cy="60" r="9" fill="#ffffff" />
            <circle cx="100" cy="48" r="7" fill="#ffffff" />
            <circle cx="130" cy="65" r="10" fill="#ffffff" />
            <ellipse cx="100" cy="115" rx="35" ry="30" fill="#38bdf8" stroke="#0369a1" strokeWidth="3" />
            <polygon points="97,118 103,118 100,123" fill="#ec4899" />
            <circle cx="85" cy="108" r="9" fill="#0f172a" />
            <circle cx="87" cy="105" r="3" fill="#ffffff" />
            <circle cx="115" cy="108" r="9" fill="#0f172a" />
            <circle cx="117" cy="105" r="3" fill="#ffffff" />
            <line x1="145" y1="90" x2="155" y2="175" stroke="#854d0e" strokeWidth="4" strokeLinecap="round" />
            <circle cx="145" cy="88" r="10" fill="#fb923c" />
          </svg>
          <div className="absolute bottom-2 text-cyan-200 text-[10px] font-mono bg-black/80 px-2 py-0.5 rounded border border-cyan-500">
            WE LIVE, WE LOVE, WE LIE
          </div>
        </div>
      );

    case 'caseoh_mic':
      return (
        <div className="relative w-56 h-56 mx-auto flex items-center justify-center bg-zinc-900 border-4 border-red-500 rounded-2xl shadow-[0_0_25px_rgba(239,68,68,0.5)] overflow-hidden p-4">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path d="M55,90 C55,40 145,40 145,90" stroke="#f59e0b" strokeWidth="12" fill="none" />
            <rect x="42" y="80" width="22" height="35" rx="8" fill="#1e293b" stroke="#ea580c" strokeWidth="3" />
            <rect x="136" y="80" width="22" height="35" rx="8" fill="#1e293b" stroke="#ea580c" strokeWidth="3" />
            <rect x="60" y="115" width="80" height="65" rx="15" fill="#dc2626" stroke="#7f1d1d" strokeWidth="4" />
            <rect x="40" y="172" width="120" height="20" rx="4" fill="#64748b" stroke="#334155" strokeWidth="3" />
            <rect x="75" y="175" width="50" height="12" fill="#000" />
            <text x="80" y="184" fill="#ef4444" fontSize="8" fontFamily="monospace" fontWeight="bold">ERROR: MAX</text>
            <circle cx="100" cy="100" r="32" fill="#fed7aa" stroke="#000" strokeWidth="3" />
            <path d="M72,105 Q100,135 128,105 Q100,145 72,105 Z" fill="#c2410c" />
            <ellipse cx="100" cy="115" rx="14" ry="10" fill="#450a0a" stroke="#000" strokeWidth="2" />
            <text x="145" y="60" fontSize="18">🧇</text>
          </svg>
          <div className="absolute top-2 right-2 bg-red-600 text-white font-black text-[10px] px-1.5 py-0.5 rounded border border-white uppercase">
            🚨 BANNED!
          </div>
        </div>
      );

    default:
      return (
        <div className="w-56 h-56 mx-auto flex items-center justify-center bg-zinc-900 border-2 border-dashed border-zinc-600 rounded-2xl text-5xl">
          🧠💀
        </div>
      );
  }
};
