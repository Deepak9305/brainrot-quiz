import { Question } from '../types';

export type Seed = Pick<Question, 'question' | 'options' | 'correctAnswer' | 'explanation' | 'memeContext' | 'difficulty'> & Partial<Question>;

export function makeQuestion(id: string, seed: Seed, defaults: Partial<Question> = {}): Question {
  return {
    id,
    mode: 'mix',
    questionType: 'standard',
    era: 'current',
    category: 'modern',
    eligibleForRush: true,
    eligibleForDaily: true,
    tags: [],
    subjectKey: id,
    ...defaults,
    ...seed,
    options: seed.options,
    correctAnswer: seed.correctAnswer,
  };
}

export function italian(id: string, question: string, visualContent: string, subjectKey: string, answer: string, distractors: string[], difficulty: Question['difficulty'] = 'medium'): Question {
  return makeQuestion(id, { question, subtitle: 'ITALIAN BRAINROT / COMMUNITY LORE', visualType: 'emoji', visualContent, questionType: 'emoji_decode', era: 'italian_brainrot', category: 'italian_brainrot', tags: ['italian brainrot', 'community lore'], subjectKey, options: [answer, ...distractors], correctAnswer: 0, explanation: `${answer} is the commonly used name for this community-made reference. Fan edits can vary, so the clue points to the recognizable version.`, memeContext: 'Italian Brainrot characters are remixable internet creations rather than one official canon.', difficulty }, { mode: 'emoji' });
}

export function slang(id: string, question: string, visualContent: string, answer: string, distractors: string[], difficulty: Question['difficulty'] = 'medium'): Question {
  return makeQuestion(id, { question, subtitle: 'CURRENT SLANG / CONTEXT CHECK', visualType: 'ascii', visualContent, category: 'slang', era: 'current', tags: ['slang', 'short-form culture'], options: [answer, ...distractors], correctAnswer: 0, explanation: `${answer} is a common playful meaning in online short-form communities, although usage varies by context.`, memeContext: 'Online slang moves quickly, so these definitions are common usage rather than universal law.', difficulty }, { mode: 'slang' });
}

export function classic(id: string, question: string, answer: string, distractors: string[], explanation: string, difficulty: Question['difficulty'] = 'medium'): Question {
  return makeQuestion(id, { question, subtitle: 'CLASSIC MEME HISTORY / RECEIPTS', category: 'classic_memes', era: 'classic', tags: ['classic memes', 'internet history'], options: [answer, ...distractors], correctAnswer: 0, explanation, memeContext: 'Classic formats are remixed constantly and rarely have one owner or one meaning.', difficulty });
}

export function emoji(id: string, question: string, visualContent: string, answer: string, distractors: string[], explanation: string, difficulty: Question['difficulty'] = 'easy'): Question {
  return makeQuestion(id, { question, subtitle: 'EMOJI MODE / DECODE THE POST', visualType: 'emoji', visualContent, questionType: 'emoji_decode', category: 'emoji', tags: ['emoji', 'visual clue'], options: [answer, ...distractors], correctAnswer: 0, explanation, memeContext: 'Emoji quizzes read the vibe and association rather than treating the combination as a formal code.', difficulty }, { mode: 'emoji' });
}

export function quote(id: string, question: string, answer: string, distractors: string[], explanation: string, difficulty: Question['difficulty'] = 'medium'): Question {
  return makeQuestion(id, { question, subtitle: 'QUOTE MODE / INTERNET RECEIPTS', questionType: 'quote_identification', category: 'quote', tags: ['quotes', 'internet history'], options: [answer, ...distractors], correctAnswer: 0, explanation, memeContext: 'Short quote prompts are cultural references, not bundled audio or claims of ownership.', difficulty });
}

export function rush(id: string, question: string, answer: string, distractors: string[], explanation = 'A short, commonly used internet-culture reference.', difficulty: Question['difficulty'] = 'easy'): Question {
  return makeQuestion(id, { question, subtitle: 'RUSH / QUICK FIRE', category: 'rush', tags: ['rush', 'quick answer'], options: [answer, ...distractors], correctAnswer: 0, explanation, memeContext: 'Rush clues are short so speed tests recognition instead of reading endurance.', difficulty }, { mode: 'rush', eligibleForRush: true, eligibleForDaily: false });
}

export function challenge(id: string, wave: number, question: string, answer: string, distractors: string[], explanation: string, difficulty: Question['difficulty']): Question {
  return makeQuestion(id, { question, subtitle: wave === 6 ? 'FINAL BOSS / SIGMA LORE' : `BOSS WAVE ${wave} / DEEP LORE`, category: 'challenge', tags: ['challenge', 'deep lore'], challengeWave: wave, options: [answer, ...distractors], correctAnswer: 0, explanation, memeContext: 'Challenge uses recognizable internet history and documented community lore, not invented canon.', difficulty }, { mode: 'challenge', eligibleForRush: false, eligibleForDaily: false });
}
