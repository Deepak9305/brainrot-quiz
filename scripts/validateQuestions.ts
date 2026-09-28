import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { QUESTIONS_DB, QUESTION_DATABASE_VERSION } from '../src/data/questions';
import { LOCAL_MEDIA, getLocalMediaAsset } from '../src/data/media';
import { ARCHIVE_ENTRIES } from '../src/data/archive';

const validModes = new Set(['mix', 'image', 'emoji', 'slang', 'sound', 'voice', 'rush', 'daily', 'challenge']);
const validCategories = new Set([
  'modern', 'modern_memes', 'italian_brainrot', 'slang', 'internet_slang', 'classic_memes',
  'meme_formats', 'reaction_memes', 'emoji', 'quote', 'sound', 'social_media', 'internet_history',
  'internet_tech', 'gaming_culture', 'youtube', 'streaming', 'creator_culture', 'viral_videos',
  'digital_nostalgia', 'challenge', 'rush',
]);
const validEras = new Set([
  'classic', 'early_web', '1990s', '2000s', 'early_2000s', 'mid_2000s', 'late_2000s',
  'early_2010s', 'mid_2010s', 'late_2010s', 'early_2020s', '2025', '2026', 'italian_brainrot', 'current',
]);
const validFreshness = new Set(['evergreen', 'current', 'seasonal']);
const validQuestionTypes = new Set(['standard', 'image_identification', 'image_crop', 'image_detail', 'silhouette', 'emoji_decode', 'sound_recreation', 'quote_identification', 'complete_phrase', 'origin', 'true_or_cap', 'odd_one_out', 'platform_matching', 'timeline', 'meme_evolution', 'format_recognition']);
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
  if (!question.era || !validEras.has(question.era)) errors.push(`${question.id}: invalid era`);
  if (question.questionType && !validQuestionTypes.has(question.questionType)) errors.push(`${question.id}: invalid question type`);
  if (question.topic !== undefined && !question.topic.trim()) errors.push(`${question.id}: empty topic`);
  if (question.freshness !== undefined && !validFreshness.has(question.freshness)) errors.push(`${question.id}: invalid freshness`);
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
const eras = countBy(QUESTIONS_DB.map((question) => question.era ?? 'unknown'));
const topics = countBy(QUESTIONS_DB.map((question) => question.topic ?? 'untagged'));
const questionTypes = countBy(QUESTIONS_DB.map((question) => question.questionType ?? 'standard'));
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
const generalPool = QUESTIONS_DB.filter((question) => !['rush', 'daily', 'challenge'].includes(question.mode));
const generalCategoryCount = (names: string[]) => generalPool.filter((question) => names.includes(question.category ?? '')).length;
const generalItalianShare = generalCategoryCount(['italian_brainrot']) / Math.max(generalPool.length, 1);
const generalSlangShare = generalCategoryCount(['slang', 'internet_slang']) / Math.max(generalPool.length, 1);
const generalClassicShare = generalCategoryCount(['classic_memes', 'meme_formats', 'reaction_memes']) / Math.max(generalPool.length, 1);
const generalGamingShare = generalCategoryCount(['gaming_culture']) / Math.max(generalPool.length, 1);
const generalPlatformShare = generalCategoryCount(['social_media', 'internet_history', 'internet_tech']) / Math.max(generalPool.length, 1);
if (generalItalianShare > 0.2) warnings.push(`breadth balance: Italian Brainrot is ${(generalItalianShare * 100).toFixed(1)}% of the general pool`);
if (generalSlangShare > 0.25) warnings.push(`breadth balance: slang is ${(generalSlangShare * 100).toFixed(1)}% of the general pool`);
const systemTopicLabels = new Set([...validCategories, 'image', 'emoji', 'slang', 'sound', 'voice', 'daily', 'challenge']);
Object.entries(topics).filter(([topic]) => !systemTopicLabels.has(topic)).forEach(([topic, count]) => {
  const share = count / Math.max(QUESTIONS_DB.length, 1);
  if (share > 0.15) warnings.push(`breadth balance: topic ${topic} is ${(share * 100).toFixed(1)}% of the full pool`);
});
if (generalClassicShare < 0.1) warnings.push(`breadth balance: classic/format/reaction content is ${(generalClassicShare * 100).toFixed(1)}% of the general pool`);
if (generalGamingShare < 0.05) warnings.push(`breadth balance: gaming content is ${(generalGamingShare * 100).toFixed(1)}% of the general pool`);
if (generalPlatformShare < 0.05) warnings.push(`breadth balance: platform/history content is ${(generalPlatformShare * 100).toFixed(1)}% of the general pool`);
const subjectCounts = countBy(QUESTIONS_DB.map((question) => question.subjectKey ?? question.id));
Object.entries(subjectCounts).forEach(([subject, count]) => {
  if (count > 4) warnings.push(`duplicate concept: ${subject} appears in ${count} questions`);
});
if (warnings.length > 0) console.warn(`data validation warnings: ${warnings.length}\n${warnings.slice(0, 20).join('\n')}`);
console.log(`validated ${QUESTIONS_DB.length} questions`, { contentVersion: QUESTION_DATABASE_VERSION, modes, difficulty, categories, eras, questionTypes, visualCount, uniqueVisualSubjects, uniqueSubjects, archiveEntries: ARCHIVE_ENTRIES.length, mediaAssets: Object.keys(LOCAL_MEDIA).length });
if (errors.length > 0) {
  console.error(`data validation failed: ${errors.length}\n${errors.join('\n')}`);
  process.exit(1);
}
console.log('question data: PASS');
