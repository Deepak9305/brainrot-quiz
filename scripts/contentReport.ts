import { QUESTIONS_DB, QUESTION_DATABASE_VERSION } from '../src/data/questions';
import { LOCAL_MEDIA } from '../src/data/media';
import { TEXT_VISUAL_QUESTIONS } from '../src/data/textVisualQuestions';
import { REJECTED_VISUAL_CANDIDATES, VISUAL_CANDIDATE_MANIFEST } from '../src/data/visualCandidates';

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
const imageQuestions = QUESTIONS_DB.filter((question) => question.mode === 'image' && question.visualType === 'image');
const textVisualQuestions = TEXT_VISUAL_QUESTIONS.filter((question) => question.mode === 'image' && question.visualType === 'ascii');
const visualSubjects = new Set(imageQuestions.map((question) => question.subjectKey ?? question.id));
const visualSubjectMetadata = [...new Map(imageQuestions.map((question) => [question.subjectKey ?? question.id, question])).values()];
const visualCategories = countBy(visualSubjectMetadata.map((question) => question.category ?? 'unknown'));
const visualEras = countBy(visualSubjectMetadata.map((question) => question.era ?? 'unknown'));
const visualLicenses = countBy(visualSubjectMetadata.map((question) => LOCAL_MEDIA[question.visualContent ?? '']?.licenseName ?? 'unknown'));
const repeatedImageSubjects = Object.entries(countBy(imageQuestions.map((question) => question.subjectKey ?? question.id)))
  .filter(([, count]) => count > 1);
const mediaTypes = countBy(Object.values(LOCAL_MEDIA).map((asset) => asset.assetType));
const challengeQuestions = QUESTIONS_DB.filter((question) => question.mode === 'challenge');
const bundledImageCandidates = VISUAL_CANDIDATE_MANIFEST.filter((candidate) => candidate.status === 'added' && Boolean(candidate.mediaKey));
const textOnlyCandidates = VISUAL_CANDIDATE_MANIFEST.filter((candidate) => candidate.status === 'added' && !candidate.mediaKey);

console.log(`BRAINROT QUIZ CONTENT REPORT · v${QUESTION_DATABASE_VERSION}`);
console.log(`Total questions: ${QUESTIONS_DB.length}`);
console.log(`Visual subjects: ${visualSubjects.size}`);
console.log(`Binary image questions: ${imageQuestions.length}`);
console.log(`Text/ASCII visual subjects (inactive): ${new Set(textVisualQuestions.map((question) => question.subjectKey ?? question.id)).size}`);

console.log('\nVISUAL MODE');
console.log(`  TOTAL VISUAL SUBJECTS: ${visualSubjects.size}`);
console.log(`  TOTAL VISUAL QUESTIONS: ${imageQuestions.length}`);
const italianVisualSubjects = visualSubjectMetadata.filter((question) => question.category === 'italian_brainrot').length;
console.log(`  ITALIAN BRAINROT PERCENT: ${((italianVisualSubjects / Math.max(visualSubjects.size, 1)) * 100).toFixed(1)}%`);
console.log(`  NON-BRAINROT PERCENT: ${(((visualSubjects.size - italianVisualSubjects) / Math.max(visualSubjects.size, 1)) * 100).toFixed(1)}%`);
printSection('  Visual subjects by category', topEntries(visualCategories, Object.keys(visualCategories).length));
printSection('  Visual subjects by era', topEntries(visualEras, Object.keys(visualEras).length));
printSection('  Visual subjects by license', topEntries(visualLicenses, Object.keys(visualLicenses).length));
console.log(`  Repeated image subjects: ${repeatedImageSubjects.length ? repeatedImageSubjects.map(([subject, count]) => `${subject}:${count}`).join(', ') : 'none'}`);
console.log(`  Candidate manifest: ${VISUAL_CANDIDATE_MANIFEST.length} candidates | bundled image candidates: ${bundledImageCandidates.length} | text-only candidates: ${textOnlyCandidates.length} | rejected: ${REJECTED_VISUAL_CANDIDATES.length}`);
const rejectionReasons = countBy(REJECTED_VISUAL_CANDIDATES.map((candidate) => candidate.rejectionReason ?? 'unspecified'));
printSection('  Top rejected-candidate reasons', topEntries(rejectionReasons, 8));

printSection('By category', topEntries(categories, Object.keys(categories).length));
printSection('By era', topEntries(eras, Object.keys(eras).length));
printSection('By question type', topEntries(types, Object.keys(types).length));
printSection('By difficulty', topEntries(difficulties, Object.keys(difficulties).length));
printSection('Active visual questions by type', topEntries(countBy(imageQuestions.map((question) => question.visualType ?? 'unknown')), 10));
printSection('Inactive text/ASCII visual subjects by category', topEntries(countBy(textVisualQuestions.map((question) => question.category ?? 'unknown')), 20));
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
const systemTopicLabels = new Set(['modern', 'modern_memes', 'italian_brainrot', 'slang', 'internet_slang', 'classic_memes', 'rage_comics', 'advice_animals', 'viral_internet', 'meme_formats', 'reaction_memes', 'emoji', 'quote', 'sound', 'social_media', 'internet_history', 'internet_tech', 'gaming_culture', 'youtube', 'streaming', 'creator_culture', 'viral_videos', 'digital_nostalgia', 'challenge', 'rush', 'image', 'voice', 'daily']);
printSection('Top editorial topics', topEntries(Object.fromEntries(Object.entries(topics).filter(([topic]) => !systemTopicLabels.has(topic))), 20));
printSection('Top subjects / concept reuse', topEntries(subjects, 20));
