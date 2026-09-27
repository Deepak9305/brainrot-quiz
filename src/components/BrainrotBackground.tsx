import React from 'react';

interface BrainrotBackgroundProps {
  crtEnabled: boolean;
  scanlinesEnabled: boolean;
}

export const BrainrotBackground: React.FC<BrainrotBackgroundProps> = ({
  crtEnabled,
  scanlinesEnabled,
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Dynamic Cyber Grid Floor */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-zinc-950 to-black" />

      {/* Floating Retro Brainrot Glyphs */}
      <div className="absolute inset-0 opacity-15 overflow-hidden">
        <span className="absolute top-[10%] left-[8%] text-5xl animate-bounce duration-1000">🗿</span>
        <span className="absolute top-[25%] right-[12%] text-4xl animate-pulse">🚽</span>
        <span className="absolute top-[65%] left-[5%] text-6xl animate-bounce">🤫</span>
        <span className="absolute top-[75%] right-[8%] text-5xl animate-spin duration-3000">💀</span>
        <span className="absolute bottom-[15%] left-[30%] text-4xl animate-pulse">🦅</span>
        <span className="absolute top-[40%] left-[85%] text-5xl animate-bounce">🍕</span>
        <span className="absolute top-[8%] right-[35%] text-4xl">🧢</span>
        <span className="absolute bottom-[25%] right-[25%] text-5xl animate-pulse">🔥</span>
      </div>

      {/* Retro Arcade Grid at Bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-64 opacity-25"
        style={{
          backgroundImage: `linear-gradient(to right, #ec4899 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          transform: 'perspective(400px) rotateX(60deg)',
          transformOrigin: 'bottom center',
        }}
      />

      {/* Retro CRT Scanlines Overlay */}
      {scanlinesEnabled && (
        <div 
          className="absolute inset-0 pointer-events-none z-40 opacity-30"
          style={{
            backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.75) 50%)',
            backgroundSize: '100% 4px',
          }}
        />
      )}

      {/* CRT Vignette & Curvature Flicker */}
      {crtEnabled && (
        <div 
          className="absolute inset-0 pointer-events-none z-40 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] border-[3px] border-zinc-900/60"
        />
      )}
    </div>
  );
};
