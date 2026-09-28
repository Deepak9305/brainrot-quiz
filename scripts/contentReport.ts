import { QUESTIONS_DB, QUESTION_DATABASE_VERSION } from '../src/data/questions';
import { LOCAL_MEDIA } from '../src/data/media';

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
const imageQuestions = QUESTIONS_DB.filter((question) => question.visualType === 'image');
const imageSubjects = new Set(imageQuestions.map((question) => question.subjectKey ?? question.id));
const imageCategories = countBy(imageQuestions.map((question) => question.category ?? 'unknown'));
const imageEras = countBy([...new Set(imageQuestions.map((question) => `${question.era ?? 'unknown'}:${question.subjectKey ?? question.id}`))].map((key) => key.split(':')[0]));
const mediaTypes = countBy(Object.values(LOCAL_MEDIA).map((asset) => asset.assetType));
const challengeQuestions = QUESTIONS_DB.filter((question) => question.mode === 'challenge');

console.log(`BRAINROT QUIZ CONTENT REPORT · v${QUESTION_DATABASE_VERSION}`);
console.log(`Total questions: ${QUESTIONS_DB.length}`);
console.log(`Visual subjects: ${visualSubjects.size}`);
console.log(`Image questions: ${imageQuestions.length}`);
console.log(`Image subjects: ${imageSubjects.size}`);

printSection('By category', topEntries(categories, Object.keys(categories).length));
printSection('By era', topEntries(eras, Object.keys(eras).length));
printSection('By question type', topEntries(types, Object.keys(types).length));
printSection('By difficulty', topEntries(difficulties, Object.keys(difficulties).length));
printSection('Image questions by category', topEntries(imageCategories, Object.keys(imageCategories).length));
printSection('Image subjects by era', topEntries(imageEras, Object.keys(imageEras).length));
printSection('Local media by asset type', topEntries(mediaTypes, Object.keys(mediaTypes).length));
console.log('\nACTIVE CHALLENGE QUESTIONS');
for (let wave = 1; wave <= 6; wave += 1) {
  const waveQuestions = challengeQuestions.filter((question) => question.challengeWave === wave);
  const waveDifficulties = Object.entries(countBy(waveQuestions.map((question) => question.difficulty)))
    .map(([difficulty, count]) => `${difficulty}:${count}`).join(', ');
  const waveCategories = [...new Set(waveQuestions.map((question) => question.category ?? 'unknown'))].join(', ');
  const waveTypes = [...new Set(waveQuestions.map((question) => question.questionType ?? 'standard'))].join(', ');
  console.log(`  ${wave === 6 ? 'Final Boss' : `Wave ${wave}`}: ${waveQuestions.length} candidates | ${waveDifficulties || 'none'} | categories: ${waveCategories || 'none'} | types: ${waveTypes || 'none'}`);
}
const repeatedChallengeSubjects = Object.entries(countBy(challengeQuestions.map((question) => question.subjectKey ?? question.id)))
  .filter(([, count]) => count > 1);
console.log(`  Final Boss pool: ${challengeQuestions.filter((question) => question.challengeWave === 6).length} candidates`);
console.log(`  Reused Challenge subjects: ${repeatedChallengeSubjects.length ? repeatedChallengeSubjects.map(([subject, count]) => `${subject}:${count}`).join(', ') : 'none'}`);
const systemTopicLabels = new Set(['modern', 'modern_memes', 'italian_brainrot', 'slang', 'internet_slang', 'classic_memes', 'meme_formats', 'reaction_memes', 'emoji', 'quote', 'sound', 'social_media', 'internet_history', 'internet_tech', 'gaming_culture', 'youtube', 'streaming', 'creator_culture', 'viral_videos', 'digital_nostalgia', 'challenge', 'rush', 'image', 'voice', 'daily']);
printSection('Top editorial topics', topEntries(Object.fromEntries(Object.entries(topics).filter(([topic]) => !systemTopicLabels.has(topic))), 20));
printSection('Top subjects / concept reuse', topEntries(subjects, 20));
