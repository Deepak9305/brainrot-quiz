import { TEXT_VISUAL_SUBJECTS } from './textVisualQuestions';

export type VisualCandidateStatus = 'verified' | 'rejected' | 'needs_review' | 'added';

export interface VisualCandidate {
  id: string;
  name: string;
  category: string;
  era: string;
  candidateSource: string;
  originalSource: string;
  creator: string;
  license: string;
  licenseUrl: string;
  commercialUse: boolean | 'unknown';
  attributionRequired: boolean;
  status: VisualCandidateStatus;
  rejectionReason?: string;
  mediaKey?: string;
}

const discoverySource = 'Wikimedia Commons + Openverse discovery audit';
const emoticonSource = 'https://en.wikipedia.org/wiki/Emoticon';
const webHistorySource = 'https://en.wikipedia.org/wiki/History_of_the_World_Wide_Web';

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

function rejected(name: string, category: string, era: string, rejectionReason = 'No verified commercially reusable original source was found during this audit.'): VisualCandidate {
  return {
    id: `candidate_${slugify(name)}`,
    name,
    category,
    era,
    candidateSource: discoverySource,
    originalSource: '',
    creator: 'unknown / rights not documented',
    license: 'unverified',
    licenseUrl: '',
    commercialUse: 'unknown',
    attributionRequired: false,
    status: 'rejected',
    rejectionReason,
  };
}

function addedImage(name: string, category: string, era: string, mediaKey: string, originalSource: string, creator: string, license: string, licenseUrl: string, attributionRequired: boolean): VisualCandidate {
  return {
    id: `candidate_${slugify(name)}`,
    name,
    category,
    era,
    candidateSource: 'Bundled local media audit',
    originalSource,
    creator,
    license,
    licenseUrl,
    commercialUse: true,
    attributionRequired,
    status: 'added',
    mediaKey,
  };
}

const addedImageCandidates: VisualCandidate[] = [
  addedImage('Doge', 'classic_memes', 'classic', 'doge_meme_example', 'https://commons.wikimedia.org/wiki/File:Doge_meme_example.jpg', 'likeaduck', 'CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0/', true),
  addedImage('Grumpy Cat', 'reaction_memes', 'early_2010s', 'grumpy_cat_classic', 'https://commons.wikimedia.org/wiki/File:Grumpy_Cat_by_Gage_Skidmore.jpg', 'Gage Skidmore', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0/', true),
  addedImage('Overly Attached Girlfriend', 'advice_animals', 'early_2010s', 'overly_attached_girlfriend', 'https://commons.wikimedia.org/wiki/File:Laina_Morris_by_Gage_Skidmore.jpg', 'Gage Skidmore', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0/', true),
  addedImage('Scumbag Steve', 'advice_animals', 'early_2010s', 'scumbag_steve', 'https://commons.wikimedia.org/wiki/File:Scumbag_Steve_at_South_by_Southwest_2013_(8597138551).jpg', 'David Berkowitz', 'CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0/', true),
  addedImage('Hide the Pain Harold', 'reaction_memes', '2010s', 'hide_the_pain_harold', 'https://commons.wikimedia.org/wiki/File:Arat%C3%B3_Andr%C3%A1s.jpg', 'Eifert János', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', true),
  addedImage('O RLY?', 'classic_memes', '2000s', 'o_rly', 'https://commons.wikimedia.org/wiki/File:O_RLY.jpg', 'SPUI', 'Public domain', 'https://commons.wikimedia.org/wiki/File:O_RLY.jpg', false),
  addedImage('This Is Fine', 'classic_memes', '2010s', 'this_is_fine', 'https://commons.wikimedia.org/wiki/File:%22THIS_IS_FINE%22_(32502717715).jpg', 'James McNellis', 'CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0/', true),
  addedImage('Woman Yelling at Cat', 'classic_memes', 'late_2010s', 'woman_yelling_at_cat', 'https://commons.wikimedia.org/wiki/File:Taylor_Armstrong_headshot.jpg', 'Eva Rinaldi', 'CC BY-SA 2.0', 'https://creativecommons.org/licenses/by-sa/2.0/', true),
  addedImage('Your Argument Is Invalid', 'classic_memes', 'early_2010s', 'your_argument_is_invalid', 'https://commons.wikimedia.org/wiki/File:Your_argument_is_invalid.jpg', 'The wub; original photo Oxford shark', 'Public domain', 'https://commons.wikimedia.org/wiki/File:Your_argument_is_invalid.jpg', false),
  addedImage('Xzibit / Yo Dawg', 'classic_memes', 'late_2000s', 'xzibit_vimy', 'https://commons.wikimedia.org/wiki/File:Xzibit_Vimy_meme.png', 'Stefan Brending', 'CC BY-SA 3.0 Germany', 'https://creativecommons.org/licenses/by-sa/3.0/de/deed.en', true),
  addedImage('Morgan Freeman True', 'reaction_memes', '2010s', 'morgan_freeman_true', 'https://commons.wikimedia.org/wiki/File:Morgan_Freeman_%22true%22_meme.jpg', 'Star Manatee; original NASA portrait', 'CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0/', true),
  addedImage('Pizza Cat', 'viral_internet', 'classic', 'pizza_cat', 'https://commons.wikimedia.org/wiki/File:PizzaCat.jpg', 'U.S. Air Force', 'Public domain', 'https://commons.wikimedia.org/wiki/File:PizzaCat.jpg', false),
  addedImage('Meerkat Meme', 'viral_internet', '2010s', 'meerkat_meme', 'https://commons.wikimedia.org/wiki/File:Meerkat_meme.jpg', 'Callum Hand', 'CC BY 4.0', 'https://creativecommons.org/licenses/by/4.0/', true),
  addedImage('How Do I Exit Vim', 'internet_tech', '2010s', 'how_do_i_exit_vim', 'https://commons.wikimedia.org/wiki/File:How_do_I_exit_Vim_Stack_Overflow.png', 'jclancy', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0/', true),
  addedImage('I Hear Cheh in My Earpiece', 'reaction_memes', '2026', 'i_hear_cheh', 'https://commons.wikimedia.org/wiki/File:I_hear_Cheh_in_my_oreillette.png', 'Yann Caradec', 'CC BY-SA 2.0', 'https://creativecommons.org/licenses/by-sa/2.0/', true),
  addedImage('Fresh Prince of Memes', 'viral_internet', '2010s', 'fresh_prince_of_memes', 'https://commons.wikimedia.org/wiki/File:REPLAYING_the_game_Fresh_Prince_of_Memes.jpg', 'Nicky Case', 'CC0', 'https://creativecommons.org/publicdomain/zero/1.0/', false),
  addedImage('UrubuPix', 'viral_internet', '2010s', 'urubu_pix', 'https://commons.wikimedia.org/wiki/File:UrubuPix.jpg', 'Cleyton M. S. de Almeida', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0/', true),
  addedImage('Dystopia Meal', 'viral_internet', '2020s', 'dystopia_meal', 'https://commons.wikimedia.org/wiki/File:Dystopia_meal.jpg', 'Misei sen', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', true),
  addedImage('Apollo with Dodgeball', 'viral_internet', '2020s', 'apollo_dodgeball', 'https://commons.wikimedia.org/wiki/File:Apollo_with_dodgeball.png', 'ArtemisiaGentileschiFan', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', true),
  addedImage('1950s Battery Tips', 'digital_nostalgia', 'classic', 'battery_tips_1950s', 'https://commons.wikimedia.org/wiki/File:1950s-battery-tips.jpg', 'Unknown; public-domain periodical scan', 'Public domain', 'https://commons.wikimedia.org/wiki/File:1950s-battery-tips.jpg', false),
  addedImage('Sorry for Not Responding Cat', 'reaction_memes', '2010s', 'sorry_not_responding_cat', 'https://commons.wikimedia.org/wiki/File:Sorry_for_not_responding_text_on_picture_of_sad_cat.png', 'Yitzilitt', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', true),
  addedImage('Wutup Cat', 'reaction_memes', '2010s', 'wutup_cat', 'https://commons.wikimedia.org/wiki/File:Wutupmecat.jpg', 'Ryssian', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', true),
  addedImage('In Soviet Russia', 'classic_memes', '2000s', 'in_soviet_russia', 'https://commons.wikimedia.org/wiki/File:In_Soviet_Russia_image_macro_example.jpg', 'Alexis Jazz; derived from Goat in a car', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0/', true),
  addedImage('Lolbadger', 'viral_internet', '2000s', 'lolbadger', 'https://commons.wikimedia.org/wiki/File:Lolbadger.jpg', 'AmericanBadger; derivative author on Commons', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0/', true),
  addedImage('Lolchicken', 'viral_internet', '2000s', 'lolchicken', 'https://commons.wikimedia.org/wiki/File:Lolchicken.jpg', 'Commons image-macro contributor', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0/', true),
  addedImage('Lolfrog', 'viral_internet', '2000s', 'lolfrog', 'https://commons.wikimedia.org/wiki/File:Lolfrog.png', 'Commons image-macro contributor', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0/', true),
  addedImage('Lolfrettchen', 'viral_internet', '2000s', 'lolfrettchen', 'https://commons.wikimedia.org/wiki/File:Lolfrettchen.jpg', 'Commons image-macro contributor', 'CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0/', true),
  addedImage('LOL-bouquetin', 'viral_internet', '2000s', 'lol_bouquetin', 'https://commons.wikimedia.org/wiki/File:LOL-bouquetin.jpg', 'Rama', 'CC BY-SA 2.0 FR', 'https://creativecommons.org/licenses/by-sa/2.0/fr/deed.en', true),
  addedImage('Bunny with a Waffle', 'viral_internet', '2000s', 'bunny_waffle', 'https://commons.wikimedia.org/wiki/File:Heres_a_bunny_with_waffle.png', 'Yuval Y; original Oolong photo by Hironori Akutagawa', 'CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0/', true),
  addedImage('Dog Meme', 'classic_memes', '2010s', 'dog_meme', 'https://commons.wikimedia.org/wiki/File:Dog_meme.jpg', 'Liannadavis; modified by DigiMedCult', 'CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/', true),
  addedImage('Captioned Cat Image', 'reaction_memes', 'classic', 'captioned_cat', 'https://commons.wikimedia.org/wiki/File:Captioned_Cat_Image.jpg', 'Miscellaneous Commons contributor', 'CC0', 'https://creativecommons.org/publicdomain/zero/1.0/', false),
  addedImage('Distracted Charlie Chaplin', 'classic_memes', 'classic', 'distracted_charlie_chaplin', 'https://commons.wikimedia.org/wiki/File:Distracted_Charlie_Chaplin_in_Pay_Day_(1922).jpeg', 'Charlie Chaplin film still; public domain', 'Public domain', 'https://commons.wikimedia.org/wiki/File:Distracted_Charlie_Chaplin_in_Pay_Day_(1922).jpeg', false),
  addedImage('George Clooney Side-Eye', 'reaction_memes', '2010s', 'george_clooney_side_eye', 'https://commons.wikimedia.org/wiki/File:George_Clooney_side-eye_(cropped).jpg', 'jdeeringdavis', 'CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0/', true),
  addedImage('The Man between Vice and Virtue', 'classic_memes', '2010s', 'man_between_vice_virtue', 'https://commons.wikimedia.org/wiki/File:The_Man_between_Vice_and_Virtue.jpg', 'FallingGravity', 'CC0', 'https://creativecommons.org/publicdomain/zero/1.0/', false),
  addedImage('Touch Grass', 'internet_slang', '2020s', 'touch_grass', 'https://commons.wikimedia.org/wiki/File:Touch_Grass.jpg', 'MiracleMiles', 'CC BY 4.0', 'https://creativecommons.org/licenses/by/4.0/', true),
];

const textCandidates: VisualCandidate[] = TEXT_VISUAL_SUBJECTS.map((subject) => ({
  id: `candidate_${subject.subjectKey}`,
  name: subject.name,
  category: subject.category,
  era: subject.era,
  candidateSource: 'App-rendered text-native visual; no binary asset bundled',
  originalSource: subject.era === 'early_web' || subject.category === 'digital_nostalgia' || subject.category === 'internet_tech' ? webHistorySource : emoticonSource,
  creator: 'internet-native community expression',
  license: 'text-native expression / no external image asset',
  licenseUrl: subject.era === 'early_web' || subject.category === 'digital_nostalgia' || subject.category === 'internet_tech' ? webHistorySource : emoticonSource,
  commercialUse: true,
  attributionRequired: false,
  status: 'added' as const,
}));

const rejectionReasons: Record<string, string> = {
  'Disaster Girl': 'The exact original photograph is not documented here for commercial redistribution; available Commons hit was explicitly AI-generated and was excluded.',
  'Nyan Cat': 'The original viral artwork is copyright-sensitive and the Commons GIF candidate was deleted/flagged; licensed original media was not verified.',
  'Keyboard Cat': 'Search results were generic cats on keyboards or fan art, not the authentic Keyboard Cat source visual.',
  'Trollface': 'The available local file was a newer recreation; no original Trollface artwork with clear commercial reuse terms was verified.',
  'Dramatic Chipmunk': 'Found results were generic chipmunk photographs or reposts, not a verified original viral-video frame.',
  'Dancing Baby': 'Search results were generic baby photographs; the original 3D animation is not documented for commercial bundling.',
  'Distracted Boyfriend': 'The original stock photograph is commercially controlled; no safe commercial bundle license was verified.',
  'Surprised Pikachu': 'Copyrighted character artwork with no commercial redistribution license verified.',
  'Mocking SpongeBob': 'Copyrighted television character screenshot/artwork with no commercial redistribution license verified.',
  'Drake Hotline Bling': 'Copyrighted music-video frame and character likeness; no commercial redistribution license verified.',
  'This Is Fine AI imitation': 'AI-generated imitation explicitly excluded by the product rule.',
  'Generic webcam': 'Not a recognizable internet-culture subject; generic object filler is prohibited.',
  'Generic CRT computer': 'Not a recognizable internet-culture subject; generic nostalgia object is prohibited.',
  'Generic battle royale art': 'Not an authentic recognizable meme or licensed game visual.',
};

const rejectedGroups: Array<[string, string, string, string[]]> = [
  ['rage_comics', 'classic', 'Rage Comics', ['Trollface', 'Forever Alone', 'Me Gusta', 'Y U NO', 'Rage Guy', 'Okay Guy', 'Poker Face Rage Comic', 'Challenge Accepted', 'LOL Guy', 'Derp', 'Derpina', 'Cereal Guy', 'Are You Serious Face', 'Close Enough', 'Mother of God', 'FUUUU', 'Everything Went Better Than Expected', 'Are You Kidding Me', 'Rage Comic Genius', 'Like a Boss', 'Problem?', 'Not Bad', 'You Do Not Say', 'No Guys Please', 'We Need to Talk']],
  ['advice_animals', 'early_2010s', 'Advice Animals', ['Success Kid', 'Bad Luck Brian', 'Scumbag Steve', 'Philosoraptor', 'Socially Awkward Penguin', 'Insanity Wolf', 'Courage Wolf', 'Advice Dog', 'Good Guy Greg', 'College Freshman', 'First World Problems', 'Condescending Wonka', 'Business Cat', 'Confession Bear', 'Actual Advice Mallard', 'Paranoid Parrot', 'Foul Bachelor Frog', 'High Expectations Asian Father', 'Unhelpful High School Teacher', 'Overly Attached Girlfriend', 'Futurama Fry Advice', 'Sheltering Suburban Mom', 'Anti-Joke Chicken', 'Dating Site Murderer', 'Successful Black Man']],
  ['classic_memes', '2000s', 'Classic Image Memes', ['Disaster Girl', 'Distracted Boyfriend', 'Two Buttons', 'Expanding Brain', 'Drake Hotline Bling', 'Is This a Pigeon?', 'Surprised Pikachu', 'Change My Mind', 'Ancient Aliens', 'Roll Safe', 'Mocking SpongeBob', 'One Does Not Simply', 'Futurama Fry', 'Leonardo DiCaprio Cheers', 'Waiting Skeleton', 'Confused Math Lady', 'Side Eye Chloe', 'Blinking White Guy', 'Arthur Fist', 'Salt Bae', 'Left Exit 12 Off Ramp', 'Running Away Balloon', 'UNO Draw 25', "Gru's Plan", 'Boardroom Suggestion', 'Bike Fall', 'Epic Handshake', 'Trade Offer', 'Bernie I Am Once Again', 'Woman Yelling at Cat', 'Always Has Been', 'Gru Then', 'Is This Loss?', 'Galaxy Brain', 'Surreal Dudes', 'They Do Be Like That', 'Monkey Puppet', 'Confused Black Girl', 'Awkward Seal', 'Obama Not Bad', 'Bad Pun Dog', 'Blank Nut Button', 'Y U No Original', 'Ancient Internet Aliens']],
  ['reaction_memes', '2010s', 'Reaction Images', ['Facepalm', 'Confused Reaction', 'Laughing Reaction', 'Crying Reaction', 'Side Eye', 'Awkward Smile', 'Shocked Reaction', 'Thinking Reaction', 'Celebration Reaction', 'Disappointment Reaction', 'Rage Reaction', 'Approval Reaction', 'Pikachu Shock', 'Michael Scott Reaction', 'Kermit Sipping Tea', 'Confused Nick Young', 'John Cena Confused', 'Blinking Guy Reaction', 'Vince McMahon Reaction']],
  ['viral_internet', '2000s', 'Viral Internet Characters', ['Dramatic Chipmunk', 'Badger Badger Badger', 'Numa Numa', 'Charlie the Unicorn', 'Annoying Orange', 'Crazy Frog', 'Peanut Butter Jelly Time', 'Hampster Dance', 'Salad Fingers', 'Homestar Runner', 'Strong Bad', 'Llamas with Hats', 'Potato Jesus', 'Dancing Baby', 'Mah Na Mah Na', 'Chocolate Rain', 'Double Rainbow', 'David After Dentist', 'Evolution of Dance', 'Charlie Bit My Finger', 'Rebecca Black Friday', 'Gangnam Style', 'Harlem Shake', 'Ice Bucket Challenge', 'Bottle Flip', 'Mannequin Challenge', 'Planking', 'Dab', 'Floss', 'Rickroll', 'Keyboard Cat', 'Nyan Cat', 'Viral Vine Loop', 'Shoes Song', 'Leave Britney Alone', 'Star Wars Kid', 'Leeroy Jenkins', 'Ultimate Showdown', 'Dramatic Look Groundhog', 'Trololo', 'Friday Song', 'Gonna Tell My Kids', 'Epic Sax Guy', 'Guy Fieri Meme']],
  ['digital_nostalgia', 'early_web', 'Old Web Culture', ['GeoCities Homepage', 'AIM Buddy Icon', 'MSN Messenger Winks', 'MySpace Profile Skin', 'Newgrounds Logo', 'Flash Player Badge', 'Winamp Skin', 'Netscape Logo', 'Internet Explorer E', 'Dial-up Handshake', 'Old Browser Error', 'Forum Avatar', 'Web Counter', 'Under Construction GIF', 'ASCII Art Banner', 'Old Emoticon Pack', 'Dancing Baby GIF', 'Hamster Dance GIF', 'All Your Base', 'Web Ring Badge', 'Guestbook Button', 'Best Viewed 800x600', 'Animated Email Sign', 'Free Email Button', 'Download Now Button', 'Hit Counter', 'Blink Tag', 'Marquee Text', 'Geocities Star Background', 'Yahoo Chat Room', 'Internet Cafe Sign', 'Guestbook GIF', 'Old Forum Signature', 'Webmaster Award Badge', 'Powered by Geocities', 'Netscape Now Button', 'Modem Noise Visualizer', 'Portal Splash Page', 'Browser Toolbar Meme']],
  ['gaming_culture', '2010s', 'Gaming Meme Culture', ['Minecraft Creeper', 'Herobrine', 'Roblox Noob', 'Oof', 'Among Us', 'Sus', 'Emergency Meeting', 'Fortnite Default Dance', 'Victory Royale', "Skyrim You're Finally Awake", 'Press F', 'Dark Souls You Died', 'Portal The Cake Is a Lie', 'Leeroy Jenkins', 'Wombo Combo', 'Do a Barrel Roll', 'All Your Base', 'GTA San Andreas Meme', 'Team Fortress 2 Heavy', 'Garrys Mod Prop', 'Loss Gaming Meme', 'Minecraft Steve', 'Creeper Aw Man', 'Roblox Bacon Hair', 'Fortnite Peely', 'Call of Duty No Russian', 'The Game Awards Reaction', 'Among Us Emergency Button', 'Speedrun Timer', 'Nintendo Wii Mii', 'Konami Code', 'Mortal Kombat Finish Him', 'Snake Game Over', 'Club Penguin Dance', 'RuneScape Party Hat', 'World of Warcraft Leeroy', 'League of Legends Teemo', 'Portal Companion Cube', 'Skyrim Arrow Knee', 'Gamer Girl Bath Water']],
  ['modern_memes', '2020s', 'Modern Internet Culture', ['NPC Livestream', 'Gigachad', 'Wojak', 'Chad', 'Soyjak', 'Doomer', 'Bloomer', 'NPC Wojak', 'Chill Guy', 'Pop Cat', 'Bongo Cat', 'Cheems', 'Bonk', 'Walter Dog', 'Swole Doge', 'Crying Cheems', 'Galaxy Brain', 'Trade Offer', 'Wholesome 100', 'Big Chungus', 'Emotional Damage', 'Sigma Face', 'Mewing', 'Looksmaxxing', 'Fanum Tax', 'Rizz Face', 'Ohio Meme', 'Skibidi Toilet', 'Grimace Shake', 'Mogging', 'Aura Farming', '6-7', 'Only in Ohio', 'Gigachad Walking', 'Doomer Girl', 'Pepe the Frog', 'Feels Guy', 'Wojak Pointing', 'Soyjak Pointing', 'NPC Stream Loop', 'Chad vs Virgin', 'Virgin Walk', 'Sigma Grindset', 'Bonk Dog', 'Smurf Cat', 'CaseOh Meme', 'Rock Eyebrow']],
  ['classic_memes', 'international', 'International Internet Culture', ['Tunak Tunak Tun', 'Azhagiya Asura Reaction', 'Korean Doge', 'Japanese Kaomoji Meme', 'Polish Cow', 'Spanish Laughing Dog', 'Brazilian Carreta Furacão', 'Indian Dancing Uncle', 'Pakistani Truck Art Meme', 'Moyai Reaction', 'Peruvian Memoji', 'Russian Badger', 'Asian Dad Meme', 'Korean Finger Heart', 'Brazilian Nazaré Confusa', 'Spanish No Quiero', 'Indian Meme Face', 'Japanese Cat Meme', 'Southeast Asia Reaction']],
];

const rejectedCandidates = rejectedGroups.flatMap(([category, era, _label, names]) => names.map((name) => rejected(name, category, era, rejectionReasons[name])));

export const VISUAL_CANDIDATE_MANIFEST: VisualCandidate[] = [...addedImageCandidates, ...textCandidates, ...rejectedCandidates]
  .filter((candidate, index, all) => all.findIndex((other) => other.name.toLowerCase() === candidate.name.toLowerCase()) === index);

export const REJECTED_VISUAL_CANDIDATES = VISUAL_CANDIDATE_MANIFEST.filter((candidate) => candidate.status === 'rejected');
