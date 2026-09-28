export interface ArchiveEntry {
  subjectKey: string;
  name: string;
  emoji: string;
  description: string;
  era: string;
  category: string;
  mediaKey?: string;
}

const ARCHIVE_ENTRIES_BASE: ArchiveEntry[] = [
  { subjectKey: 'tralalero_tralala', name: 'Tralalero Tralala', emoji: '🦈👟', description: 'The sneaker-wearing shark reference from Italian Brainrot edits.', era: '2025', category: 'Italian Brainrot', mediaKey: 'tralalero_tralala' },
  { subjectKey: 'bombardiro_crocodilo', name: 'Bombardiro Crocodilo', emoji: '🐊✈️', description: 'A crocodile-aircraft mashup passed around through surreal edits.', era: '2025', category: 'Italian Brainrot', mediaKey: 'bombardiro_crocodilo' },
  { subjectKey: 'tung_tung_tung_sahur', name: 'Tung Tung Tung Sahur', emoji: '🪵🥁', description: 'The wooden drum-and-bat character with a repeated chant.', era: '2025', category: 'Italian Brainrot', mediaKey: 'tung_tung_tung_sahur' },
  { subjectKey: 'brr_brr_patapim', name: 'Brr Brr Patapim', emoji: '🌲🦶', description: 'Long-legged forest energy with enormous feet.', era: '2025', category: 'Italian Brainrot', mediaKey: 'brr_brr_patapim' },
  { subjectKey: 'ballerina_cappuccina', name: 'Ballerina Cappuccina', emoji: '🩰☕', description: 'A coffee-cup ballerina from the community-made character family.', era: '2025', category: 'Italian Brainrot', mediaKey: 'ballerina_cappuccina' },
  { subjectKey: 'cappuccino_assassino', name: 'Cappuccino Assassino', emoji: '☕🗡️', description: 'Coffee-shop stealth energy in a surreal character name.', era: '2025', category: 'Italian Brainrot', mediaKey: 'cappuccino_assassino' },
  { subjectKey: 'lirili_larila', name: 'Lirili Larila', emoji: '🐘🐪', description: 'A desert-walking elephant/camel mashup in fan edits.', era: '2025', category: 'Italian Brainrot', mediaKey: 'lirili_larila' },
  { subjectKey: 'trippi_troppi', name: 'Trippi Troppi', emoji: '🐟🐱', description: 'A chaotic hybrid reference whose fan depictions vary by edit.', era: '2025', category: 'Italian Brainrot', mediaKey: 'trippi_troppi' },
  { subjectKey: 'bombombini_gusini', name: 'Bombombini Gusini', emoji: '🪿✈️', description: 'The goose-and-aircraft mashup from remixable Brainrot lore.', era: '2025', category: 'Italian Brainrot', mediaKey: 'bombombini_gusini' },
  { subjectKey: 'chimpanzini_bananini', name: 'Chimpanzini Bananini', emoji: '🐒🍌', description: 'A banana monkey clue that became a recognizable name association.', era: '2025', category: 'Italian Brainrot', mediaKey: 'chimpanzini_bananini' },
  { subjectKey: 'frigo_camelo', name: 'Frigo Camelo', emoji: '🧊🐪', description: 'The refrigerator-camel pairing from surreal community lists.', era: '2025', category: 'Italian Brainrot', mediaKey: 'frigo_camelo' },
  { subjectKey: 'vaca_saturno', name: 'La Vaca Saturno Saturnita', emoji: '🐄🪐', description: 'The cosmic cow reference with a Saturn clue.', era: '2025', category: 'Italian Brainrot' },
  { subjectKey: 'boneca_ambalabu', name: 'Boneca Ambalabu', emoji: '🐸🛞', description: 'A frog-and-tire mashup preserved as a local visual reference.', era: '2025', category: 'Italian Brainrot', mediaKey: 'boneca_ambalabu' },
  { subjectKey: 'ecco_cavallo_virtuoso', name: 'Ecco Cavallo Virtuoso', emoji: '🐎🎹', description: 'A surreal horse-and-piano reference from Italian Brainrot lists.', era: '2025', category: 'Italian Brainrot', mediaKey: 'ecco_cavallo_virtuoso' },
  { subjectKey: 'frulli_frulla', name: 'Frulli Frulla', emoji: '🌪️', description: 'A less common but documented character reference from the visual archive.', era: '2025', category: 'Italian Brainrot', mediaKey: 'frulli_frulla' },
  { subjectKey: 'udin_din_din_dun', name: 'Udin Din Din Dun', emoji: '🎵', description: 'A documented Italian Brainrot visual reference for deep-cut players.', era: '2025', category: 'Italian Brainrot', mediaKey: 'udin_din_din_dun' },
  { subjectKey: 'classic_deep_01', name: 'Doge', emoji: '🐕', description: 'A Shiba Inu caption format that became a foundational meme template.', era: 'OG', category: 'Classic Memes' },
  { subjectKey: 'classic_deep_02', name: 'Rickroll', emoji: '🎵🔗', description: 'A bait-and-switch link that plays a familiar music video.', era: 'OG', category: 'Classic Memes' },
  { subjectKey: 'classic_deep_03', name: 'Vine', emoji: '🔁📱', description: 'The short-loop video platform that shaped internet comedy.', era: 'OG', category: 'Classic Memes' },
  { subjectKey: 'classic_deep_04', name: 'Harlem Shake', emoji: '🕺💥', description: 'A 2013 group-video format with a sudden chaotic switch.', era: 'OG', category: 'Classic Memes' },
  { subjectKey: 'classic_deep_05', name: 'Keyboard Cat', emoji: '🐈🎹', description: 'A cat reaction format used to punctuate online failure.', era: 'OG', category: 'Classic Memes' },
  { subjectKey: 'classic_deep_06', name: 'Nyan Cat', emoji: '🌈🐈', description: 'A pixel cat with a Pop-Tart body and a rainbow trail.', era: 'OG', category: 'Classic Memes' },
  { subjectKey: 'classic_deep_07', name: 'This Is Fine', emoji: '🐶🔥', description: 'Calm denial while everything around the character is on fire.', era: 'OG', category: 'Classic Memes' },
  { subjectKey: 'classic_deep_08', name: 'Distracted Boyfriend', emoji: '👀🚶', description: 'A stock-photo format for temptation and shifting attention.', era: 'OG', category: 'Classic Memes' },
  { subjectKey: 'classic_deep_09', name: 'Hide the Pain Harold', emoji: '🙂💀', description: 'The strained smile reaction that hides discomfort.', era: 'OG', category: 'Classic Memes' },
  { subjectKey: 'classic_deep_10', name: 'Success Kid', emoji: '✊👶', description: 'A tiny fist-pump used for small but satisfying wins.', era: 'OG', category: 'Classic Memes' },
  { subjectKey: 'emoji_deep_01', name: 'Fire Crown', emoji: '🔥👑', description: 'An emoji pairing for an elite or legendary moment.', era: 'Current', category: 'Emoji Lore' },
  { subjectKey: 'emoji_deep_05', name: 'Melting Face', emoji: '🫠', description: 'Overwhelmed embarrassment, heat, or awkward discomfort.', era: 'Current', category: 'Emoji Lore' },
  { subjectKey: 'emoji_deep_09', name: 'Red Flag', emoji: '🚩', description: 'A compact warning sign for behavior worth noticing.', era: 'Current', category: 'Emoji Lore' },
  { subjectKey: 'slg_deep_01', name: 'Delulu', emoji: '🌀', description: 'Playfully delusional or unrealistically hopeful thinking.', era: 'Current', category: 'Slang' },
  { subjectKey: 'slg_deep_04', name: 'Ratio', emoji: '📊', description: 'A reply receives more engagement than the original post.', era: 'Current', category: 'Slang' },
  { subjectKey: 'slg_deep_13', name: 'Crash Out', emoji: '💥', description: 'An impulsive emotional blow-up or reckless reaction.', era: 'Current', category: 'Slang' },
  { subjectKey: 'slg_deep_24', name: 'IJBOL', emoji: '😂', description: 'Internet shorthand for suddenly bursting out laughing.', era: 'Current', category: 'Slang' },
];

export const ARCHIVE_ENTRIES: ArchiveEntry[] = ARCHIVE_ENTRIES_BASE;
