import React from 'react';

interface AnswerEffectProps {
  effectId: string;
  triggerKey: string | null;
  reducedMotion?: boolean;
}

const PARTICLES = [
  [-54, -28, -18], [-30, -50, -8], [0, -58, 0], [34, -46, 12], [58, -22, 24],
  [-62, 14, -28], [-34, 36, -12], [28, 40, 12], [60, 18, 28], [4, 58, 2],
] as const;

/** Small, local-only answer bursts. The key makes every correct answer replayable. */
export const AnswerEffect: React.FC<AnswerEffectProps> = ({ effectId, triggerKey, reducedMotion = false }) => {
  if (!triggerKey || reducedMotion || (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)) {
    return null;
  }

  const effectClass = effectId === 'effect_pixel'
    ? 'answer-effect-pixel'
    : effectId === 'effect_fire'
      ? 'answer-effect-fire'
      : 'answer-effect-default';

  return (
    <div key={`${effectId}-${triggerKey}`} className={`answer-effect ${effectClass}`} aria-hidden="true">
      {PARTICLES.map(([x, y, rotate], index) => (
        <span
          key={`${triggerKey}-${index}`}
          className="answer-effect-particle"
          style={{
            '--particle-x': `${x}px`,
            '--particle-y': `${y}px`,
            '--particle-rotate': `${rotate}deg`,
            '--particle-delay': `${index * 12}ms`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};
