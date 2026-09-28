export type CosmeticType = 'theme' | 'card' | 'effect';

export interface CosmeticDefinition {
  id: string;
  type: CosmeticType;
  name: string;
  description: string;
  cost: number;
  swatch: string;
  exclusive?: boolean;
}

export const COSMETICS: CosmeticDefinition[] = [
  { id: 'theme_default', type: 'theme', name: 'DEFAULT CRT', description: 'The original arcade shell.', cost: 0, swatch: 'from-zinc-900 to-black' },
  { id: 'theme_cyber_pink', type: 'theme', name: 'CYBER PINK', description: 'Hot pink scanlines and neon charge.', cost: 1500, swatch: 'from-pink-600 to-purple-950' },
  { id: 'theme_ohio_hazard', type: 'theme', name: 'OHIO HAZARD', description: 'Amber warning lights for terminal scrollers.', cost: 3000, swatch: 'from-amber-500 to-red-950' },
  { id: 'theme_void_crt', type: 'theme', name: 'VOID CRT', description: 'Cold cyan glow from the final boss room.', cost: 5000, swatch: 'from-cyan-500 to-slate-950' },
  { id: 'theme_archive_chrome', type: 'theme', name: 'ARCHIVE CHROME', description: 'UNLOCKED VIA ARCHIVE • Complete every Archive entry.', cost: 0, swatch: 'from-cyan-200 via-slate-400 to-purple-700', exclusive: true },
  { id: 'card_default', type: 'card', name: 'ARCADE CARD', description: 'The stock zinc card frame.', cost: 0, swatch: 'from-zinc-700 to-zinc-950' },
  { id: 'card_holo', type: 'card', name: 'HOLO BORDER', description: 'A shifting rainbow edge for big answers.', cost: 1500, swatch: 'from-pink-400 via-yellow-300 to-cyan-400' },
  { id: 'card_gold', type: 'card', name: 'GOLD RANK', description: 'A premium frame for premium brainrot.', cost: 3000, swatch: 'from-yellow-300 to-orange-600' },
  { id: 'effect_default', type: 'effect', name: 'CONFETTI POP', description: 'The classic correct-answer burst.', cost: 0, swatch: 'from-emerald-400 to-cyan-500' },
  { id: 'effect_pixel', type: 'effect', name: 'PIXEL BURST', description: 'Chunky arcade particles on a correct answer.', cost: 2000, swatch: 'from-indigo-400 to-purple-700' },
  { id: 'effect_fire', type: 'effect', name: 'AURA FIRE', description: 'A warmer streak effect for locked-in runs.', cost: 4000, swatch: 'from-orange-300 to-red-600' },
];

export function getCosmetic(id: string): CosmeticDefinition | undefined {
  return COSMETICS.find((cosmetic) => cosmetic.id === id);
}
