import { Question } from '../types';

export function getDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getNextDailyLabel(date = new Date()): string {
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getDateKey(tomorrow);
}

/** A small deterministic PRNG. The same local date always gives the same set. */
export function seededRandom(seedText: string): () => number {
  let seed = 2166136261;
  for (let index = 0; index < seedText.length; index += 1) {
    seed ^= seedText.charCodeAt(index);
    seed = Math.imul(seed, 16777619);
  }

  return () => {
    seed += 0x6d2b79f5;
    let value = seed;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function getDailyQuestions(questions: Question[], date = new Date()): Question[] {
  const eligible = questions.filter((question) =>
    question.eligibleForDaily !== false &&
    question.mode !== 'rush' &&
    question.mode !== 'challenge' &&
    question.mode !== 'daily'
  );

  if (eligible.length === 0) return questions.slice(0, 5);

  const random = seededRandom(getDateKey(date));
  const pool = [...eligible];
  const selected: Question[] = [];

  // Prefer five different formats, with a visual clue whenever one exists.
  const preferredModes = ['image', 'emoji', 'slang', 'voice', 'sound'] as const;
  for (const mode of preferredModes) {
    const candidates = pool.filter((question) => question.mode === mode);
    if (candidates.length === 0) continue;
    const candidate = candidates[Math.floor(random() * candidates.length)];
    selected.push(candidate);
    pool.splice(pool.indexOf(candidate), 1);
    if (selected.length === 5) break;
  }

  while (selected.length < 5 && pool.length > 0) {
    const candidate = pool.splice(Math.floor(random() * pool.length), 1)[0];
    if (!selected.some((question) => question.id === candidate.id)) selected.push(candidate);
  }

  return selected.slice(0, 5);
}
