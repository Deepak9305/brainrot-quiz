import { REJECTED_VISUAL_CANDIDATES, VISUAL_CANDIDATE_MANIFEST } from '../src/data/visualCandidates';

const countBy = (values: string[]) => values.reduce((counts, value) => {
  counts[value] = (counts[value] ?? 0) + 1;
  return counts;
}, {} as Record<string, number>);

const top = (counts: Record<string, number>) => Object.entries(counts).sort(([, left], [, right]) => right - left);

const statuses = countBy(VISUAL_CANDIDATE_MANIFEST.map((candidate) => candidate.status));
const categories = countBy(VISUAL_CANDIDATE_MANIFEST.filter((candidate) => candidate.status === 'added').map((candidate) => candidate.category));
const rejectionReasons = countBy(REJECTED_VISUAL_CANDIDATES.map((candidate) => candidate.rejectionReason ?? 'unspecified'));

console.log('BRAINROT QUIZ VISUAL CANDIDATE REPORT');
console.log(`Total candidates audited: ${VISUAL_CANDIDATE_MANIFEST.length}`);
console.log(`Added / verified visual subjects: ${statuses.added ?? 0}`);
console.log(`Rejected candidates: ${statuses.rejected ?? 0}`);
console.log(`Needs review: ${statuses.needs_review ?? 0}`);

console.log('\nADDED SUBJECTS BY CATEGORY');
top(categories).forEach(([category, count]) => console.log(`  ${String(count).padStart(3, ' ')}  ${category}`));

console.log('\nREJECTED CANDIDATES BY REASON');
top(rejectionReasons).forEach(([reason, count]) => console.log(`  ${String(count).padStart(3, ' ')}  ${reason}`));

console.log('\nREJECTED CANDIDATES');
REJECTED_VISUAL_CANDIDATES.forEach((candidate) => {
  console.log(`  - ${candidate.name} [${candidate.category}] — ${candidate.rejectionReason}`);
});
