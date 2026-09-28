import { Question } from '../types';
import { EXPANDED_QUESTIONS, MODERN_QUESTIONS } from './modernQuestions';
import { RUSH_VARIANTS } from './rushVariants';
import { INTERNET_CULTURE_QUESTIONS } from './internetCultureQuestions';
import { CHALLENGE_QUESTIONS } from './challengeQuestions';
import { getLocalMediaAsset } from './media';

export const QUESTION_DATABASE_VERSION = '2026.09.28';

const LEGACY_QUESTIONS_DB: Question[] = [
  // ==================== 1. IMAGE MODE ====================
  {
    id: 'img_1',
    mode: 'image',
    question: 'Identify this iconic brainrot character popping out of porcelain plumbing fixtures:',
    subtitle: 'Meme Archetype: The Sing-Along Terror',
    visualType: 'image',
    visualContent: 'toilet_head',
    options: ['Cameraman Titan', 'Skibidi Toilet', 'Plumber Bob', 'Ohio Septic Monster'],
    correctAnswer: 1, // B
    explanation: 'Skibidi Toilet was created by Alexey Gerasimov (DaFuq!?Boom!) featuring a human head singing inside a toilet.',
    memeContext: 'Originated in February 2023 and sparked a multi-billion view YouTube series.',
    difficulty: 'easy',
  },
  {
    id: 'img_2',
    mode: 'image',
    question: 'Which legendary aesthetic pose is depicted here (finger on lips, pointing to sharp jawline)?',
    subtitle: 'Meme Archetype: Looksmaxxing & Orthotropics',
    visualType: 'image',
    visualContent: 'mewing_jaw',
    options: ['Face-Palming', 'Jaw-Dropping', 'Mewing', 'The Sigma Nod'],
    correctAnswer: 2, // C
    explanation: '🤫🧏‍♂️ Mewing refers to proper tongue posture popularized by Dr. John Mew, co-opted into looksmaxxing memes.',
    memeContext: 'Used when someone tells you to be quiet while they maintain their sculpted jawline aura.',
    difficulty: 'easy',
  },
  {
    id: 'img_3',
    mode: 'image',
    question: 'Identify this cartoon canine wearing a rolled-up sweater who "lowkey doesn\'t care":',
    subtitle: 'Meme Archetype: Ultimate Zen Dog',
    visualType: 'image',
    visualContent: 'chill_guy',
    options: ['Chill Guy', 'Snoopy Alter-Ego', 'Doggo Sigma', 'Lowkey Larry'],
    correctAnswer: 0, // A
    explanation: '"Chill Guy" (created by artist Phillip Banks) became a massive TikTok viral sensation in late 2024.',
    memeContext: 'Used as an avatar for remaining unflappable despite chaotic life drama.',
    difficulty: 'easy',
  },
  {
    id: 'img_4',
    mode: 'image',
    question: 'Which fast-food mascot milkshake drink sparked viral horror-scene parody videos on TikTok?',
    subtitle: 'Meme Archetype: Birthday Curse',
    visualType: 'image',
    visualContent: 'grimace_shake',
    options: ['Barney Elixir', 'Lean Potion', 'Purple Guy Sludge', 'Grimace Shake'],
    correctAnswer: 3, // D
    explanation: 'McDonald\'s Grimace Birthday Shake went viral in summer 2023 with mock found-footage horror videos.',
    memeContext: 'People drank the shake and dramatically cut to crime scenes covered in berry syrup.',
    difficulty: 'easy',
  },
  {
    id: 'img_5',
    mode: 'image',
    question: 'What is this little blue smurf-like creature with a cat face and mushroom hat called?',
    subtitle: 'Meme Archetype: We Live, We Love, We Lie',
    visualType: 'image',
    visualContent: 'smurf_cat',
    options: ['Mushroom Kitty', 'Smurf Cat (Shailushai)', 'Gargamel Pet', 'Avatar Feline'],
    correctAnswer: 1, // B
    explanation: 'The Russian CGI creature "Shailushai", known in English as Smurf Cat, paired with Alan Walker\'s song "The Spectre".',
    memeContext: 'Flooded TikTok slideshows and comment sections in autumn 2023.',
    difficulty: 'medium',
  },
  {
    id: 'img_6',
    mode: 'image',
    question: 'Which streamer is constantly associated with waffle houses, gravity wells, and scale explosions?',
    subtitle: 'Meme Archetype: The 1x1 Lego Piece',
    visualType: 'image',
    visualContent: 'caseoh_mic',
    options: ['Jynxzi', 'CaseOh', 'IShowSpeed', 'Sketch'],
    correctAnswer: 1, // B
    explanation: 'CaseOh is famous for chaotic gaming streams where his chat spams unhinged fat jokes and food memes.',
    memeContext: '"Bro is built like a 1x1 Lego piece" and "You\'re banned!" are his trademark stream moments.',
    difficulty: 'medium',
  },
  {
    id: 'img_7',
    mode: 'image',
    question: 'Who is the famous Shiba Inu behind the legendary "much wow, very doge" meme and cryptocurrency?',
    subtitle: 'Meme Archetype: The Original Doge',
    visualType: 'image',
    visualContent: 'doge_shiba',
    options: ['Cheems Balltze', 'Hachiko', 'Kabosu (Doge)', 'Walter the Bull Terrier'],
    correctAnswer: 2, // C
    explanation: 'Kabosu, a female Shiba Inu rescue dog in Japan, was photographed in 2010 with folded paws and an iconic side-eye expression.',
    memeContext: 'Sparked the entire Doge meme franchise and Dogecoin.',
    difficulty: 'easy',
  },
  {
    id: 'img_8',
    mode: 'image',
    question: 'Which wrestler and actor created the legendary single eyebrow raise reaction meme with a boom sound?',
    subtitle: 'Meme Archetype: The People\'s Eyebrow',
    visualType: 'image',
    visualContent: 'rock_eyebrow',
    options: ['John Cena', 'Dave Bautista', 'Dwayne "The Rock" Johnson', 'Roman Reigns'],
    correctAnswer: 2, // C
    explanation: 'Dwayne "The Rock" Johnson\'s signature eyebrow raise accompanied by the Vine Boom sound became TikTok\'s favorite suspicion meme.',
    memeContext: 'Used when someone says something highly suspicious or caught in 4K.',
    difficulty: 'easy',
  },

  // ==================== 2. EMOJI MODE ====================
  {
    id: 'emj_1',
    mode: 'emoji',
    question: 'Decode this brainrot combo: 🤫 🧏‍♂️ 🗿',
    subtitle: 'Posture & Facial Structure',
    visualType: 'emoji',
    visualContent: '🤫 🧏‍♂️ 🗿',
    options: ['Sleeping in Class', 'Silent Monks of Ohio', 'Mewing & Chad Mogging', 'Secret Society Meeting'],
    correctAnswer: 2, // C
    explanation: 'The hush emoji + ear-tapping jaw gesture + Easter Island Moai represents looksmaxxing / mewing gigachad culture.',
    memeContext: 'Used to decline speaking because your tongue is currently pressed against the roof of your mouth.',
    difficulty: 'easy',
  },
  {
    id: 'emj_2',
    mode: 'emoji',
    question: 'Decode this streamer tax phrase: 🍕 🥷 🍗',
    subtitle: 'Culinary Robbery',
    visualType: 'emoji',
    visualContent: '🍕 🥷 🍗',
    options: ['Fanum Tax', 'DoorDash Heist', 'Midnight Snack', 'Ninja Chef Protocol'],
    correctAnswer: 0, // A
    explanation: 'Fanum Tax refers to AMP member Fanum taking a mandatory cut of Kai Cenat\'s food during streams.',
    memeContext: 'Gen Alpha adopted it as a universal term for stealing snacks from friends.',
    difficulty: 'easy',
  },
  {
    id: 'emj_3',
    mode: 'emoji',
    question: 'What viral catchphrase does this represent: 🦅 💦 👅',
    subtitle: 'Summer 2024 Street Interview',
    visualType: 'emoji',
    visualContent: '🦅 💦 👅',
    options: ['Eagle Splash', 'Hawk Tuah', 'Thirsty Bird', 'Spitfire Falcon'],
    correctAnswer: 1, // B
    explanation: 'Haliey Welch\'s onomatopoeia "Hawk Tuah, spit on that thang" became one of 2024\'s biggest viral soundbites.',
    memeContext: 'Sparked thousands of remix tracks, merchandise, and talk-show appearances.',
    difficulty: 'easy',
  },
  {
    id: 'emj_4',
    mode: 'emoji',
    question: 'Decode this TikTok lore event: 👶 🍼 🏈 👸 👑',
    subtitle: 'LSU Gymnastics & Football Rizz Lore',
    visualType: 'emoji',
    visualContent: '👶 🍼 🏈 👸 👑',
    options: ['Super Bowl Halftime Baby', 'Gronkowski Family Tree', 'Little League Royalty', 'Baby Gronk rizzing Livvy Dunne'],
    correctAnswer: 3, // D
    explanation: 'The absurd internet narrative where football child influencer "Baby Gronk" supposedly "rizzed up Livvy Dunne".',
    memeContext: 'Narrated in a hyper-dramatic monotone voiceover format by TikTok creator The Rizzler.',
    difficulty: 'medium',
  },
  {
    id: 'emj_5',
    mode: 'emoji',
    question: 'Decode this lone-wolf archetype: 🐺 🌕 💼 ☕ 🗿',
    subtitle: 'The 3:00 AM Cold Shower Grindset',
    visualType: 'emoji',
    visualContent: '🐺 🌕 💼 ☕ 🗿',
    options: ['Werewolf Stockbroker', 'Sigma Male Grindset', 'Full Moon Nightshift', 'Coffee Shop Barista'],
    correctAnswer: 1, // B
    explanation: 'The Alpha/Sigma lone wolf grindset meme depicts men rejecting small talk to trade crypto and hit the gym at 4 AM.',
    memeContext: 'Usually accompanied by phonk music (Brazilian or drift phonk) and Christian Bale clips.',
    difficulty: 'medium',
  },
  {
    id: 'emj_6',
    mode: 'emoji',
    question: 'Decode this sinister location equation: 🌽 🚜 🛸 💀 🕳️',
    subtitle: 'The Strange Dimension of the Midwest',
    visualType: 'emoji',
    visualContent: '🌽 🚜 🛸 💀 🕳️',
    options: ['Alien Farm Invasion', 'Cornfield Nightmare', 'Only in Ohio', 'Midwest Apocalypse'],
    correctAnswer: 2, // C
    explanation: '"Only in Ohio" became the meme epicenter where all impossible, bizarre, and terrifying anomalies occur.',
    memeContext: 'Started around 2022 with the "Can\'t even have X in Ohio" trend.',
    difficulty: 'easy',
  },
  {
    id: 'emj_7',
    mode: 'emoji',
    question: 'Decode this streamer stream meme: ☝️ 🤓 🏈 🗣️',
    subtitle: 'Special Teams Catchphrase',
    visualType: 'emoji',
    visualContent: '☝️ 🤓 🏈 🗣️',
    options: ['"Erm, actually!"', '"What\'s up brother? ☝️" (Sketch)', '"Put me in coach!"', '"Penalty flag on the play"'],
    correctAnswer: 1, // B
    explanation: 'Streamer Sketch with his glasses, pointing one finger to the sky: "What\'s up brother? Special teams, special plays, special players!"',
    memeContext: 'Imitated by athletes across the NFL, NBA, and Premier League.',
    difficulty: 'medium',
  },

  // ==================== 3. SLANG MODE ====================
  {
    id: 'slg_1',
    mode: 'slang',
    question: 'What is the etymology and true meaning of the term "Rizz"?',
    subtitle: 'Gen-Z / Gen-Alpha Linguistics',
    visualType: 'ascii',
    visualContent: '[ R I Z Z ]\n(n. & v.)',
    options: [
      'Short for "Risky Business" - daring athletic feats',
      'Short for "Charisma" - charm and romantic appeal',
      'An abbreviation of "Razzmatazz" - flashy dancing',
      'Derived from "Rizzoli" - Italian luxury street fashion'
    ],
    correctAnswer: 1, // B
    explanation: 'Popularized by Kai Cenat, "rizz" is derived from the middle syllable of "cha-RIZZ-ma". Oxford\'s 2023 Word of the Year!',
    memeContext: 'Variants include "unspoken rizz", "W rizz", "L rizz", and "Rizzler".',
    difficulty: 'easy',
  },
  {
    id: 'slg_2',
    mode: 'slang',
    question: 'What does it mean to "Mog" someone?',
    subtitle: 'Aesthetic Superiority Ranking',
    visualType: 'ascii',
    visualContent: '[ M O G ]\n(verb)',
    options: [
      'To completely outshine or dominate someone in appearance/physique',
      'To prank someone by sending them a cat picture',
      'To fail an online test spectacularly',
      'To mimic an NPC in a Grand Theft Auto game'
    ],
    correctAnswer: 0, // A
    explanation: '"Mogging" comes from AMOG (Alpha Male of Group), meaning to completely outshine someone in looks or stature.',
    memeContext: 'Common in looksmaxxing subcultures: height-mogging, jaw-mogging, eye-area mogging.',
    difficulty: 'medium',
  },
  {
    id: 'slg_3',
    mode: 'slang',
    question: 'What is the "Fanum Tax"?',
    subtitle: 'Social Food Etiquette',
    visualType: 'ascii',
    visualContent: '[ FANUM TAX ]\n(-10% calories)',
    options: [
      'A mandatory subscription fee for Twitch Prime viewers',
      'A delivery surcharge in New York City restaurants',
      'Taking a slice/bite of your friend\'s food without asking',
      'A fee charged for streaming video games'
    ],
    correctAnswer: 2, // C
    explanation: 'AMP streamer Fanum regularly entered Kai Cenat\'s stream room with a plate to snatch a piece of whatever Kai was eating.',
    memeContext: '"Give me a bite or pay the Fanum Tax!"',
    difficulty: 'easy',
  },
  {
    id: 'slg_4',
    mode: 'slang',
    question: 'Where did the phrase "What the sigma?" explode in popularity?',
    subtitle: 'Viral Voiceover Culture',
    visualType: 'ascii',
    visualContent: '🦑 "Erm... what the sigma?"',
    options: [
      'Elon Musk announcing a new spacecraft model',
      'An AI-generated Squidward voice complaining about modern slang',
      'A leaked script from Avengers Secret Wars',
      'A geometry textbook published in Michigan'
    ],
    correctAnswer: 1, // B
    explanation: 'A viral TikTok audio of an AI Squidward voice uttering "Erm... what the sigma?" replaced "what the hell" across classrooms.',
    memeContext: 'Overused ironically to the point of brainrot singularity in 2024.',
    difficulty: 'medium',
  },
  {
    id: 'slg_5',
    mode: 'slang',
    question: 'What does having negative "Aura" mean in internet culture?',
    subtitle: 'Social Status & Coolness Points',
    visualType: 'ascii',
    visualContent: '📉 -1,000,000 AURA',
    options: [
      'Having low Wi-Fi signal in public',
      'Doing something extremely embarrassing, clumsy, or uncool',
      'Forgetting your phone charger at school',
      'Refusing to drink energy drinks'
    ],
    correctAnswer: 1, // B
    explanation: 'Aura points are an imaginary currency of coolness and poise. Tripping in public is -5000 aura; catching a falling glass is +10,000 aura.',
    memeContext: 'Athletes missing open shots are captioned with "-1,000,000 Aura".',
    difficulty: 'easy',
  },
  {
    id: 'slg_6',
    mode: 'slang',
    question: 'What does "Bussin\'" actually mean?',
    subtitle: 'Culinary Praise',
    visualType: 'ascii',
    visualContent: '🔥 "Bro this food is bussin\'"',
    options: [
      'Crowded like a public transit bus',
      'Broken or completely out of order',
      'Moving at very high velocity',
      'Extremely delicious or exceptionally good'
    ],
    correctAnswer: 3, // D
    explanation: 'AAVE term meaning something (usually food) tastes exceptionally good.',
    memeContext: '"Respectfully, this food is straight bussin\' fr fr no cap."',
    difficulty: 'easy',
  },
  {
    id: 'slg_7',
    mode: 'slang',
    question: 'What does "Delulu" mean in the phrase "Delulu is the Solulu"?',
    subtitle: 'Stan & Gen-Z Slang',
    visualType: 'ascii',
    visualContent: '✨ "Delulu is the solulu"',
    options: [
      'Having delightfully delicious snacks',
      'Being delusional with irrational optimism',
      'Delivery arriving late from Amazon',
      'A deletion error in computer code'
    ],
    correctAnswer: 1, // B
    explanation: '"Delulu" means being delusional. The phrase suggests that blind confidence is the solution to self-doubt.',
    memeContext: 'Originated in K-pop fandoms and swept TikTok.',
    difficulty: 'medium',
  },

  // ==================== 4. SOUND MODE ====================
  {
    id: 'snd_1',
    mode: 'sound',
    question: 'Listen to this sound effect. Which legendary meme impact hit is this?',
    subtitle: 'Meme Audio: Bass Drop of Doom',
    visualType: 'sound_test',
    audioClip: 'vine_boom',
    options: ['Thunderstrike', 'The Vine Boom', 'C4 Explosive', '808 Kick Drum'],
    correctAnswer: 1, // B
    explanation: 'The iconic Vine Boom sound effect was the punctuation mark for dramatic suspense edits.',
    memeContext: 'Used in The Rock eyebrow-raise memes and shocking plot twists.',
    difficulty: 'easy',
  },
  {
    id: 'snd_2',
    mode: 'sound',
    question: 'Listen to this triple blast. Which MLG classic sound is playing?',
    subtitle: 'Meme Audio: 2014 Montage Parodies',
    visualType: 'sound_test',
    audioClip: 'airhorn',
    options: ['Ship Foghorn', 'Train Crossing Bell', 'Referee Whistle', 'MLG Airhorn'],
    correctAnswer: 3, // D
    explanation: 'The MLG Airhorn remix blast was the hallmark of 2013-2015 montage parodies with Doritos and Mountain Dew.',
    memeContext: 'Plays whenever someone hits a 360 no-scope or drops a mic.',
    difficulty: 'easy',
  },
  {
    id: 'snd_3',
    mode: 'sound',
    question: 'Listen to this resonant clatter. What dropped on the floor?',
    subtitle: 'Meme Audio: The Loudest Acoustic Event',
    visualType: 'sound_test',
    audioClip: 'metal_pipe',
    options: ['Metal Pipe Falling Sound', 'Kitchen Pots & Pans', 'Shopping Cart Crash', 'Bicycle Bell'],
    correctAnswer: 0, // A
    explanation: 'The "Metal Pipe Falling" sound effect became an absurd TikTok anti-humor trend in 2023.',
    memeContext: 'Guaranteed to wake up everyone in a 5-mile radius with its pristine acoustic clang.',
    difficulty: 'easy',
  },
  {
    id: 'snd_4',
    mode: 'sound',
    question: 'Listen to this vocal pitch slide. What classic gaming meme sound is this?',
    subtitle: 'Meme Audio: Childhood Damage Sound',
    visualType: 'sound_test',
    audioClip: 'roblox_oof',
    options: ['Minecraft Hurt Grunt', 'Mario Jump Squeak', 'Roblox "Oof" Death Sound', 'Pac-Man Death'],
    correctAnswer: 2, // C
    explanation: 'The Roblox "Oof" sound (originally created by Tommy Tallarico for the 2000 game Messiah).',
    memeContext: 'Became the universal internet sound effect for defeat and emotional damage.',
    difficulty: 'easy',
  },
  {
    id: 'snd_5',
    mode: 'sound',
    question: 'Listen to this downward vocal inflection. What reaction sound is this?',
    subtitle: 'Meme Audio: Total Disbelief',
    visualType: 'sound_test',
    audioClip: 'bruh',
    options: ['Chewbacca Sigh', 'Yawn Sample', 'Bruh Sound Effect #2', 'Record Scratch'],
    correctAnswer: 2, // C
    explanation: 'The legendary "Bruh" sound effect originated from a viral 2014 Vine of former high school basketball star Tony Farmer in court.',
    memeContext: 'The absolute default reaction to any absurd human failure.',
    difficulty: 'easy',
  },
  {
    id: 'snd_6',
    mode: 'sound',
    question: 'Listen to this mysterious 4-note motif. What secret order does this summon?',
    subtitle: 'Meme Audio: Conspiracy Confirmed',
    visualType: 'sound_test',
    audioClip: 'illuminati',
    options: ['Harry Potter Theme', 'Illuminati Confirmed Theme (X-Files)', 'Twilight Zone Intro', 'Stranger Things Theme'],
    correctAnswer: 1, // B
    explanation: 'Mark Snow\'s iconic whistle theme for The X-Files, permanently memed into the "Illuminati Confirmed" 🔺 soundtrack.',
    memeContext: 'Plays whenever three random objects align into a triangle.',
    difficulty: 'medium',
  },
  {
    id: 'snd_7',
    mode: 'sound',
    question: 'Listen to this two-tone chime. Which gamer chat platform does this belong to?',
    subtitle: 'Meme Audio: Ghost Ping Terror',
    visualType: 'sound_test',
    audioClip: 'discord_ping',
    options: ['Slack Notification', 'Skype Call', 'Apple iMessage', 'Discord Notification Ping'],
    correctAnswer: 3, // D
    explanation: 'The Discord notification sound triggers instant Pavlovian panic across millions of gamers checking their @everyone pings.',
    memeContext: 'Trolls play it in YouTube videos to make viewers check their background tabs.',
    difficulty: 'easy',
  },
  {
    id: 'snd_8',
    mode: 'sound',
    question: 'Listen to this dramatic 3-chord strike. What cinematic meme trope is playing?',
    subtitle: 'Meme Audio: Dramatic Reveal',
    visualType: 'sound_test',
    audioClip: 'dun_dun_dun',
    options: ['Dramatic Dun Dun Dunnn!', 'Law & Order Thud', 'Inception Horn (BWAAAH)', 'Psycho Shower Chords'],
    correctAnswer: 0, // A
    explanation: 'The classic "Dramatic Chipmunk" orchestral hit (C# -> C# -> C) from 1950s cinema, popularized by the turning prairie dog meme.',
    memeContext: 'Used whenever a shocking betrayal or secret is uncovered.',
    difficulty: 'easy',
  },

  // ==================== 5. VOICE MODE ====================
  {
    id: 'voc_1',
    mode: 'voice',
    question: 'Click the speaker button to hear the synthesized quote. Who or what is being quoted?',
    subtitle: 'Voice Clip: The Squidward Inquiry',
    visualType: 'voice_clip',
    voiceText: 'Erm, what the sigma?',
    speakerName: 'squidward',
    voicePitch: 1.55,
    voiceRate: 0.95,
    options: ['Peter Griffin', 'Squidward AI voice', 'MrBeast', 'Patrick Star'],
    correctAnswer: 1, // B
    explanation: 'The phrase "Erm, what the sigma?" went viral through parody AI Squidward voices on YouTube Shorts and TikTok.',
    memeContext: 'Now spoken by millions of middle-schoolers to express mild confusion.',
    difficulty: 'easy',
  },
  {
    id: 'voc_2',
    mode: 'voice',
    question: 'Listen to the synthesized voice clip. What viral street interview catchphrase is this?',
    subtitle: 'Voice Clip: Nashville Summer Phenomenon',
    visualType: 'voice_clip',
    voiceText: 'Hawk tuah, spit on that thang!',
    speakerName: 'hawk_tuah',
    voicePitch: 1.28,
    voiceRate: 1.05,
    options: ['Cardi B freestyle', 'Hawk Tuah girl (Haliey Welch)', 'Bhad Bhabie interview', 'Addison Rae podcast'],
    correctAnswer: 1, // B
    explanation: 'Haliey Welch said "Hawk tuah, spit on that thang!" during a Tim & Dee TV street interview in Nashville in June 2024.',
    memeContext: 'Gained millions of followers in weeks and launched her "Talk Tuah" podcast.',
    difficulty: 'easy',
  },
  {
    id: 'voc_3',
    mode: 'voice',
    question: 'Listen to the synthesized quote. Which meme attitude is being described?',
    subtitle: 'Voice Clip: Unbothered King',
    visualType: 'voice_clip',
    voiceText: 'I am just a chill guy who lowkey does not care.',
    speakerName: 'chill_guy',
    voicePitch: 0.82,
    voiceRate: 0.85,
    options: ['Chill Guy dog character', 'Gigachad interview', 'Sigma male grindset', 'Patrick Bateman monologue'],
    correctAnswer: 0, // A
    explanation: '"Chill Guy" represents the effortless peace of mind when external chaos surrounds you.',
    memeContext: 'Paired with relaxed lo-fi beats and captions about exams or work stress.',
    difficulty: 'easy',
  },
  {
    id: 'voc_4',
    mode: 'voice',
    question: 'Listen to the synthesized quote. What snack law is being enforced?',
    subtitle: 'Voice Clip: The Mandatory Toll',
    visualType: 'voice_clip',
    voiceText: 'Did you pay the Fanum tax on that slice of pepperoni pizza?',
    speakerName: 'kai_cenat',
    voicePitch: 1.15,
    voiceRate: 1.25,
    options: ['The Skibidi Surcharge', 'The Ohio Tariff', 'The Fanum Tax', 'The Rizzler Toll'],
    correctAnswer: 2, // C
    explanation: 'Fanum Tax requires 10-20% of your homie\'s food to be sacrificed peacefully.',
    memeContext: 'Featured prominently in the "Sticking out your gyatt for the rizzler" parody song.',
    difficulty: 'easy',
  },
  {
    id: 'voc_5',
    mode: 'voice',
    question: 'Listen to the speech synthesizer. What looksmaxxing command is being given?',
    subtitle: 'Voice Clip: The Vow of Silence',
    visualType: 'voice_clip',
    voiceText: 'Silence NPC! Can you not see that I am currently mewing?',
    speakerName: 'sigma',
    voicePitch: 0.65,
    voiceRate: 0.85,
    options: ['Praying in Ohio', 'Meditating in Tibet', 'Mewing for a sharper jawline', 'Reading a teleprompter'],
    correctAnswer: 2, // C
    explanation: 'Rule #1 of mewing: You cannot speak while your tongue is suctioned to your palate, lest you lose your facial gains.',
    memeContext: 'Students tap their jawline instead of answering teachers during attendance.',
    difficulty: 'easy',
  },
  {
    id: 'voc_6',
    mode: 'voice',
    question: 'Listen to this streamer quote. Which streamer is shouting about bans?',
    subtitle: 'Voice Clip: Unhinged Raging Streamer',
    visualType: 'voice_clip',
    voiceText: 'Yup, you are banned! Get him out of here right now!',
    speakerName: 'caseoh',
    voicePitch: 0.72,
    voiceRate: 1.1,
    options: ['Shroud', 'CaseOh', 'PewDiePie', 'Ninja'],
    correctAnswer: 1, // B
    explanation: 'CaseOh\'s iconic stream catchphrase reacting to chat roasts: "Yup, you\'re banned! Mods, ban that guy!"',
    memeContext: 'Spammed in TikTok gaming compilation clips.',
    difficulty: 'easy',
  },

  // ==================== 6. RUSH MODE ====================
  {
    id: 'rsh_1',
    mode: 'rush',
    question: 'Quick! Is "Skibidi" originally inspired by Turkish singer Biser King and Little Big?',
    subtitle: 'Rush Speedrun #1',
    options: ['False (Originated in Minecraft)', 'True (Biser King / Little Big)', 'False (A Disney song)', 'False (SpongeBob episode)'],
    correctAnswer: 1, // B
    explanation: 'True! Biser King\'s "Dom Dom Yes Yes" and Little Big\'s "Skibidi" dance track inspired the hook.',
    memeContext: '"Skibidi dop dop dop yes yes"',
    difficulty: 'easy',
  },
  {
    id: 'rsh_2',
    mode: 'rush',
    question: 'What is a "Gyatt"?',
    subtitle: 'Rush Speedrun #2',
    options: ['A type of gyro sandwich', 'A Greek mythological beast', 'Slang exclamation of astonishment', 'A Discord moderator badge'],
    correctAnswer: 2, // C
    explanation: 'Shortened from "God damn!" into "GYYYAAATT" by streamers like YourRAGE and Kai Cenat.',
    memeContext: 'Level 10 Gyatt is the apex measurement.',
    difficulty: 'easy',
  },
  {
    id: 'rsh_3',
    mode: 'rush',
    question: 'Which state is memed as the most dangerous surreal wasteland?',
    subtitle: 'Rush Speedrun #3',
    options: ['Florida', 'Wyoming', 'Ohio', 'Nebraska'],
    correctAnswer: 2, // C
    explanation: 'Ohio has been the undisputed champion of absurd meme anomalies since 2022.',
    memeContext: 'Can\'t even brush your teeth in Ohio.',
    difficulty: 'easy',
  },
  {
    id: 'rsh_4',
    mode: 'rush',
    question: 'Which YouTuber gave away a real-life Chocolate Factory and private island?',
    subtitle: 'Rush Speedrun #4',
    options: ['MrBeast', 'PewDiePie', 'Logan Paul', 'Markiplier'],
    correctAnswer: 0, // A
    explanation: 'MrBeast (Jimmy Donaldson) created elaborate Willy Wonka and survival island videos.',
    memeContext: 'Subject of the "MrBeast Rap Battle" and uncanny smiling thumbnail memes.',
    difficulty: 'easy',
  },
  {
    id: 'rsh_5',
    mode: 'rush',
    question: 'What does "No Cap" translate to in plain English?',
    subtitle: 'Rush Speedrun #5',
    options: ['Without a hat', 'No maximum limit', 'Do not record video', 'No lie / 100% genuine truth'],
    correctAnswer: 3, // D
    explanation: '"Cap" means lie; "no cap" means speaking the 100% genuine truth.',
    memeContext: 'Usually paired with "fr fr on god".',
    difficulty: 'easy',
  },
  {
    id: 'rsh_6',
    mode: 'rush',
    question: 'What does "Glizzy" commonly refer to in streamer slang?',
    subtitle: 'Rush Speedrun #6',
    options: ['Apple iPhone', 'Energy Drink', 'Hot Dog', 'Headphones'],
    correctAnswer: 2, // C
    explanation: '"Glizzy" is slang for a hot dog, famously debated by streamers in 2020.',
    memeContext: 'The Glizzy Gladiator was a viral summer 2020 meme.',
    difficulty: 'easy',
  },
  {
    id: 'rsh_7',
    mode: 'rush',
    question: 'What is the "Grimace Shake" flavor officially marketed as?',
    subtitle: 'Rush Speedrun #7',
    options: ['Blue Raspberry', 'Berry flavored', 'Grape soda', 'Cotton candy'],
    correctAnswer: 1, // B
    explanation: 'McDonald\'s officially marketed the purple Grimace shake as a generic berry-flavored milkshake.',
    memeContext: 'Spawned the viral horror murder scene trend.',
    difficulty: 'medium',
  },
  {
    id: 'rsh_8',
    mode: 'rush',
    question: 'How much Aura do you lose for a fake wave?',
    subtitle: 'Rush Speedrun #8',
    options: ['+10,000 Aura', '-1,000,000 Aura', '0 Aura', '+50 Aura'],
    correctAnswer: 1, // B
    explanation: 'The classic fake wave to a stranger is widely recognized as an immediate -1,000,000 Aura catastrophic event.',
    memeContext: 'Immediate social paralysis.',
    difficulty: 'easy',
  },

  // ==================== 7. DAILY MODE ====================
  {
    id: 'dly_1',
    mode: 'daily',
    question: 'Daily Brainrot Check: Who is considered the unofficial "King of Twitch" in modern brainrot lore?',
    subtitle: 'Daily Streak Mission: Question 1/5',
    options: ['Ninja', 'Kai Cenat', 'Shroud', 'xQc'],
    correctAnswer: 1, // B
    explanation: 'Kai Cenat broke all-time subscriber records with his subathons and sleepover streams.',
    memeContext: 'Leader of AMP and prime catalyst for rizz / Fanum tax vocabulary.',
    difficulty: 'easy',
  },
  {
    id: 'dly_2',
    mode: 'daily',
    question: 'Daily Brainrot Check: What is the highest level of Gyatt recognized by internet scholars?',
    subtitle: 'Daily Streak Mission: Question 2/5',
    options: ['Level 100 Boss Gyatt', 'Level 1 Rizz Gyatt', 'Level 10 Gyatt', 'Omega Tier Gyatt'],
    correctAnswer: 2, // C
    explanation: '"Level 10 Gyatt" is the universally accepted maximum tier in the viral brainrot chant.',
    memeContext: 'Sticking out your gyatt for the rizzler, you\'re so skibidi, you\'re so fanum tax.',
    difficulty: 'easy',
  },
  {
    id: 'dly_3',
    mode: 'daily',
    question: 'Daily Brainrot Check: What does "Cook" mean when someone says "Let him cook"?',
    subtitle: 'Daily Streak Mission: Question 3/5',
    options: ['Allow him space to execute his genius plan or argument', 'Make dinner for everyone', 'Turn up the thermostat', 'Insult someone in group chat'],
    correctAnswer: 0, // A
    explanation: '"Let him cook" means letting someone demonstrate what they can do without interruption.',
    memeContext: 'Hold on... wait a minute... let him cook!',
    difficulty: 'easy',
  },
  {
    id: 'dly_4',
    mode: 'daily',
    question: 'Daily Brainrot Check: What is the signature catchphrase of streamer Sketch?',
    subtitle: 'Daily Streak Mission: Question 4/5',
    options: ['"Let\'s go baby!"', '"GG EZ clap"', '"What\'s up brother? ☝️🤓"', '"Are you serious right neow?"'],
    correctAnswer: 2, // C
    explanation: 'Sketch exploded in popularity with his index finger point and "What\'s up brother? ☝️ Special teams, special plays, special players!"',
    memeContext: 'NFL players and kids imitated the finger point worldwide.',
    difficulty: 'easy',
  },
  {
    id: 'dly_5',
    mode: 'daily',
    question: 'Daily Brainrot Check: What does "Mewing" primarily train according to proponents?',
    subtitle: 'Daily Streak Mission: Question 5/5',
    options: ['Eye color change', 'Tongue posture against the palate', 'Bicep curls', 'Vocal pitch depth'],
    correctAnswer: 1, // B
    explanation: 'Mewing emphasizes resting the entire tongue against the roof of the mouth for facial jawline alignment.',
    memeContext: 'Taught in orthotropics, memed as the ultimate sigma habit.',
    difficulty: 'easy',
  },

  // ==================== 8. CHALLENGE MODE ====================
  {
    id: 'chg_1',
    mode: 'challenge',
    question: 'Challenge Wave 1: Which person is commonly associated with the edited "GigaChad" physique memes?',
    subtitle: 'BOSS WAVE: THE FOUNDATIONS OF MOGGING',
    options: ['Pavel Durov', 'Arnie Schwarzenegger', 'Ernest Khalimov', 'Dmitry Klokov'],
    correctAnswer: 2, // C
    explanation: 'Ernest Khalimov is the name most commonly associated with the edited GigaChad images; attribution around the art project and reposts is often discussed rather than a single official canon.',
    memeContext: 'The imagery became a recurring template in "Average Fan vs Average Enjoyer" and other physique edits.',
    difficulty: 'medium',
  },
  {
    id: 'chg_2',
    mode: 'challenge',
    question: 'Challenge Wave 2: What is the scientific origin behind the concept of "Mewing"?',
    subtitle: 'BOSS WAVE: ORTHOTROPIC GAINS',
    options: [
      'A cartoon cat sound from Pokémon (Mewtwo)',
      'Orthotropic facial restructuring exercises created by Dr. John Mew',
      'A Tibetan throat singing technique',
      'A boxing defensive guard invented by Floyd Mayweather'
    ],
    correctAnswer: 1, // B
    explanation: 'British orthodontist Dr. John Mew promoted resting the entire tongue against the roof of the mouth to guide jaw growth.',
    memeContext: 'The internet turned an orthodontic concept into the ultimate silent flex.',
    difficulty: 'medium',
  },
  {
    id: 'chg_3',
    mode: 'challenge',
    question: 'Challenge Wave 3: In the legendary "Sticking out your gyatt for the rizzler" parody, which Fortnite character is referenced?',
    subtitle: 'BOSS WAVE: BRAINROT ANTHEM',
    options: ['John Wick / Peely', 'Travis Scott / Jonesy', 'You\'re so biboo tax / Baby Gronk', 'Goku / Renegade Raider'],
    correctAnswer: 2, // C
    explanation: 'The viral Brainrot song combines "You\'re so skibidi, you\'re so fanum tax, I just wanna be your sigma, freaking come here, give me your ohio".',
    memeContext: 'Sung by creator @ironicsings and parodied everywhere.',
    difficulty: 'hard',
  },
  {
    id: 'chg_4',
    mode: 'challenge',
    question: 'Challenge Wave 4: What is the highest rank in the sigma hierarchy according to ironic meme charts?',
    subtitle: 'BOSS WAVE: HIERARCHY TEST',
    options: ['Beta Male', 'Delta Male', 'Zeta Male', 'Shrigma / Sugma Male'],
    correctAnswer: 3, // D
    explanation: '"Shrigma Male" (a mushroom-dwelling hermit outside human comprehension) became the satirical apex predator of male hierarchy memes.',
    memeContext: 'Transcends Alpha, Beta, and Sigma completely.',
    difficulty: 'hard',
  },
  {
    id: 'chg_5',
    mode: 'challenge',
    question: 'Challenge Wave 5: In Brazilian Phonk drift edits, which actor\'s film characters are often featured?',
    subtitle: 'BOSS WAVE: SIGMA CINEMA',
    options: ['Christian Bale (American Psycho)', 'Leonardo DiCaprio (Inception)', 'Tom Cruise (Top Gun)', 'Keanu Reeves (Matrix)'],
    correctAnswer: 0, // A
    explanation: 'Christian Bale\'s portrayal of Patrick Bateman in American Psycho is the quintessential mascot for sigma phonk edits.',
    memeContext: 'Listen to the phonk, do 1,000 pushups, refuse to explain.',
    difficulty: 'medium',
  },
  {
    id: 'chg_6',
    mode: 'challenge',
    question: 'FINAL BOSS OF OHIO: Which year is commonly associated with the early "Ohio will be eliminated" bus-sign meme?',
    subtitle: 'FINAL BOSS: THE ELDRITCH MIDWEST ORIGIN',
    options: ['2023 (TikTok algorithm)', '2016 ("Ohio will be eliminated")', '2019 (Area 51 raid)', '2012 (Mayan calendar)'],
    correctAnswer: 1, // B
    explanation: '2016 is commonly linked to a viral image of an electronic bus display reading "Ohio will be eliminated"; meme origins and repost timelines are not a single official canon.',
    memeContext: 'The reference later evolved through reposts into "Wait, it\'s all Ohio? Always has been 👨‍🚀🔫👨‍🚀".',
    difficulty: 'sigma',
  },
];

// Legacy prototype image prompts are intentionally excluded from active play:
// they referenced unrelated stock photography. The replacement pack is local,
// source-documented, and current-generation brainrot content.
function normalizeQuestion(question: Question): Question {
  const category = question.category ?? (
    question.era === 'italian_brainrot' ? 'italian_brainrot' :
    question.mode === 'slang' ? 'slang' :
    question.mode === 'emoji' ? 'emoji' :
    question.mode === 'sound' ? 'sound' :
    question.mode === 'challenge' ? 'challenge' :
    question.mode === 'rush' ? 'rush' :
    question.questionType === 'quote_identification' ? 'quote' :
    'modern'
  );
  const inferredType = question.questionType ?? (
    question.visualType === 'image' ? 'image_identification' :
    question.visualType === 'emoji' ? 'emoji_decode' :
    'standard'
  );
  const mediaRequested = question.visualType === 'image' || question.useMediaAsQuestion === true;
  const localKey = question.visualContent ?? question.imageAsset ?? (mediaRequested ? question.subjectKey : undefined);
  const localAsset = mediaRequested ? getLocalMediaAsset(localKey) : undefined;
  const imageVariant = question.imageVariant ?? (localAsset
    ? question.difficulty === 'easy' ? 'standard'
      : question.difficulty === 'medium' ? 'crop'
        : question.difficulty === 'hard' ? 'detail'
          : 'silhouette'
    : undefined);
  const inferredChallengeWave = question.challengeWave ?? (question.mode === 'challenge'
    ? Math.min(6, Number(question.id.match(/(?:chg|challenge)[_-]?(\d+)/i)?.[1] ?? 1))
    : undefined);

  return {
    ...question,
    subtitle: question.mode === 'image'
      ? question.visualType === 'ascii' ? 'VISUAL MODE / TEXT CLUE' : 'VISUAL MODE / IDENTIFY THE IMAGE'
      : question.subtitle,
    category,
    useMediaAsQuestion: mediaRequested,
    questionType: inferredType,
    visualType: localAsset ? 'image' : question.visualType,
    visualContent: localAsset ? localKey : question.visualContent,
    imageAsset: localAsset ? localKey : question.imageAsset,
    imageVariant,
    challengeWave: inferredChallengeWave,
    era: question.era ?? (category === 'classic_memes' ? 'classic' : 'current'),
    topic: question.topic ?? question.category ?? question.mode,
    subjectKey: question.subjectKey ?? question.imageAsset ?? question.visualContent ?? question.id,
    eligibleForRush: question.eligibleForRush ?? !['sound', 'voice', 'daily', 'challenge'].includes(question.mode),
    eligibleForDaily: question.eligibleForDaily ?? !['sound', 'voice', 'daily', 'challenge', 'rush'].includes(question.mode),
  };
}

// A few legacy prompts shared identical wording. Keep the original content but
// give each active card a distinct, scannable prompt for replay variety.
const QUESTION_PROMPT_OVERRIDES: Record<string, string> = {
  it_deep_22: 'Which hybrid matches the goose and aircraft clue?',
  it_deep_23: 'Which name belongs to the cow with a Saturn orbit?',
  it_deep_33: 'Which character has a name chanted three times alongside a wooden figure?',
  rush_deep_44: 'Which shorthand means you just burst out laughing?',
  rush_deep_48: 'In a reply, how does lowkey change the tone?',
};

export const QUESTIONS_DB: Question[] = [
  ...LEGACY_QUESTIONS_DB.filter((question) => question.mode !== 'image' && question.mode !== 'challenge'),
  ...MODERN_QUESTIONS.filter((question) => question.mode !== 'challenge'),
  ...RUSH_VARIANTS,
  ...EXPANDED_QUESTIONS.filter((question) => question.mode !== 'challenge'),
  ...INTERNET_CULTURE_QUESTIONS,
  ...CHALLENGE_QUESTIONS,
].map(normalizeQuestion).map((question) => ({
  ...question,
  question: QUESTION_PROMPT_OVERRIDES[question.id] ?? question.question,
}));
