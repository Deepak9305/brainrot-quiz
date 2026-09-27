import { Question } from '../types';

const italian = (question: Omit<Question, 'mode'>): Question => ({
  ...question,
  mode: 'image',
  era: 'italian_brainrot',
  eligibleForRush: true,
  eligibleForDaily: true,
  tags: [...(question.tags ?? []), '2025', 'italian brainrot'],
});

const currentSlang = (question: Omit<Question, 'mode'>): Question => ({
  ...question,
  mode: 'slang',
  era: '2026',
  eligibleForRush: true,
  eligibleForDaily: true,
  tags: [...(question.tags ?? []), '2026', 'slang'],
});

export const MODERN_QUESTIONS: Question[] = [
  italian({
    id: 'it_1', question: 'Which local character reference shows the blue shark in sneakers?', subtitle: 'ITALIAN BRAINROT / IDENTIFY', visualType: 'image', visualContent: 'tralalero_tralala', imageAsset: 'tralalero_tralala', questionType: 'image_identification', options: ['Tralalero Tralala', 'Bombardiro Crocodilo', 'Brr Brr Patapim', 'Bombombini Gusini'], correctAnswer: 0, explanation: 'The sneaker-wearing blue shark is the visual shorthand used for Tralalero Tralala.', memeContext: 'Italian Brainrot characters are remixed community creations, so fan-made lore varies by edit.', difficulty: 'easy',
  }),
  italian({
    id: 'it_2', question: 'Name the crocodile-aircraft hybrid in this local reference.', subtitle: 'ITALIAN BRAINROT / MATCH THE NAME', visualType: 'image', visualContent: 'bombardiro_crocodilo', imageAsset: 'bombardiro_crocodilo', questionType: 'image_identification', options: ['Bombardiro Crocodilo', 'Trippi Troppi', 'Lirili Larila', 'Cappuccino Assassino'], correctAnswer: 0, explanation: 'Bombardiro Crocodilo is usually portrayed as a crocodile fused with a bomber aircraft.', memeContext: 'Community lore makes the character intentionally surreal instead of canonically consistent.', difficulty: 'easy',
  }),
  italian({
    id: 'it_3', question: 'The wooden figure with the bat is usually called what?', subtitle: 'ITALIAN BRAINROT / DETAIL TEST', visualType: 'image', visualContent: 'tung_tung_tung_sahur', imageAsset: 'tung_tung_tung_sahur', questionType: 'image_crop', options: ['Tung Tung Tung Sahur', 'Cappuccino Assassino', 'Brr Brr Patapim', 'Bombombini Gusini'], correctAnswer: 0, explanation: 'The wooden drum-like figure is the recurring visual for Tung Tung Tung Sahur.', memeContext: 'The repeated name-call is a community meme format, not a licensed catchphrase.', difficulty: 'easy',
  }),
  italian({
    id: 'it_4', question: 'Which forest-footed creature is shown in the local reference?', subtitle: 'ITALIAN BRAINROT / SILHOUETTE', visualType: 'image', visualContent: 'brr_brr_patapim', imageAsset: 'brr_brr_patapim', imageVariant: 'silhouette', questionType: 'silhouette', options: ['Brr Brr Patapim', 'Tralalero Tralala', 'Bombardiro Crocodilo', 'Trippi Troppi'], correctAnswer: 0, explanation: 'Brr Brr Patapim is commonly shown as a long-legged forest creature with oversized feet.', memeContext: 'Its lore is fan-made and changes across short-form edits.', difficulty: 'medium',
  }),
  italian({
    id: 'it_5', question: 'A cropped blue shark and sneakers point to which character?', subtitle: 'ITALIAN BRAINROT / CROPPED', visualType: 'image', visualContent: 'tralalero_tralala', imageAsset: 'tralalero_tralala', imageVariant: 'crop', questionType: 'image_crop', options: ['Tralalero Tralala', 'Ballerina Cappuccina', 'Lirili Larila', 'Cappuccino Assassino'], correctAnswer: 0, explanation: 'The blue body and sneakers are the key visual anchors for Tralalero Tralala.', memeContext: 'This crop is a gameplay clue, not a claim that the image is an official source frame.', difficulty: 'medium',
  }),
  italian({
    id: 'it_6', question: 'Which character is represented by the crocodile-aircraft silhouette?', subtitle: 'ITALIAN BRAINROT / HARD CLUE', visualType: 'image', visualContent: 'bombardiro_crocodilo', imageAsset: 'bombardiro_crocodilo', imageVariant: 'silhouette', questionType: 'silhouette', options: ['Bombardiro Crocodilo', 'Ballerina Cappuccina', 'Tung Tung Tung Sahur', 'Tralalero Tralala'], correctAnswer: 0, explanation: 'The aircraft profile and crocodile snout make Bombardiro Crocodilo the intended answer.', memeContext: 'Fan edits often exaggerate the character into a flying menace.', difficulty: 'hard',
  }),
  italian({
    id: 'it_7', question: 'Which character is associated with the repeated "tung tung tung" call?', subtitle: 'ITALIAN BRAINROT / SOUND CUE', visualType: 'image', visualContent: 'tung_tung_tung_sahur', imageAsset: 'tung_tung_tung_sahur', questionType: 'image_identification', options: ['Tung Tung Tung Sahur', 'Brr Brr Patapim', 'Lirili Larila', 'Trippi Troppi'], correctAnswer: 0, explanation: 'Tung Tung Tung Sahur is the character associated with that repeated name-call in the meme format.', memeContext: 'The connection is community lore rather than an official story universe.', difficulty: 'medium',
  }),
  italian({
    id: 'it_8', question: 'Long legs, oversized feet, forest energy: which character is this?', subtitle: 'ITALIAN BRAINROT / IDENTIFY', visualType: 'image', visualContent: 'brr_brr_patapim', imageAsset: 'brr_brr_patapim', questionType: 'image_identification', options: ['Brr Brr Patapim', 'Bombardiro Crocodilo', 'Tralalero Tralala', 'Cappuccino Assassino'], correctAnswer: 0, explanation: 'The long-legged forest creature is the visual shorthand for Brr Brr Patapim.', memeContext: 'Like much of Italian Brainrot, its lore is intentionally remixable.', difficulty: 'easy',
  }),
  currentSlang({
    id: 'slg_2026_1', question: 'What does "6-7" usually do in current short-form meme language?', subtitle: 'CURRENT SLANG / 2026', visualType: 'ascii', visualContent: '6 - 7', questionType: 'standard', options: ['Act as a deliberately context-light chant or inside joke', 'Describe a seven-hour sleep schedule', 'Rate a meal out of ten', 'Name a new phone model'], correctAnswer: 0, explanation: '6-7 is often used as a deliberately context-light chant or in-group joke rather than a precise definition.', memeContext: 'Its meaning is highly platform- and community-dependent, so it should not be treated as formal slang.', difficulty: 'medium',
  }),
  currentSlang({
    id: 'slg_2026_2', question: 'What is "aura farming"?', subtitle: 'CURRENT SLANG / SOCIAL ENERGY', visualType: 'ascii', visualContent: '+ AURA', questionType: 'standard', options: ['Doing things mainly to look effortlessly cool or impressive', 'Collecting coins in a farming game', 'Growing herbs for energy drinks', 'Practicing magic in a role-playing game'], correctAnswer: 0, explanation: 'Aura farming means deliberately performing cool-looking moments to build perceived social aura.', memeContext: 'The phrase is usually playful and ironic, not a measurable score system.', difficulty: 'easy',
  }),
  currentSlang({
    id: 'slg_2026_3', question: 'If someone is "locked in", what are they doing?', subtitle: 'CURRENT SLANG / FOCUS CHECK', visualType: 'ascii', visualContent: '[ LOCKED IN ]', questionType: 'standard', options: ['Focusing intensely on the task or moment', 'Leaving a group chat permanently', 'Locking a door before school', 'Starting an argument for attention'], correctAnswer: 0, explanation: 'Locked in means focused, committed, and fully engaged with what is happening.', memeContext: 'It appears in gaming, sports, studying, and meme captions.', difficulty: 'easy',
  }),
  currentSlang({
    id: 'slg_2026_4', question: 'What does "glazing" mean in online slang?', subtitle: 'CURRENT SLANG / CHAT LORE', visualType: 'ascii', visualContent: 'PRAISE METER: MAX', questionType: 'standard', options: ['Overpraising or excessively flattering someone', 'Making a pastry with sugar glaze', 'Ignoring a message for a week', 'Winning a speedrun without practice'], correctAnswer: 0, explanation: 'Glazing is a joking accusation that someone is praising another person far too much.', memeContext: 'It is commonly used in chat and sports debates when compliments feel excessive.', difficulty: 'medium',
  }),
  currentSlang({
    id: 'slg_2026_5', question: 'When someone is called "chopped", what is the usual meaning?', subtitle: 'CURRENT SLANG / LOOKS CHECK', visualType: 'ascii', visualContent: 'AURA: LOW', questionType: 'standard', options: ['They are being described as unattractive or rough-looking', 'They finished chopping vegetables', 'They are extremely fast at editing', 'They are offline for the day'], correctAnswer: 0, explanation: 'Chopped is a blunt appearance insult meaning someone is seen as unattractive in that moment.', memeContext: 'Use it as meme slang, not as an objective judgment about a real person.', difficulty: 'medium',
  }),
  currentSlang({
    id: 'slg_2026_6', question: 'In current meme slang, what is an "unc"?', subtitle: 'CURRENT SLANG / GENERATIONAL LORE', visualType: 'ascii', visualContent: 'UNC DETECTED', questionType: 'standard', options: ['A joking way to call someone older or out of touch', 'A secret gaming rank', 'A creator with no username', 'A unit of internet bandwidth'], correctAnswer: 0, explanation: 'Unc is short for uncle and is used playfully for someone perceived as older or behind a trend.', memeContext: 'The tone can be affectionate or teasing depending on context.', difficulty: 'easy',
  }),
];
