import { QUESTIONS_DB, QUESTION_DATABASE_VERSION } from '../src/data/questions';

const countBy = (values: string[]) => values.reduce((counts, value) => {
  counts[value] = (counts[value] ?? 0) + 1;
  return counts;
}, {} as Record<string, number>);

const topEntries = (counts: Record<string, number>, limit = 20) => Object.entries(counts)
  .sort(([, left], [, right]) => right - left)
  .slice(0, limit);

const printSection = (title: string, entries: [string, number][]) => {
  console.log(`\n${title}`);
  entries.forEach(([label, count]) => console.log(`  ${String(count).padStart(3, ' ')}  ${label}`));
};

const categories = countBy(QUESTIONS_DB.map((question) => question.category ?? 'unknown'));
const eras = countBy(QUESTIONS_DB.map((question) => question.era ?? 'unknown'));
const types = countBy(QUESTIONS_DB.map((question) => question.questionType ?? 'standard'));
const difficulties = countBy(QUESTIONS_DB.map((question) => question.difficulty));
const topics = countBy(QUESTIONS_DB.map((question) => question.topic ?? 'untagged'));
const subjects = countBy(QUESTIONS_DB.map((question) => question.subjectKey ?? question.id));
const visualSubjects = new Set(QUESTIONS_DB.filter((question) => question.visualType === 'image' || question.visualType === 'emoji').map((question) => question.subjectKey ?? question.id));

console.log(`BRAINROT QUIZ CONTENT REPORT · v${QUESTION_DATABASE_VERSION}`);
console.log(`Total questions: ${QUESTIONS_DB.length}`);
console.log(`Visual subjects: ${visualSubjects.size}`);

printSection('By category', topEntries(categories, Object.keys(categories).length));
printSection('By era', topEntries(eras, Object.keys(eras).length));
printSection('By question type', topEntries(types, Object.keys(types).length));
printSection('By difficulty', topEntries(difficulties, Object.keys(difficulties).length));
const systemTopicLabels = new Set(['modern', 'modern_memes', 'italian_brainrot', 'slang', 'internet_slang', 'classic_memes', 'meme_formats', 'reaction_memes', 'emoji', 'quote', 'sound', 'social_media', 'internet_history', 'internet_tech', 'gaming_culture', 'youtube', 'streaming', 'creator_culture', 'viral_videos', 'digital_nostalgia', 'challenge', 'rush', 'image', 'voice', 'daily']);
printSection('Top editorial topics', topEntries(Object.fromEntries(Object.entries(topics).filter(([topic]) => !systemTopicLabels.has(topic))), 20));
printSection('Top subjects / concept reuse', topEntries(subjects, 20));
