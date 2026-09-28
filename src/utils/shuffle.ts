import { Question } from '../types';

export type RandomSource = () => number;

export function fisherYates<T>(items: T[], random: RandomSource = Math.random): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function shuffleQuestion(question: Question, random: RandomSource = Math.random): Question {
  const correctOptionText = question.options[question.correctAnswer];
  const shuffledOptions = fisherYates(question.options, random);
  const newCorrectIndex = shuffledOptions.indexOf(correctOptionText);

  return {
    ...question,
    options: shuffledOptions,
    correctAnswer: newCorrectIndex >= 0 ? newCorrectIndex : 0,
  };
}

interface PrepareOptions {
  limit?: number;
  recentIds?: string[];
  random?: RandomSource;
  avoidSubjects?: string[];
  uniqueSubjects?: boolean;
  balance?: 'mix' | 'image';
}

type MixTrait = 'italian' | 'current' | 'classic' | 'gaming' | 'platform' | 'slang' | 'visual' | 'wildcard';
type ImageTrait = 'italian' | 'classic' | 'nostalgia' | 'gaming' | 'viral' | 'platform' | 'wildcard';

const MIX_TARGETS: Record<MixTrait, number> = {
  italian: 1,
  current: 2,
  classic: 2,
  gaming: 1,
  platform: 1,
  slang: 1,
  visual: 1,
  wildcard: 1,
};

function getMixTraits(question: Question): MixTrait[] {
  const category = question.category;
  const traits = new Set<MixTrait>();

  if (category === 'italian_brainrot' || question.era === 'italian_brainrot') traits.add('italian');
  if (category === 'classic_memes' || category === 'meme_formats' || category === 'reaction_memes' || question.era === 'classic' || question.era === 'early_web') traits.add('classic');
  if (category === 'gaming_culture') traits.add('gaming');
  if (category === 'social_media' || category === 'internet_history' || category === 'internet_tech' || category === 'youtube' || category === 'streaming' || category === 'creator_culture') traits.add('platform');
  if (category === 'slang' || category === 'internet_slang') traits.add('slang');
  if (question.visualType === 'image' || question.visualType === 'emoji' || category === 'emoji') traits.add('visual');
  if (category === 'modern' || category === 'modern_memes' || question.era === 'current' || question.era === '2025' || question.era === '2026' || question.freshness === 'current') traits.add('current');
  if (traits.size === 0) traits.add('wildcard');
  return [...traits];
}

function getImageTrait(question: Question): ImageTrait {
  switch (question.category) {
    case 'italian_brainrot': return 'italian';
    case 'classic_memes':
    case 'meme_formats':
    case 'reaction_memes': return 'classic';
    case 'digital_nostalgia': return 'nostalgia';
    case 'gaming_culture': return 'gaming';
    case 'viral_videos': return 'viral';
    case 'social_media':
    case 'internet_history':
    case 'internet_tech':
    case 'youtube':
    case 'streaming':
    case 'creator_culture': return 'platform';
    default: return 'wildcard';
  }
}

function difficultyTarget(index: number, total: number): Question['difficulty'][] {
  const ratio = total <= 1 ? 0 : index / (total - 1);
  if (ratio < 0.2) return ['easy', 'medium'];
  if (ratio < 0.6) return ['medium', 'easy', 'hard'];
  if (ratio < 0.9) return ['medium', 'hard', 'sigma'];
  return ['hard', 'sigma', 'medium'];
}

/**
 * Builds a session by balancing recency, subject reuse, category variety and
 * a readable difficulty curve. It still has a random tie-breaker, so replay
 * does not feel like the same list with the options moved around.
 */
export function prepareQuizQuestions(questions: Question[], options: PrepareOptions = {}): Question[] {
  const random = options.random ?? Math.random;
  const limit = Math.min(options.limit ?? questions.length, questions.length);
  const recentRank = new Map((options.recentIds ?? []).map((id, index) => [id, index]));
  const remaining = [...questions];
  const selected: Question[] = [];
  const categoryCounts = new Map<string, number>();
  const eraCounts = new Map<string, number>();
  const mixTraitCounts = new Map<MixTrait, number>();
  const imageTraitCounts = new Map<ImageTrait, number>();
  const subjectCounts = new Map<string, number>();
  const avoidSubjects = new Set(options.avoidSubjects ?? []);

  while (selected.length < limit && remaining.length > 0) {
    const targetDifficulties = difficultyTarget(selected.length, limit);
    const candidates = remaining.filter((question) => {
      const subject = question.subjectKey ?? question.visualContent ?? question.id;
      const lastSubject = selected[selected.length - 1]?.subjectKey ?? selected[selected.length - 1]?.visualContent;
      return subject !== lastSubject || remaining.length === 1;
    });
    const availableSubjects = new Set(remaining.map((question) => question.subjectKey ?? question.visualContent ?? question.id));
    const unseenSubjectCandidates = candidates.filter((question) => !subjectCounts.has(question.subjectKey ?? question.visualContent ?? question.id));
    const canKeepSubjectsUnique = options.uniqueSubjects && availableSubjects.size >= limit - selected.length;
    const pool = canKeepSubjectsUnique && unseenSubjectCandidates.length > 0
      ? unseenSubjectCandidates
      : candidates.length > 0 ? candidates : remaining;

    const scored = pool.map((question) => {
      const category = question.category ?? question.mode;
      const subject = question.subjectKey ?? question.visualContent ?? question.id;
      const recent = recentRank.get(question.id);
      const recencyPenalty = recent === undefined ? 0 : 45 + Math.max(0, 100 - recent);
      const categoryCount = categoryCounts.get(category) ?? 0;
      const categoryPenalty = categoryCount * 55 + (options.balance === 'mix' && categoryCount >= 2 ? 110 : 0);
      const subjectPenalty = (subjectCounts.get(subject) ?? 0) * 90;
      const avoidPenalty = avoidSubjects.has(subject) ? 120 : 0;
      const difficultyPenalty = targetDifficulties.includes(question.difficulty) ? 0 : 30;
      const era = question.era ?? 'unknown';
      const eraCount = eraCounts.get(era) ?? 0;
      const eraPenalty = options.balance === 'mix' && eraCount >= 3 ? 120 + eraCount * 20 : 0;
      const imageTrait = getImageTrait(question);
      const imageTraitCount = imageTraitCounts.get(imageTrait) ?? 0;
      const imageCategoryPenalty = options.balance === 'image'
        ? imageTraitCount * 70 + (imageTraitCount >= 4 ? 140 : 0)
        : 0;
      const imageEraPenalty = options.balance === 'image' && eraCount >= 4 ? 100 + eraCount * 20 : 0;
      const mixPenalty = options.balance === 'mix'
        ? getMixTraits(question).reduce((penalty, trait) => {
          const traitCount = mixTraitCounts.get(trait) ?? 0;
          return penalty + (traitCount >= MIX_TARGETS[trait] ? 95 + traitCount * 20 : 0);
        }, 0)
        : 0;
      return { question, score: recencyPenalty + categoryPenalty + subjectPenalty + avoidPenalty + difficultyPenalty + eraPenalty + imageCategoryPenalty + imageEraPenalty + mixPenalty + random() * 18 };
    });

    scored.sort((a, b) => a.score - b.score);
    const chosen = scored[0].question;
    const index = remaining.indexOf(chosen);
    remaining.splice(index, 1);
    selected.push(shuffleQuestion(chosen, random));
    const category = chosen.category ?? chosen.mode;
    const subject = chosen.subjectKey ?? chosen.visualContent ?? chosen.id;
    const era = chosen.era ?? 'unknown';
    categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
    subjectCounts.set(subject, (subjectCounts.get(subject) ?? 0) + 1);
    eraCounts.set(era, (eraCounts.get(era) ?? 0) + 1);
    getMixTraits(chosen).forEach((trait) => mixTraitCounts.set(trait, (mixTraitCounts.get(trait) ?? 0) + 1));
    const imageTrait = getImageTrait(chosen);
    imageTraitCounts.set(imageTrait, (imageTraitCounts.get(imageTrait) ?? 0) + 1);
  }

  return selected;
}

export function buildChallengeQuestions(questions: Question[], random: RandomSource = Math.random): Question[] {
  const targets = [2, 2, 2, 2, 2, 1];
  const selected: Question[] = [];
  const used = new Set<string>();

  targets.forEach((target, index) => {
    const wave = index + 1;
    const wavePool = questions.filter((question) => (question.challengeWave ?? inferChallengeWave(question)) === wave && !used.has(question.id));
    const fallback = questions.filter((question) => !used.has(question.id) && question.difficulty !== 'easy');
    const picked = prepareQuizQuestions(wavePool.length >= target ? wavePool : fallback, { limit: target, uniqueSubjects: true, random });
    picked.forEach((question) => {
      used.add(question.id);
      selected.push({ ...question, challengeWave: wave });
    });
  });

  return selected;
}

function inferChallengeWave(question: Question): number {
  const match = question.id.match(/(?:chg|challenge)[_-]?(\d+)/i);
  if (!match) return question.difficulty === 'sigma' ? 6 : question.difficulty === 'hard' ? 4 : 2;
  return Math.min(6, Number(match[1]));
}

export function appendRecentQuestionIds(existing: string[], questions: Question[], max = 100): string[] {
  const ids = [...questions.map((question) => question.id), ...existing];
  return [...new Set(ids)].slice(0, max);
}
