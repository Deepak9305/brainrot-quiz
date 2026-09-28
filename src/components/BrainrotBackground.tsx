import React from 'react';
import { ThemeConfig } from '../data/themes';

interface BrainrotBackgroundProps {
  crtEnabled: boolean;
  scanlinesEnabled: boolean;
  theme: ThemeConfig;
  isRush?: boolean;
}

export const BrainrotBackground: React.FC<BrainrotBackgroundProps> = ({
  crtEnabled,
  scanlinesEnabled,
  theme,
  isRush = false,
}) => {
  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden select-none ${isRush ? 'rush-background' : ''}`}>
      {/* Dynamic Cyber Grid Floor */}
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at top, ${theme.glow} 0%, ${theme.background} 46%, #000 100%)` }} />

      {/* Floating Retro Brainrot Glyphs */}
      <div className="theme-floating-glyphs absolute inset-0 opacity-15 overflow-hidden">
        <span className="theme-floating-glyph absolute top-[10%] left-[8%] text-5xl animate-bounce duration-1000">🗿</span>
        <span className="theme-floating-glyph absolute top-[25%] right-[12%] text-4xl animate-pulse">🚽</span>
        <span className="theme-floating-glyph absolute top-[65%] left-[5%] text-6xl animate-bounce">🤫</span>
        <span className="theme-floating-glyph absolute top-[75%] right-[8%] text-5xl animate-spin duration-3000">💀</span>
        <span className="theme-floating-glyph absolute bottom-[15%] left-[30%] text-4xl animate-pulse">🦅</span>
        <span className="theme-floating-glyph absolute top-[40%] left-[85%] text-5xl animate-bounce">🍕</span>
        <span className="theme-floating-glyph absolute top-[8%] right-[35%] text-4xl">🧢</span>
        <span className="theme-floating-glyph absolute bottom-[25%] right-[25%] text-5xl animate-pulse">🔥</span>
      </div>

      {/* Retro Arcade Grid at Bottom */}
      <div 
        className="theme-background-grid absolute bottom-0 left-0 right-0 h-64 opacity-25"
        style={{
          backgroundImage: `linear-gradient(to right, ${theme.gridPrimary} 1px, transparent 1px), linear-gradient(to bottom, ${theme.gridSecondary} 1px, transparent 1px)`,
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
