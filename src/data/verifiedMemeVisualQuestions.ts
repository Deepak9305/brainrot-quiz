import { Question } from '../types';

const verifiedMemeQuestion = (seed: Omit<Question, 'mode' | 'visualType' | 'useMediaAsQuestion' | 'imageAsset' | 'visualContent'> & { imageAsset: string }): Question => ({
  ...seed,
  mode: 'image',
  visualType: 'image',
  visualContent: seed.imageAsset,
  imageAsset: seed.imageAsset,
  useMediaAsQuestion: true,
  eligibleForRush: false,
  eligibleForDaily: true,
});

export const VERIFIED_MEME_VISUAL_QUESTIONS: Question[] = [
  verifiedMemeQuestion({
    id: 'meme_visual_woman_yelling_at_cat_01', question: 'Which meme template is associated with this recognizable yelling reaction photo?', subtitle: 'VISUAL MODE / IDENTIFY THE IMAGE', imageAsset: 'woman_yelling_at_cat', imageVariant: 'standard', questionType: 'image_identification', category: 'classic_memes', era: 'late_2010s', subjectKey: 'woman_yelling_at_cat', options: ['Woman Yelling at a Cat', 'Confused Math Lady', 'Side Eye Chloe', 'Bad Luck Brian'], correctAnswer: 0, explanation: 'The photo is the recognizable yelling half of the Woman Yelling at a Cat template.', memeContext: 'The image became a major reaction-template format after its 2019 social-media resurgence.', difficulty: 'medium',
  }),
  verifiedMemeQuestion({
    id: 'meme_visual_argument_invalid_01', question: 'Which classic image macro is this?', subtitle: 'VISUAL MODE / IDENTIFY THE IMAGE', imageAsset: 'your_argument_is_invalid', imageVariant: 'standard', questionType: 'image_identification', category: 'classic_memes', era: 'early_2010s', subjectKey: 'your_argument_is_invalid', options: ['Your Argument Is Invalid', 'The Floor Is Lava', 'Shark Tank', 'Always Has Been'], correctAnswer: 0, explanation: 'The shark emerging through a roof is the documented Your Argument Is Invalid macro.', memeContext: 'The deliberately impossible shark image turns an argument into a punchline.', difficulty: 'medium',
  }),
  verifiedMemeQuestion({
    id: 'meme_visual_xzibit_01', question: 'Which meme format uses the “Yo Dawg, I heard you like…” setup?', subtitle: 'VISUAL MODE / IDENTIFY THE TEMPLATE', imageAsset: 'xzibit_vimy', imageVariant: 'standard', questionType: 'image_identification', category: 'classic_memes', era: 'late_2000s', subjectKey: 'xzibit_vimy', options: ['Xzibit / Yo Dawg', 'Advice Dog', 'Epic Handshake', 'Trade Offer'], correctAnswer: 0, explanation: 'This is the recognizable Xzibit “Yo Dawg” recursive-copy image macro.', memeContext: 'The format became shorthand for putting one version of a thing inside another.', difficulty: 'medium',
  }),
  verifiedMemeQuestion({
    id: 'meme_visual_morgan_true_01', question: 'Which reaction image says the take is undeniably true?', subtitle: 'VISUAL MODE / REACTION CHECK', imageAsset: 'morgan_freeman_true', imageVariant: 'standard', questionType: 'image_identification', category: 'reaction_memes', era: '2010s', subjectKey: 'morgan_freeman_true', options: ['Morgan Freeman True', 'The Rock Eyebrow', 'Leonardo Cheers', 'Hide the Pain Harold'], correctAnswer: 0, explanation: 'Morgan Freeman with the huge “True…” caption is the recognizable reaction image.', memeContext: 'It is used as a deadpan stamp of approval for a statement or hot take.', difficulty: 'medium',
  }),
  verifiedMemeQuestion({
    id: 'meme_visual_pizza_cat_01', question: 'Which internet animal visual is shown?', subtitle: 'VISUAL MODE / IDENTIFY THE ANIMAL', imageAsset: 'pizza_cat', imageVariant: 'standard', questionType: 'image_identification', category: 'viral_internet', era: 'classic', subjectKey: 'pizza_cat', options: ['Pizza Cat', 'Ceiling Cat', 'Business Cat', 'Longcat'], correctAnswer: 0, explanation: 'The recognizable Pizza Cat image is the public-domain U.S. Air Force photo used as the meme.', memeContext: 'Animal macros turned ordinary pet photos into a shared early-internet language.', difficulty: 'easy',
  }),
  verifiedMemeQuestion({
    id: 'meme_visual_meerkat_01', question: 'Which animal meme is this reaction image?', subtitle: 'VISUAL MODE / IDENTIFY THE ANIMAL', imageAsset: 'meerkat_meme', imageVariant: 'standard', questionType: 'image_identification', category: 'viral_internet', era: '2010s', subjectKey: 'meerkat_meme', options: ['Meerkat Meme', 'Dramatic Chipmunk', 'Surprised Pikachu', 'Awkward Seal'], correctAnswer: 0, explanation: 'The upright meerkat is the subject of the documented Meerkat meme image.', memeContext: 'The pose reads like a tiny animal suddenly realizing it has been perceived.', difficulty: 'easy',
  }),
  verifiedMemeQuestion({
    id: 'meme_visual_vim_01', question: 'Which legendary developer question is shown?', subtitle: 'VISUAL MODE / INTERNET HISTORY', imageAsset: 'how_do_i_exit_vim', imageVariant: 'standard', questionType: 'image_identification', category: 'internet_tech', era: '2010s', subjectKey: 'how_do_i_exit_vim', options: ['How do I exit Vim?', 'Why is my CSS broken?', 'Where is the any key?', 'Is this a bug?'], correctAnswer: 0, explanation: 'This is the famous Stack Overflow screenshot titled How do I exit Vim?', memeContext: 'The question became a durable programmer meme because Vim’s modal editing traps beginners.', difficulty: 'medium',
  }),
  verifiedMemeQuestion({
    id: 'meme_visual_cheh_01', question: 'Which reaction meme is this multilingual sports-interview edit?', subtitle: 'VISUAL MODE / IDENTIFY THE REACTION', imageAsset: 'i_hear_cheh', imageVariant: 'standard', questionType: 'image_identification', category: 'reaction_memes', era: '2026', subjectKey: 'i_hear_cheh', options: ['I Hear Cheh in My Earpiece', 'Absolute Cinema', 'We Are So Back', 'It Is What It Is'], correctAnswer: 0, explanation: 'Nelson Monfort and the earpiece caption identify the I Hear Cheh meme.', memeContext: 'The edit turns a live sports-interview pose into a reaction for someone else’s misfortune.', difficulty: 'hard',
  }),
  verifiedMemeQuestion({
    id: 'meme_visual_fresh_prince_01', question: 'Which internet-culture artwork is shown?', subtitle: 'VISUAL MODE / IDENTIFY THE IMAGE', imageAsset: 'fresh_prince_of_memes', imageVariant: 'standard', questionType: 'image_identification', category: 'viral_internet', era: '2010s', subjectKey: 'fresh_prince_of_memes', options: ['Fresh Prince of Memes', 'The Meme Dealer', 'Internet Historian', 'Meme Economy'], correctAnswer: 0, explanation: 'The documented CC0 artwork is titled REPLAYING the game Fresh Prince of Memes.', memeContext: 'It is a playful piece of internet-culture art rather than a generic computer illustration.', difficulty: 'hard',
  }),
  verifiedMemeQuestion({
    id: 'meme_visual_urubu_01', question: 'Which documented internet meme image is this?', subtitle: 'VISUAL MODE / IDENTIFY THE IMAGE', imageAsset: 'urubu_pix', imageVariant: 'standard', questionType: 'image_identification', category: 'viral_internet', era: '2010s', subjectKey: 'urubu_pix', options: ['UrubuPix', 'Brazilian Carreta', 'Dancing Bird', 'Viral Vulture'], correctAnswer: 0, explanation: 'This is the documented UrubuPix meme image from Wikimedia Commons.', memeContext: 'Internet culture travels through remixable images that are often more recognizable by title than by literal meaning.', difficulty: 'hard',
  }),
  verifiedMemeQuestion({
    id: 'meme_visual_dystopia_meal_01', question: 'Which absurd viral image is shown?', subtitle: 'VISUAL MODE / IDENTIFY THE IMAGE', imageAsset: 'dystopia_meal', imageVariant: 'standard', questionType: 'image_identification', category: 'viral_internet', era: 'early_2020s', subjectKey: 'dystopia_meal', options: ['Dystopia Meal', 'Girl Dinner', 'Sad Beige Meal', 'Infinite Buffet'], correctAnswer: 0, explanation: 'The tray of strange gelatinous food is the documented Dystopia meal meme image.', memeContext: 'The visual plays on the internet’s habit of turning uncanny meals into commentary.', difficulty: 'hard',
  }),
  verifiedMemeQuestion({
    id: 'meme_visual_apollo_dodgeball_01', question: 'Which edited mythic reaction image is this?', subtitle: 'VISUAL MODE / IDENTIFY THE EDIT', imageAsset: 'apollo_dodgeball', imageVariant: 'standard', questionType: 'image_identification', category: 'viral_internet', era: 'early_2020s', subjectKey: 'apollo_dodgeball', options: ['Apollo with Dodgeball', 'Greek Chad', 'Red Ball Reaction', 'Statue Mode'], correctAnswer: 0, explanation: 'The dodgeball held by the glowing-eyed Apollo statue is the documented Apollo with dodgeball edit.', memeContext: 'It is a real user-made meme edit, not an AI recreation of a famous character.', difficulty: 'hard',
  }),
  verifiedMemeQuestion({
    id: 'meme_visual_battery_tips_01', question: 'Which vintage internet-share visual is this?', subtitle: 'VISUAL MODE / OLD WEB CULTURE', imageAsset: 'battery_tips_1950s', imageVariant: 'standard', questionType: 'image_identification', category: 'digital_nostalgia', era: 'classic', subjectKey: 'battery_tips_1950s', options: ['1950s Battery Tips', 'Old Mac Hack', 'Dial-Up Survival Guide', 'Vintage Life Pro Tip'], correctAnswer: 0, explanation: 'The bizarre battery-burning advice comes from the documented 1950s battery tips scan.', memeContext: 'Odd vintage scans became internet-share material long before social feeds had algorithmic recommendations.', difficulty: 'hard',
  }),
  verifiedMemeQuestion({
    id: 'meme_visual_sorry_cat_01', question: 'Which captioned reaction cat is shown?', subtitle: 'VISUAL MODE / IDENTIFY THE IMAGE', imageAsset: 'sorry_not_responding_cat', imageVariant: 'standard', questionType: 'image_identification', category: 'reaction_memes', era: '2010s', subjectKey: 'sorry_not_responding_cat', options: ['Sorry for Not Responding Cat', 'Crying Cat', 'Ghosted Cat', 'Sad Hamster'], correctAnswer: 0, explanation: 'The long apology caption over the sad cat identifies this image macro.', memeContext: 'The joke is an exaggerated, melodramatic apology for a normal late reply.', difficulty: 'medium',
  }),
  verifiedMemeQuestion({
    id: 'meme_visual_wutup_cat_01', question: 'Which short captioned cat macro is shown?', subtitle: 'VISUAL MODE / IDENTIFY THE IMAGE', imageAsset: 'wutup_cat', imageVariant: 'standard', questionType: 'image_identification', category: 'reaction_memes', era: '2010s', subjectKey: 'wutup_cat', options: ['Wutup Cat', 'Ceiling Cat', 'Judging Cat', 'Tired Cat'], correctAnswer: 0, explanation: 'The lounging cat paired with the short “wutup?” caption is the Wutup cat macro.', memeContext: 'Tiny low-context captions are part of the charm of old animal image macros.', difficulty: 'medium',
  }),
  verifiedMemeQuestion({
    id: 'meme_visual_soviet_01', question: 'Which classic caption structure is this?', subtitle: 'VISUAL MODE / IDENTIFY THE TEMPLATE', imageAsset: 'in_soviet_russia', imageVariant: 'standard', questionType: 'image_identification', category: 'classic_memes', era: '2000s', subjectKey: 'in_soviet_russia', options: ['In Soviet Russia', 'Russian Reversal', 'Goat in a Car', 'Cold War Cat'], correctAnswer: 0, explanation: 'The all-caps reversal caption identifies the In Soviet Russia image-macro format.', memeContext: 'The template flips the relationship between a person and an action for an intentionally silly reversal.', difficulty: 'medium',
  }),
  verifiedMemeQuestion({
    id: 'meme_visual_lolbadger_01', question: 'Which old-school animal macro is this?', subtitle: 'VISUAL MODE / IMAGE MACRO', imageAsset: 'lolbadger', imageVariant: 'standard', questionType: 'image_identification', category: 'viral_internet', era: '2000s', subjectKey: 'lolbadger', options: ['Lolbadger', 'Badger Badger Badger', 'Please Dont Badger', 'Pocket Badger'], correctAnswer: 0, explanation: 'The badger with the captioned plea is the documented Lolbadger macro.', memeContext: 'Lolcat-era image macros used intentionally broken grammar as a recognizable style.', difficulty: 'hard',
  }),
  verifiedMemeQuestion({
    id: 'meme_visual_lolchicken_01', question: 'Which animal macro is shown?', subtitle: 'VISUAL MODE / IMAGE MACRO', imageAsset: 'lolchicken', imageVariant: 'standard', questionType: 'image_identification', category: 'viral_internet', era: '2000s', subjectKey: 'lolchicken', options: ['Lolchicken', 'Chicken Jockey', 'Poltry Posting', 'Angry Bird'], correctAnswer: 0, explanation: 'The documented lolchicken image belongs to the old animal-caption macro family.', memeContext: 'The format is an early internet ancestor of today’s reaction-image posts.', difficulty: 'hard',
  }),
  verifiedMemeQuestion({
    id: 'meme_visual_lolfrog_01', question: 'Which old image-macro animal is shown?', subtitle: 'VISUAL MODE / IMAGE MACRO', imageAsset: 'lolfrog', imageVariant: 'standard', questionType: 'image_identification', category: 'viral_internet', era: '2000s', subjectKey: 'lolfrog', options: ['Lolfrog', 'Froggo', 'Pepe', 'Rain Frog'], correctAnswer: 0, explanation: 'The captioned frog in the documented Commons image is Lolfrog.', memeContext: 'This is an archival animal macro, not a generated lookalike of a later copyrighted frog character.', difficulty: 'hard',
  }),
  verifiedMemeQuestion({
    id: 'meme_visual_lolfrettchen_01', question: 'Which tiny animal macro is shown?', subtitle: 'VISUAL MODE / IMAGE MACRO', imageAsset: 'lolfrettchen', imageVariant: 'standard', questionType: 'image_identification', category: 'viral_internet', era: '2000s', subjectKey: 'lolfrettchen', options: ['Lolfrettchen', 'Ferret Posting', 'Long Ferret', 'Blanket Weasel'], correctAnswer: 0, explanation: 'The ferret and “long words botherate me” caption identify Lolfrettchen.', memeContext: 'Its deliberately awkward wording is classic old image-macro humor.', difficulty: 'hard',
  }),
  verifiedMemeQuestion({
    id: 'meme_visual_bouquetin_01', question: 'Which animal meme is shown?', subtitle: 'VISUAL MODE / IMAGE MACRO', imageAsset: 'lol_bouquetin', imageVariant: 'standard', questionType: 'image_identification', category: 'viral_internet', era: '2000s', subjectKey: 'lol_bouquetin', options: ['LOL-bouquetin', 'Goat Simulator', 'Wall Goat', 'Mountain Meme'], correctAnswer: 0, explanation: 'The goat macro is the documented LOL-bouquetin image.', memeContext: 'The captioned animal format predates many modern reaction-image conventions.', difficulty: 'hard',
  }),
  verifiedMemeQuestion({
    id: 'meme_visual_bunny_waffle_01', question: 'Which classic absurd animal image is shown?', subtitle: 'VISUAL MODE / IDENTIFY THE IMAGE', imageAsset: 'bunny_waffle', imageVariant: 'standard', questionType: 'image_identification', category: 'viral_internet', era: '2000s', subjectKey: 'bunny_waffle', options: ['Bunny with a Waffle', 'Pancake Rabbit', 'Waffle House Bunny', 'Breakfast Oolong'], correctAnswer: 0, explanation: 'The waffle-on-head rabbit is the documented bunny image macro based on Oolong.', memeContext: 'Oolong’s head-balancing photos became a foundational absurd-animal internet reference.', difficulty: 'medium',
  }),
  verifiedMemeQuestion({
    id: 'meme_visual_dog_meme_01', question: 'Which captioned animal image is shown?', subtitle: 'VISUAL MODE / IDENTIFY THE IMAGE', imageAsset: 'dog_meme', imageVariant: 'standard', questionType: 'image_identification', category: 'classic_memes', era: '2010s', subjectKey: 'dog_meme', options: ['Dog Meme', 'Doge', 'Walter Dog', 'Bad Pun Dog'], correctAnswer: 0, explanation: 'This is the documented captioned dog meme image, distinct from the Doge asset.', memeContext: 'Image Mode keeps similar-looking animals separate so the answer is the actual bundled subject.', difficulty: 'medium',
  }),
  verifiedMemeQuestion({
    id: 'meme_visual_captioned_cat_01', question: 'Which classic internet image macro is shown?', subtitle: 'VISUAL MODE / IDENTIFY THE IMAGE', imageAsset: 'captioned_cat', imageVariant: 'standard', questionType: 'image_identification', category: 'reaction_memes', era: 'classic', subjectKey: 'captioned_cat', options: ['Captioned Cat Image', 'Lolcat Collage', 'Keyboard Cat', 'Ceiling Cat'], correctAnswer: 0, explanation: 'The bundled CC0 image is a real captioned-cat macro from the early image-board era.', memeContext: 'Captioned cats are one of the foundational visual languages of internet culture.', difficulty: 'easy',
  }),
  verifiedMemeQuestion({
    id: 'meme_visual_chaplin_01', question: 'Which public-domain film still became a distracted-reaction visual?', subtitle: 'VISUAL MODE / IDENTIFY THE STILL', imageAsset: 'distracted_charlie_chaplin', imageVariant: 'standard', questionType: 'image_identification', category: 'classic_memes', era: 'classic', subjectKey: 'distracted_charlie_chaplin', options: ['Distracted Charlie Chaplin', 'Silent Film Side-Eye', 'The Tramp Looks Away', 'Vintage Distracted Boyfriend'], correctAnswer: 0, explanation: 'The frame is a public-domain still from Charlie Chaplin’s Pay Day (1922).', memeContext: 'Older film stills often become reaction images after being re-captioned by later internet communities.', difficulty: 'hard',
  }),
  verifiedMemeQuestion({
    id: 'meme_visual_clooney_01', question: 'Which celebrity side-eye reaction is shown?', subtitle: 'VISUAL MODE / IDENTIFY THE REACTION', imageAsset: 'george_clooney_side_eye', imageVariant: 'standard', questionType: 'image_identification', category: 'reaction_memes', era: '2010s', subjectKey: 'george_clooney_side_eye', options: ['George Clooney Side-Eye', 'Brad Pitt Glance', 'Golden Globes Stare', 'The Rock Side-Eye'], correctAnswer: 0, explanation: 'The cropped Golden Globes event photo is the documented George Clooney side-eye reaction image.', memeContext: 'A single glance can become a reusable reaction once the internet gives it a name.', difficulty: 'medium',
  }),
  verifiedMemeQuestion({
    id: 'meme_visual_vice_virtue_01', question: 'Which distracted-boyfriend-adjacent meme edit is shown?', subtitle: 'VISUAL MODE / IDENTIFY THE EDIT', imageAsset: 'man_between_vice_virtue', imageVariant: 'standard', questionType: 'image_identification', category: 'classic_memes', era: '2010s', subjectKey: 'man_between_vice_virtue', options: ['The Man between Vice and Virtue', 'Distracted Boyfriend', 'Tragedy vs Comedy', 'Hercules at the Crossroads'], correctAnswer: 0, explanation: 'The CC0 edit is titled The Man between Vice and Virtue and directly references the distracted-boyfriend format.', memeContext: 'It provides a licensed alternative to bundling the original commercially controlled stock photo.', difficulty: 'hard',
  }),
  verifiedMemeQuestion({
    id: 'meme_visual_touch_grass_01', question: 'Which internet phrase does this literal visual represent?', subtitle: 'VISUAL MODE / SLANG VISUAL', imageAsset: 'touch_grass', imageVariant: 'standard', questionType: 'image_identification', category: 'internet_slang', era: 'early_2020s', subjectKey: 'touch_grass', options: ['Touch Grass', 'Go Outside', 'Grass Posting', 'Nature Maxxing'], correctAnswer: 0, explanation: 'The hand touching grass is a real source-documented visual for the phrase Touch Grass.', memeContext: 'Online, “touch grass” is a playful reminder to step away from the feed and reconnect with real life.', difficulty: 'easy',
  }),
];
