import { UserStats } from '../types';

export interface TitleDefinition {
  id: string;
  title: string;
  description: string;
  condition: (stats: UserStats) => boolean;
}

export const TITLE_DEFINITIONS: TitleDefinition[] = [
  { id: 'npc', title: 'Brainrot NPC', description: 'The default spawn.', condition: () => true },
  { id: 'cadet', title: 'Skibidi Cadet', description: 'Ready for the algorithm.', condition: (stats) => stats.quizzesCompleted >= 1 },
  { id: 'ohio', title: 'Ohio Survivor', description: 'Survive three Daily completions.', condition: (stats) => stats.streak >= 3 },
  { id: 'mewing', title: 'Mewing Master', description: 'Hold a seven-day Daily streak.', condition: (stats) => stats.streak >= 7 },
  { id: 'aura', title: 'Aura Farmer', description: 'Earn 2,000 Aura.', condition: (stats) => stats.auraPoints >= 2_000 },
  { id: 'speed', title: 'Speed Demon Rizzler', description: 'Score 5,000 in Rush.', condition: (stats) => stats.highestRushScore >= 5_000 },
  { id: 'mogger', title: 'Giga Chad Mogger', description: 'Complete 50 quizzes.', condition: (stats) => stats.quizzesCompleted >= 50 },
  { id: 'terminal', title: 'Supreme Brainrot God', description: 'Reach a 30-day Daily streak.', condition: (stats) => stats.streak >= 30 },
  { id: 'archive-curator', title: 'Archive Curator', description: 'Discover 20 Archive subjects.', condition: (stats) => stats.archiveMilestonesClaimed.includes(20) },
  { id: 'archive-completionist', title: 'The Feed Is Mine', description: 'Complete the Brainrot Archive.', condition: (stats) => stats.archiveMilestonesClaimed.includes(100) },
];
