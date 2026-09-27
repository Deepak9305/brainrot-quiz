import React, { useState } from 'react';
import { getLocalMediaAsset } from '../data/media';

interface MemeArtProps {
  type: string;
  imageUrl?: string;
  altText?: string;
  variant?: 'standard' | 'crop' | 'silhouette';
}

const FALLBACK_CLUES: Record<string, { icon: string; title: string }> = {
  toilet_head: { icon: '🚽', title: 'Plumbing clue' },
  mewing_jaw: { icon: '🗿', title: 'Jawline clue' },
  chill_guy: { icon: '😌', title: 'Unbothered clue' },
  grimace_shake: { icon: '🥤', title: 'Shake clue' },
  smurf_cat: { icon: '🐱', title: 'Blue cat clue' },
  caseoh_mic: { icon: '🎙️', title: 'Streamer clue' },
  doge_shiba: { icon: '🐕', title: 'Doge clue' },
  rock_eyebrow: { icon: '🤨', title: 'Eyebrow clue' },
};

export const MemeArt: React.FC<MemeArtProps> = ({ type, altText, variant = 'standard' }) => {
  const asset = getLocalMediaAsset(type);
  const [imageFailed, setImageFailed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (asset && !imageFailed) {
    const imageClass = variant === 'crop'
      ? 'scale-[1.65] object-cover'
      : variant === 'silhouette'
        ? 'object-contain grayscale contrast-125 brightness-75'
        : 'object-contain';

    return (
      <figure
        className="relative w-full max-w-md aspect-square mx-auto rounded-2xl overflow-hidden border-2 border-pink-500/80 bg-zinc-950 shadow-[0_0_30px_rgba(236,72,153,0.32)]"
        aria-busy={!imageLoaded}
      >
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 animate-pulse">
            <span className="text-xs font-mono text-zinc-500">LOADING LOCAL CLUE…</span>
          </div>
        )}
        <img
          src={asset.src}
          alt={altText || asset.alt}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageFailed(true)}
          className={`h-full w-full transition-transform duration-300 ${imageClass} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-3 pb-2 pt-7 text-[10px] font-mono font-bold text-pink-200">
          <span>{asset.label}</span>
          <span className="text-yellow-300">{variant === 'silhouette' ? 'SILHOUETTE' : variant === 'crop' ? 'CROP CLUE' : 'OFFLINE'}</span>
        </div>
        <figcaption className="sr-only">{asset.alt}</figcaption>
      </figure>
    );
  }

  const fallback = FALLBACK_CLUES[type] ?? { icon: '🧠', title: 'Illustrated clue' };
  return (
    <div className="relative w-full max-w-md aspect-square mx-auto flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-zinc-600 bg-zinc-900/90 p-6 text-center shadow-[0_0_20px_rgba(148,163,184,0.16)]">
      <span className="text-7xl" aria-hidden="true">{fallback.icon}</span>
      <span className="text-sm font-black uppercase tracking-wider text-zinc-200">{fallback.title}</span>
      <span className="max-w-xs text-[10px] font-mono uppercase text-zinc-500">Illustrated clue • source media unavailable</span>
      <span className="sr-only">{altText || `${fallback.title} visual clue`}</span>
    </div>
  );
};
