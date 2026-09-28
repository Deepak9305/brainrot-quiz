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
