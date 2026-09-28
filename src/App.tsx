import React, { useState, useEffect } from 'react';
import { GameMode, Question, QuizSessionState, UserStats } from './types';
import { QUESTIONS_DB } from './data/questions';
import { getLocalMediaAsset } from './data/media';
import { applyArchiveProgress, loadUserStats, saveUserStats, recordGameCompletion, evaluateStreakState } from './utils/storage';
import { soundManager } from './utils/audio';
import { appendRecentQuestionIds, buildChallengeQuestions, prepareQuizQuestions } from './utils/shuffle';
import { getDailyQuestions, getDateKey, seededRandom } from './utils/daily';
import { evaluateAchievements, evaluateTitles } from './utils/progression';
import { ACHIEVEMENT_DEFINITIONS } from './data/achievements';
import { ARCHIVE_ENTRIES } from './data/archive';
import { getThemeConfig } from './data/themes';
import { Header } from './components/Header';
import { BrainrotBackground } from './components/BrainrotBackground';
import { ModeSelector } from './components/ModeSelector';
import { QuizGame } from './components/QuizGame';
import { ResultsModal } from './components/ResultsModal';
import { StreakModal } from './components/StreakModal';
import { SoundboardDrawer } from './components/SoundboardDrawer';
import { CollectionModal } from './components/CollectionModal';

export default function App() {
  const [stats, setStats] = useState<UserStats>(() => {
    const loaded = loadUserStats();
    const evaluated = evaluateStreakState(loaded).stats;
    saveUserStats(evaluated);
    return evaluated;
  });
  const [activeMode, setActiveMode] = useState<GameMode | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [completedSession, setCompletedSession] = useState<QuizSessionState | null>(null);
  const [streakExtendedAlert, setStreakExtendedAlert] = useState<boolean>(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState<boolean>(false);
  const [isSoundboardOpen, setIsSoundboardOpen] = useState<boolean>(false);
  const [isCollectionOpen, setIsCollectionOpen] = useState<boolean>(false);
  const [isScreenShaking, setIsScreenShaking] = useState<boolean>(false);
  const [achievementToast, setAchievementToast] = useState<string | null>(null);
  const [archiveToast, setArchiveToast] = useState<string | null>(null);
  const theme = getThemeConfig(stats.equippedTheme);

  // Sync sound setting on mount
  useEffect(() => {
    soundManager.setMuted(!stats.soundEnabled);
  }, [stats.soundEnabled]);

  const handleUpdateStats = (newPartial: Partial<UserStats>) => {
    const updated = { ...stats, ...newPartial };
    setStats(updated);
    saveUserStats(updated);
  };

  const triggerScreenShake = () => {
    if (!stats.screenShakeEnabled) return;
    setIsScreenShaking(true);
    setTimeout(() => setIsScreenShaking(false), 280);
  };

  // Start selected mode
  const handleSelectMode = (mode: GameMode) => {
    let qList: Question[];
    let limit = 10;

    if (mode === 'daily') {
      qList = getDailyQuestions(QUESTIONS_DB);
      limit = 10;
    } else if (mode === 'rush') {
      qList = QUESTIONS_DB.filter((question) => question.eligibleForRush !== false && question.mode !== 'challenge' && question.mode !== 'daily' && question.mode !== 'sound' && question.mode !== 'voice');
      limit = 120;
    } else if (mode === 'challenge') {
      qList = QUESTIONS_DB.filter((question) => question.mode === 'challenge');
      limit = 11;
    } else if (mode === 'mix') {
      qList = QUESTIONS_DB.filter((question) => question.mode !== 'challenge' && question.mode !== 'daily' && question.mode !== 'rush');
    } else if (mode === 'image') {
      qList = QUESTIONS_DB.filter((question) => question.visualType === 'image' && Boolean(getLocalMediaAsset(question.visualContent)));
    } else {
      qList = QUESTIONS_DB.filter((question) => question.mode === mode);
    }

    if (qList.length === 0) qList = QUESTIONS_DB.filter((question) => question.mode !== 'daily');

    const preparedQuestions = mode === 'challenge'
      ? buildChallengeQuestions(qList, Math.random)
      : prepareQuizQuestions(qList, {
        limit,
        recentIds: mode === 'daily' ? [] : stats.recentQuestionIds,
        random: mode === 'daily' ? seededRandom(`daily-session:${getDateKey()}`) : Math.random,
      });

    setActiveQuestions(preparedQuestions);
    setActiveMode(mode);
    setCompletedSession(null);
  };

  // When Quiz completes
  const handleFinishGame = (finalSession: QuizSessionState) => {
    const isCorrect = finalSession.correctCount;
    const isWrong = finalSession.wrongCount;
    const isDailyPerfect = finalSession.mode === 'daily' && !finalSession.isPracticeRun && finalSession.questions.length > 0 && finalSession.correctCount === finalSession.questions.length && finalSession.wrongCount === 0;
    const isPerfect = finalSession.questions.length > 0 && finalSession.correctCount === finalSession.questions.length && finalSession.wrongCount === 0;
    const perfectAuraBonus = isPerfect && finalSession.mode !== 'daily' ? 250 : 0;
    const earnedAura = finalSession.earnedAura + perfectAuraBonus;
    const extraScore = finalSession.mode === 'rush' ? finalSession.score : finalSession.mode === 'challenge' ? finalSession.highestChallengeWave : finalSession.currentIndex + 1;
    const wasRushHighScore = finalSession.mode === 'rush' && finalSession.score > stats.highestRushScore;

    const result = recordGameCompletion(
      stats,
      isCorrect,
      isWrong,
      earnedAura,
      finalSession.mode,
      extraScore,
      isDailyPerfect,
      finalSession.correctByCategory,
      finalSession.challengeVictory,
    );
    const { updatedStats, streakExtended } = result;

    const withRecentQuestions = {
      ...updatedStats,
      recentQuestionIds: appendRecentQuestionIds(updatedStats.recentQuestionIds, finalSession.questions),
      personalBests: {
        ...updatedStats.personalBests,
        combo: Math.max(updatedStats.personalBests.combo ?? 0, finalSession.highestCombo),
      },
      discoveredSubjects: [...new Set([...updatedStats.discoveredSubjects, ...finalSession.answeredSubjectKeys])],
    };
    const archiveProgress = applyArchiveProgress(
      withRecentQuestions,
      withRecentQuestions.discoveredSubjects,
      ARCHIVE_ENTRIES.map((entry) => entry.subjectKey),
    );
    const progressedStats = archiveProgress.updatedStats;
    progressedStats.unlockedTitles = evaluateTitles(progressedStats);
    progressedStats.unlockedAchievements = evaluateAchievements(progressedStats, finalSession);
    saveUserStats(progressedStats);
    setStats(progressedStats);
    if (archiveProgress.newlyDiscovered.length > 0) {
      const entry = ARCHIVE_ENTRIES.find((item) => item.subjectKey === archiveProgress.newlyDiscovered[0]);
      setArchiveToast(entry ? `${entry.name.toUpperCase()} DISCOVERED` : 'NEW ARCHIVE ENTRY');
      window.setTimeout(() => setArchiveToast(null), 3000);
    }
    if (archiveProgress.newlyClaimedMilestones.length > 0) {
      const milestone = archiveProgress.newlyClaimedMilestones[0];
      const milestoneLabel = milestone === 100 ? 'COMPLETE' : `${milestone} ENTRIES`;
      setAchievementToast(`ARCHIVE ${milestoneLabel} • +${archiveProgress.auraBonus} AURA`);
      window.setTimeout(() => setAchievementToast(null), 3200);
    }
    setStreakExtendedAlert(finalSession.mode === 'daily' && streakExtended);
    const newlyUnlocked = progressedStats.unlockedAchievements.filter((id) => !stats.unlockedAchievements.includes(id));
    if (newlyUnlocked.length > 0) {
      const achievement = ACHIEVEMENT_DEFINITIONS.find((definition) => definition.id === newlyUnlocked[0]);
      setAchievementToast(newlyUnlocked.length > 1
        ? `${newlyUnlocked.length} ACHIEVEMENTS UNLOCKED`
        : achievement ? `${achievement.title} • ${achievement.description}` : 'Achievement unlocked');
      window.setTimeout(() => setAchievementToast(null), 3200);
    }
    setCompletedSession({
      ...finalSession,
      earnedAura: finalSession.earnedAura + result.dailyPerfectBonus + perfectAuraBonus,
      dailyPerfect: isDailyPerfect,
      isNewHighScore: wasRushHighScore,
    });
  };

  // Replay current mode
  const handlePlayAgain = () => {
    if (activeMode) {
      handleSelectMode(activeMode);
    }
  };

  // Return to mode selector
  const handleReturnToModes = () => {
    setActiveMode(null);
    setActiveQuestions([]);
    setCompletedSession(null);
  };

  return (
    <div data-theme={theme.id} style={{ '--theme-accent': theme.accent, '--theme-secondary': theme.secondary, '--theme-glow': theme.glow, '--theme-background': theme.background } as React.CSSProperties} className={`theme-shell relative min-h-screen bg-black text-white font-sans flex flex-col justify-between select-none ${theme.rootClass} ${
      isScreenShaking ? 'brainrot-shake' : ''
    }`}>
      {/* Background with CRT Scanlines */}
      <BrainrotBackground
        crtEnabled={stats.crtEnabled}
        scanlinesEnabled={stats.scanlinesEnabled}
        theme={theme}
      />

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col">
        <Header
          stats={stats}
          onUpdateStats={handleUpdateStats}
          onOpenStreakModal={() => setIsStreakModalOpen(true)}
          onOpenSoundboard={() => setIsSoundboardOpen(true)}
          onOpenCollection={() => setIsCollectionOpen(true)}
        />

        <main className="flex-1 flex flex-col justify-center py-2">
          {!activeMode && (
            <ModeSelector
              stats={stats}
              onSelectMode={handleSelectMode}
              onOpenStreakModal={() => setIsStreakModalOpen(true)}
            />
          )}

          {activeMode && activeQuestions.length > 0 && !completedSession && (
            <QuizGame
              mode={activeMode}
              questions={activeQuestions}
              stats={stats}
              isPracticeRun={activeMode === 'daily' && stats.lastDailyCompletedDate === getDateKey()}
              onFinishGame={handleFinishGame}
              onExitGame={handleReturnToModes}
              triggerScreenShake={triggerScreenShake}
            />
          )}
        </main>

        {/* Retro Arcade Footer */}
        <footer className="relative z-20 py-3 text-center text-[11px] font-mono text-zinc-500 border-t border-zinc-900/80 bg-black/60">
          BRAINROT QUIZ • LOCAL MEDIA CLUES • ORIGINAL GAME SFX • Y2K RETRO ENGINE
        </footer>
      </div>

      {/* Modals */}
      {completedSession && (
        <ResultsModal
          session={completedSession}
          stats={stats}
          streakExtended={streakExtendedAlert}
          onPlayAgain={handlePlayAgain}
          onReturnToModes={handleReturnToModes}
          onOpenStreakModal={() => setIsStreakModalOpen(true)}
        />
      )}

      {isStreakModalOpen && (
        <StreakModal
          stats={stats}
          onClose={() => setIsStreakModalOpen(false)}
          onUpdateStats={handleUpdateStats}
        />
      )}

      <SoundboardDrawer
        isOpen={isSoundboardOpen}
        onClose={() => setIsSoundboardOpen(false)}
      />

      {isCollectionOpen && (
        <CollectionModal
          stats={stats}
          onClose={() => setIsCollectionOpen(false)}
          onUpdateStats={handleUpdateStats}
        />
      )}

      {achievementToast && (
        <div className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-2xl border-2 border-yellow-400 bg-zinc-950/95 px-4 py-3 text-center shadow-[0_0_30px_rgba(250,204,21,0.35)]" role="status">
          <div className="text-[10px] font-mono font-black text-yellow-300">ACHIEVEMENT UNLOCKED</div>
          <div className="mt-1 text-xs font-bold text-white">{achievementToast}</div>
        </div>
      )}
      {archiveToast && (
        <div className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-2xl border-2 border-cyan-400 bg-zinc-950/95 px-4 py-3 text-center shadow-[0_0_30px_rgba(34,211,238,0.35)]" role="status">
          <div className="text-[10px] font-mono font-black text-cyan-300">NEW ARCHIVE ENTRY</div>
          <div className="mt-1 text-xs font-bold text-white">{archiveToast}</div>
        </div>
      )}
    </div>
  );
}
