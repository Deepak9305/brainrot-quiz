import { QUESTIONS_DB } from '../src/data/questions';
import { getLocalMediaAsset } from '../src/data/media';

const validModes = new Set(['mix', 'image', 'emoji', 'slang', 'sound', 'voice', 'rush', 'daily', 'challenge']);
const validCategories = new Set(['modern', 'italian_brainrot', 'slang', 'classic_memes', 'emoji', 'quote', 'sound', 'challenge', 'rush']);
const errors: string[] = [];
const warnings: string[] = [];
const ids = new Set<string>();
const prompts = new Map<string, string>();

function normalize(value: string): string {
  const normalized = value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
  return normalized || value.trim();
}

function similarity(left: string, right: string): number {
  const a = normalize(left).split(' ');
  const b = new Set(normalize(right).split(' '));
  return a.filter((token) => b.has(token)).length / Math.max(a.length, b.size, 1);
}

for (const question of QUESTIONS_DB) {
  if (ids.has(question.id)) errors.push(`duplicate id: ${question.id}`);
  ids.add(question.id);
  if (!question.question.trim()) errors.push(`${question.id}: missing question text`);
  if (question.options.length !== 4) errors.push(`${question.id}: expected exactly four options`);
  if (question.correctAnswer < 0 || question.correctAnswer >= question.options.length) errors.push(`${question.id}: invalid correctAnswer`);
  if (new Set(question.options.map(normalize)).size !== question.options.length) errors.push(`${question.id}: duplicate options`);
  if (!question.explanation?.trim() || !question.memeContext?.trim()) errors.push(`${question.id}: missing explanation/context`);
  if (!['easy', 'medium', 'hard', 'sigma'].includes(question.difficulty)) errors.push(`${question.id}: invalid difficulty`);
  if (!validModes.has(question.mode)) errors.push(`${question.id}: invalid mode ${question.mode}`);
  if (!question.category || !validCategories.has(question.category)) errors.push(`${question.id}: invalid category`);
  if (!question.subjectKey?.trim()) errors.push(`${question.id}: missing subjectKey`);
  if (question.visualType === 'image' && !getLocalMediaAsset(question.visualContent)) errors.push(`${question.id}: missing local media asset ${question.visualContent}`);
  if (question.mode === 'challenge' && (!question.challengeWave || question.challengeWave < 1 || question.challengeWave > 6)) errors.push(`${question.id}: invalid Challenge wave`);
  if (question.mode === 'rush' && question.eligibleForRush === false) errors.push(`${question.id}: Rush question is not eligible`);
  const prompt = normalize(question.question);
  const previous = prompts.get(prompt);
  if (previous) warnings.push(`duplicate prompt: ${question.id} matches ${previous}`);
  for (const [oldPrompt, oldId] of prompts) if (oldPrompt !== prompt && similarity(oldPrompt, prompt) >= 0.92) warnings.push(`near-duplicate prompt: ${question.id} resembles ${oldId}`);
  prompts.set(prompt, question.id);
  if (/question engine|database design|quiz architecture|coding|protects quiz variety|about the app/i.test(question.question)) errors.push(`${question.id}: meta/dev question does not belong in the quiz`);
}

const difficulty = QUESTIONS_DB.reduce((counts, question) => ({ ...counts, [question.difficulty]: (counts[question.difficulty] ?? 0) + 1 }), {} as Record<string, number>);
if (QUESTIONS_DB.length < 200) errors.push(`question pool too small: ${QUESTIONS_DB.length}`);
if (QUESTIONS_DB.filter((question) => question.mode === 'rush').length < 100) errors.push('dedicated Rush pool is below 100');
if (warnings.length > 0) console.warn(`data validation warnings: ${warnings.length}\n${warnings.slice(0, 20).join('\n')}`);
console.log(`validated ${QUESTIONS_DB.length} questions`, difficulty);
if (errors.length > 0) {
  console.error(`data validation failed: ${errors.length}\n${errors.join('\n')}`);
  process.exit(1);
}
console.log('question data: PASS');
