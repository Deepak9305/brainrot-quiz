import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { QUESTIONS_DB, QUESTION_DATABASE_VERSION } from '../src/data/questions';
import { LOCAL_MEDIA, getLocalMediaAsset } from '../src/data/media';
import { ARCHIVE_ENTRIES } from '../src/data/archive';

const validModes = new Set(['mix', 'image', 'emoji', 'slang', 'sound', 'voice', 'rush', 'daily', 'challenge']);
const validCategories = new Set(['modern', 'italian_brainrot', 'slang', 'classic_memes', 'emoji', 'quote', 'sound', 'challenge', 'rush']);
const errors: string[] = [];
const warnings: string[] = [];
const ids = new Set<string>();
const prompts = new Map<string, string>();
const archiveIds = new Set<string>();
const archiveMediaIds = new Set<string>();
const activeSubjectKeys = new Set(QUESTIONS_DB.map((question) => question.subjectKey));

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
  if (question.visualType === 'image' && question.imageVariant === 'silhouette' && question.difficulty === 'easy') warnings.push(`${question.id}: easy silhouette clue needs editorial review`);
  if (question.mode === 'challenge' && (!question.challengeWave || question.challengeWave < 1 || question.challengeWave > 6)) errors.push(`${question.id}: invalid Challenge wave`);
  if (question.mode === 'rush' && question.eligibleForRush === false) errors.push(`${question.id}: Rush question is not eligible`);
  const prompt = normalize(question.question);
  const previous = prompts.get(prompt);
  if (previous) warnings.push(`duplicate prompt: ${question.id} matches ${previous}`);
  for (const [oldPrompt, oldId] of prompts) if (oldPrompt !== prompt && similarity(oldPrompt, prompt) >= 0.92) warnings.push(`near-duplicate prompt: ${question.id} resembles ${oldId}`);
  prompts.set(prompt, question.id);
  if (/question engine|database design|quiz architecture|coding|protects quiz variety|about the app/i.test(question.question)) errors.push(`${question.id}: meta/dev question does not belong in the quiz`);
}

for (const entry of ARCHIVE_ENTRIES) {
  if (archiveIds.has(entry.subjectKey)) errors.push(`duplicate archive subject: ${entry.subjectKey}`);
  archiveIds.add(entry.subjectKey);
  if (!activeSubjectKeys.has(entry.subjectKey)) errors.push(`archive ${entry.subjectKey}: no active question can discover this entry`);
  if (entry.mediaKey) {
    archiveMediaIds.add(entry.mediaKey);
    if (!getLocalMediaAsset(entry.mediaKey)) errors.push(`archive ${entry.subjectKey}: invalid mediaKey ${entry.mediaKey}`);
  }
}

const mediaSources = new Map<string, string>();
Object.entries(LOCAL_MEDIA).forEach(([mediaKey, asset]) => {
  if (!/^[a-z0-9]+(?:_[a-z0-9]+)*$/.test(mediaKey)) errors.push(`non-canonical media key: ${mediaKey}`);
  if (!asset.sourceUrl?.trim()) errors.push(`missing source URL: ${mediaKey}`);
  const previousKey = mediaSources.get(asset.src);
  if (previousKey) warnings.push(`duplicate media file: ${mediaKey} and ${previousKey} both use ${asset.src}`);
  mediaSources.set(asset.src, mediaKey);
  const referencedByQuestion = QUESTIONS_DB.some((question) => question.subjectKey === mediaKey || question.visualContent === mediaKey || question.imageAsset === mediaKey);
  const referencedByArchive = archiveMediaIds.has(mediaKey);
  if (!referencedByQuestion && !referencedByArchive) warnings.push(`orphan media: ${mediaKey} is not used by questions or Archive`);
  const filePath = resolve(process.cwd(), 'public', asset.src.replace(/^\//, ''));
  if (!existsSync(filePath)) errors.push(`missing media file: ${mediaKey} -> ${asset.src}`);
  if (asset.attributionRequired && (!asset.author || !asset.licenseName || !asset.licenseUrl || !asset.sourceUrl)) errors.push(`incomplete media credits: ${mediaKey}`);
});

const countBy = (values: string[]) => values.reduce((counts, value) => ({ ...counts, [value]: (counts[value] ?? 0) + 1 }), {} as Record<string, number>);

const difficulty = QUESTIONS_DB.reduce((counts, question) => ({ ...counts, [question.difficulty]: (counts[question.difficulty] ?? 0) + 1 }), {} as Record<string, number>);
const modes = countBy(QUESTIONS_DB.map((question) => question.mode));
const categories = countBy(QUESTIONS_DB.map((question) => question.category ?? 'unknown'));
const visualCount = QUESTIONS_DB.filter((question) => question.visualType === 'image').length;
const uniqueVisualSubjects = new Set(QUESTIONS_DB.filter((question) => question.visualType === 'image').map((question) => question.subjectKey)).size;
const uniqueSubjects = new Set(QUESTIONS_DB.map((question) => question.subjectKey)).size;
if (QUESTIONS_DB.length < 200) errors.push(`question pool too small: ${QUESTIONS_DB.length}`);
if (QUESTIONS_DB.filter((question) => question.mode === 'rush').length < 100) errors.push('dedicated Rush pool is below 100');
if ((difficulty.easy ?? 0) / QUESTIONS_DB.length > 0.5) warnings.push('difficulty balance: Easy questions exceed 50%');
if (((difficulty.hard ?? 0) + (difficulty.sigma ?? 0)) / QUESTIONS_DB.length < 0.15) warnings.push('difficulty balance: Hard + Sigma questions are below 15%');
const rushQuestions = QUESTIONS_DB.filter((question) => question.mode === 'rush');
const rushVocabulary = rushQuestions.filter((question) => /what does|what is|what do/i.test(question.question)).length;
if (rushQuestions.length > 0 && rushVocabulary / rushQuestions.length > 0.7) warnings.push('Rush variety: vocabulary-style prompts dominate the pool');
if (warnings.length > 0) console.warn(`data validation warnings: ${warnings.length}\n${warnings.slice(0, 20).join('\n')}`);
console.log(`validated ${QUESTIONS_DB.length} questions`, { contentVersion: QUESTION_DATABASE_VERSION, modes, difficulty, categories, visualCount, uniqueVisualSubjects, uniqueSubjects, archiveEntries: ARCHIVE_ENTRIES.length, mediaAssets: Object.keys(LOCAL_MEDIA).length });
if (errors.length > 0) {
  console.error(`data validation failed: ${errors.length}\n${errors.join('\n')}`);
  process.exit(1);
}
console.log('question data: PASS');
