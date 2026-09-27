import { strict as assert } from 'node:assert';
import { QUESTIONS_DB } from '../src/data/questions';
import { getDailyChallengeNumber, getDailyQuestions } from '../src/utils/daily';
import { evaluateAchievementConditions, evaluateAchievements, evaluateTitles } from '../src/utils/progression';
import { buildChallengeQuestions, fisherYates, prepareQuizQuestions, shuffleQuestion } from '../src/utils/shuffle';
import { calculateNormalScore, calculateRushScore } from '../src/utils/scoring';
import { INITIAL_USER_STATS, buyStreakFreeze, claimDailyReward, evaluateStreakState, recordGameCompletion } from '../src/utils/storage';

const date = new Date('2026-09-27T12:00:00');
const stats = (overrides: Partial<typeof INITIAL_USER_STATS> = {}) => ({ ...INITIAL_USER_STATS, ...overrides });

assert.equal(evaluateStreakState(stats(), date).stats.streak, 0);
const firstDaily = recordGameCompletion(stats(), 10, 0, 100, 'daily', 10, false, {}, false, date);
assert.equal(firstDaily.updatedStats.streak, 1);
assert.equal(firstDaily.updatedStats.rewardCycle.completedDays, 1);
const consecutive = recordGameCompletion({ ...firstDaily.updatedStats, lastDailyCompletedDate: '2026-09-26' }, 10, 0, 100, 'daily', 10, false, {}, false, date);
assert.equal(consecutive.updatedStats.streak, 2);
const replay = recordGameCompletion(consecutive.updatedStats, 10, 0, 100, 'daily', 10, false, {}, false, date);
assert.equal(replay.updatedStats.streak, 2);
assert.equal(replay.updatedStats.rewardCycle.completedDays, 2);

const protectedOne = recordGameCompletion(stats({ streak: 8, lastDailyCompletedDate: '2026-09-25', streakFreezes: 1 }), 10, 0, 100, 'daily', 10, false, {}, false, date);
assert.equal(protectedOne.updatedStats.streak, 9);
assert.equal(protectedOne.usedFreeze, 1);
const protectedTwo = recordGameCompletion(stats({ streak: 8, lastDailyCompletedDate: '2026-09-24', streakFreezes: 2 }), 10, 0, 100, 'daily', 10, false, {}, false, date);
assert.equal(protectedTwo.updatedStats.streak, 9);
assert.equal(protectedTwo.usedFreeze, 2);
const partialProtection = recordGameCompletion(stats({ streak: 8, lastDailyCompletedDate: '2026-09-24', streakFreezes: 1 }), 10, 0, 100, 'daily', 10, false, {}, false, date);
assert.equal(partialProtection.updatedStats.streak, 1);
assert.equal(partialProtection.updatedStats.rewardCycle.completedDays, 1);
const expired = evaluateStreakState(stats({ streak: 8, lastDailyCompletedDate: '2026-09-01', streakFreezes: 0, rewardCycle: { cycleStartDate: '2026-08-26', cycleNumber: 2, completedDays: 5, claimedDays: [] } }), date);
assert.equal(expired.status, 'expired');
assert.equal(expired.stats.rewardCycle.completedDays, 0);
assert.equal(evaluateStreakState(stats({ streak: 8, lastDailyCompletedDate: '2026-09-25', streakFreezes: 1 }), date).status, 'protected');
assert.equal(buyStreakFreeze(stats({ streakFreezes: 3, auraPoints: 9999 })).ok, false);

const dailyA = getDailyQuestions(QUESTIONS_DB, date);
const dailyB = getDailyQuestions(QUESTIONS_DB, date);
assert.equal(dailyA.length, 10);
assert.deepEqual(dailyA.map((question) => question.id), dailyB.map((question) => question.id));
assert.equal(getDailyChallengeNumber(date), getDailyChallengeNumber(date));
const sample = QUESTIONS_DB[0];
const shuffled = shuffleQuestion(sample, () => 0.1);
assert.equal(shuffled.options[shuffled.correctAnswer], sample.options[sample.correctAnswer]);
assert.deepEqual(fisherYates([1, 2, 3], () => 0), [2, 3, 1]);
const prepared = prepareQuizQuestions(QUESTIONS_DB.filter((question) => question.category === 'italian_brainrot'), { limit: 10, random: () => 0.4 });
assert.equal(new Set(prepared.map((question) => question.subjectKey)).size, prepared.length);
const challenge = buildChallengeQuestions(QUESTIONS_DB.filter((question) => question.mode === 'challenge'), () => 0.42);
assert.deepEqual(challenge.map((question) => question.challengeWave), [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6]);

assert.equal(calculateRushScore('easy', 1, 500, true), 175);
assert.equal(calculateRushScore('hard', 5, 1500, true), 338);
assert.equal(calculateRushScore('easy', 5, 500, false), 0);
assert.equal(calculateNormalScore(10, true), 325);
const earned = evaluateAchievements(stats({ quizzesCompleted: 1 }), undefined);
assert(earned.includes('first-rot'));
assert(evaluateAchievements(stats({ unlockedAchievements: ['perfect-rot'] }), undefined).includes('perfect-rot'));
const loss = recordGameCompletion(stats(), 9, 1, 100, 'challenge', 6, false, {}, false, date);
assert.equal(loss.updatedStats.finalBossWins, 0);
const win = recordGameCompletion(stats(), 11, 0, 100, 'challenge', 6, false, {}, true, date);
assert.equal(win.updatedStats.challengeWins, 1);
assert.equal(win.updatedStats.finalBossWins, 1);
assert(evaluateAchievementConditions(win.updatedStats).includes('final-boss'));
assert(evaluateTitles(win.updatedStats).includes('Brainrot NPC'));
const claimed = claimDailyReward({ ...win.updatedStats, rewardCycle: { ...win.updatedStats.rewardCycle, completedDays: 1 } }, 1);
assert.equal(claimDailyReward(claimed.updatedStats, 1).rewardText, 'Already claimed!');

console.log('core tests: PASS');
