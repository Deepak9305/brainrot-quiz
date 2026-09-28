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

export function getDailyChallengeNumber(date = new Date()): number {
  const epoch = new Date('2025-01-01T00:00:00');
  const current = new Date(`${getDateKey(date)}T00:00:00`);
  return Math.max(1, Math.floor((current.getTime() - epoch.getTime()) / 86_400_000) + 1);
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
    question.mode !== 'daily' &&
    question.mode !== 'sound' &&
    question.mode !== 'voice'
  );

  if (eligible.length === 0) return questions.slice(0, 5);

  const random = seededRandom(`daily:${getDateKey(date)}`);
  const pool = [...eligible];
  const selected: Question[] = [];

  const pick = (predicate: (question: Question) => boolean): Question | undefined => {
    const candidates = pool.filter((question) => predicate(question) && !selected.some((picked) => picked.subjectKey && picked.subjectKey === question.subjectKey));
    if (candidates.length === 0) return undefined;
    const candidate = candidates[Math.floor(random() * candidates.length)];
    selected.push(candidate);
    pool.splice(pool.indexOf(candidate), 1);
    return candidate;
  };

  // Every Daily run is playable with sound disabled and has a broad editorial
  // shape: visual, classic, current, language, gaming/creator, platform/history,
  // then four balanced wildcards. Italian Brainrot can appear as one visual or
  // wildcard pick, but it is never the Daily's editorial anchor anymore.
  pick((question) => question.visualType === 'image' || question.visualType === 'emoji');
  pick((question) => ['classic_memes', 'meme_formats', 'reaction_memes'].includes(question.category ?? '') || question.era === 'classic' || question.era === 'early_web');
  pick((question) => question.category === 'modern_memes' || question.category === 'modern' || question.freshness === 'current' || ['current', '2025', '2026'].includes(question.era ?? ''));
  pick((question) => question.category === 'slang' || question.category === 'internet_slang' || question.mode === 'slang');
  pick((question) => question.category === 'gaming_culture' || question.category === 'youtube' || question.category === 'streaming' || question.category === 'creator_culture');
  pick((question) => question.category === 'social_media' || question.category === 'internet_history' || question.category === 'internet_tech');

  while (selected.length < 10 && pool.length > 0) {
    const unseenSubjects = pool.filter((question) => !selected.some((picked) => picked.subjectKey && picked.subjectKey === question.subjectKey));
    const italianCount = selected.filter((question) => question.category === 'italian_brainrot' || question.era === 'italian_brainrot').length;
    const nonItalianUnseen = unseenSubjects.filter((question) => question.category !== 'italian_brainrot' && question.era !== 'italian_brainrot');
    const diversityPool = italianCount >= 1 && nonItalianUnseen.length >= 10 - selected.length ? nonItalianUnseen : unseenSubjects;
    const candidatePool = diversityPool.length >= 10 - selected.length ? diversityPool : pool;
    const candidate = candidatePool[Math.floor(random() * candidatePool.length)];
    pool.splice(pool.indexOf(candidate), 1);
    if (!selected.some((question) => question.id === candidate.id)) selected.push(candidate);
  }

  return selected.slice(0, 10);
}
