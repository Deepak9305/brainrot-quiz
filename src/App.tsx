import React, { useState, useEffect } from 'react';
import { GameMode, Question, QuizSessionState, UserStats } from './types';
import { QUESTIONS_DB } from './data/questions';
import { getLocalMediaAsset } from './data/media';
import { applyArchiveProgress, loadUserStats, saveUserStats, recordGameCompletion, evaluateStreakState } from './utils/storage';
import { soundManager } from './utils/audio';
import { appendRecentQuestionIds, appendRecentSubjectKeys, buildChallengeQuestions, prepareQuizQuestions } from './utils/shuffle';
import { CHALLENGE_QUESTIONS } from './data/challengeQuestions';
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

type ProgressionNotification = {
  kind: 'archive' | 'milestone' | 'achievement' | 'title';
  title: string;
  detail: string;
  tone: 'cyan' | 'yellow' | 'pink' | 'emerald';
};

const notificationToneClasses = {
  cyan: 'border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.35)]',
  yellow: 'border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.35)]',
  pink: 'border-pink-400 shadow-[0_0_30px_rgba(244,114,182,0.35)]',
  emerald: 'border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.35)]',
} as const;

const notificationLabelClasses = {
  cyan: 'text-cyan-300',
  yellow: 'text-yellow-300',
  pink: 'text-pink-300',
  emerald: 'text-emerald-300',
} as const;

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
  const [collectionInitialTab, setCollectionInitialTab] = useState<'achievements' | 'archive' | 'shop' | 'stats' | 'credits'>('achievements');
  const [isScreenShaking, setIsScreenShaking] = useState<boolean>(false);
  const [notificationQueue, setNotificationQueue] = useState<ProgressionNotification[]>([]);
  const [activeNotification, setActiveNotification] = useState<ProgressionNotification | null>(null);
  const theme = getThemeConfig(stats.equippedTheme);

  useEffect(() => {
    if (!activeNotification && notificationQueue.length > 0) {
      setActiveNotification(notificationQueue[0]);
      setNotificationQueue((queue) => queue.slice(1));
    }
  }, [activeNotification, notificationQueue]);

  useEffect(() => {
    if (!activeNotification) return undefined;
    const timeout = window.setTimeout(() => setActiveNotification(null), 2300);
    return () => window.clearTimeout(timeout);
  }, [activeNotification]);

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
      qList = CHALLENGE_QUESTIONS;
      limit = 11;
    } else if (mode === 'mix') {
      qList = QUESTIONS_DB.filter((question) => question.mode !== 'challenge' && question.mode !== 'daily' && question.mode !== 'rush');
    } else if (mode === 'image') {
      qList = QUESTIONS_DB.filter((question) => question.mode === 'image'
        && question.visualType === 'image'
        && Boolean(getLocalMediaAsset(question.visualContent)));
    } else {
      qList = QUESTIONS_DB.filter((question) => question.mode === mode);
    }

    if (qList.length === 0) qList = QUESTIONS_DB.filter((question) => question.mode !== 'daily');

    const preparedQuestions = mode === 'challenge'
      ? buildChallengeQuestions(qList, Math.random)
      : prepareQuizQuestions(qList, {
        limit,
        recentIds: mode === 'daily' ? [] : stats.recentQuestionIds,
        avoidSubjects: mode === 'image' ? stats.recentVisualSubjectKeys : [],
        uniqueSubjects: mode === 'image',
        balance: mode === 'mix' ? 'mix' : mode === 'image' ? 'image' : undefined,
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
    const answeredQuestions = finalSession.questions.filter((question) => finalSession.answeredQuestionIds.includes(question.id));

    const archiveProgress = applyArchiveProgress(
      updatedStats,
      finalSession.answeredSubjectKeys,
      ARCHIVE_ENTRIES.map((entry) => entry.subjectKey),
    );
    const progressedStats = {
      ...archiveProgress.updatedStats,
      recentQuestionIds: appendRecentQuestionIds(updatedStats.recentQuestionIds, answeredQuestions),
      recentVisualSubjectKeys: finalSession.mode === 'image'
        ? appendRecentSubjectKeys(updatedStats.recentVisualSubjectKeys, finalSession.answeredSubjectKeys)
        : updatedStats.recentVisualSubjectKeys,
      personalBests: {
        ...updatedStats.personalBests,
        combo: Math.max(updatedStats.personalBests.combo ?? 0, finalSession.highestCombo),
      },
    };
    progressedStats.unlockedTitles = evaluateTitles(progressedStats);
    progressedStats.unlockedAchievements = evaluateAchievements(progressedStats, finalSession);
    saveUserStats(progressedStats);
    setStats(progressedStats);
    setStreakExtendedAlert(finalSession.mode === 'daily' && streakExtended);
    const notifications: ProgressionNotification[] = [];
    if (archiveProgress.newlyDiscovered.length > 0) {
      const names = archiveProgress.newlyDiscovered
        .map((subjectKey) => ARCHIVE_ENTRIES.find((entry) => entry.subjectKey === subjectKey)?.name)
        .filter(Boolean) as string[];
      notifications.push({
        kind: 'archive',
        title: names.length === 1 ? 'NEW ARCHIVE ENTRY' : `${names.length} NEW ARCHIVE ENTRIES`,
        detail: names.length <= 3 ? names.join(' • ') : `${names.length} NEW SUBJECTS DISCOVERED`,
        tone: 'cyan',
      });
    }
    const archiveCount = progressedStats.discoveredSubjects.filter((subjectKey) => ARCHIVE_ENTRIES.some((entry) => entry.subjectKey === subjectKey)).length;
    archiveProgress.newlyClaimedMilestones.forEach((milestone) => {
      if (milestone === 100) {
        notifications.push({ kind: 'milestone', title: 'ARCHIVE COMPLETE', detail: 'THE FEED IS MINE • ARCHIVE CHROME UNLOCKED', tone: 'yellow' });
      } else if (milestone === 20) {
        notifications.push({ kind: 'milestone', title: 'ARCHIVE MILESTONE', detail: `${archiveCount} / ${ARCHIVE_ENTRIES.length} DISCOVERED • ARCHIVE CURATOR TITLE UNLOCKED`, tone: 'yellow' });
      } else {
        const reward = milestone === 5 ? 250 : 500;
        notifications.push({ kind: 'milestone', title: 'ARCHIVE MILESTONE', detail: `${archiveCount} / ${ARCHIVE_ENTRIES.length} DISCOVERED • +${reward} AURA`, tone: 'yellow' });
      }
    });
    const newlyUnlockedTitles = progressedStats.unlockedTitles.filter((title) => !stats.unlockedTitles.includes(title) && !['Archive Curator', 'The Feed Is Mine'].includes(title));
    newlyUnlockedTitles.forEach((title) => notifications.push({ kind: 'title', title: 'TITLE UNLOCKED', detail: title, tone: 'pink' }));
    const newlyUnlocked = progressedStats.unlockedAchievements.filter((id) => !stats.unlockedAchievements.includes(id));
    if (newlyUnlocked.length > 0) {
      const achievement = ACHIEVEMENT_DEFINITIONS.find((definition) => definition.id === newlyUnlocked[0]);
      notifications.push({ kind: 'achievement', title: newlyUnlocked.length > 1 ? `${newlyUnlocked.length} ACHIEVEMENTS UNLOCKED` : 'ACHIEVEMENT UNLOCKED', detail: achievement?.title ?? 'NEW RECEIPT ADDED', tone: 'emerald' });
    }
    if (notifications.length > 0) setNotificationQueue((queue) => [...queue, ...notifications]);
    setCompletedSession({
      ...finalSession,
      earnedAura: finalSession.earnedAura + result.dailyPerfectBonus + perfectAuraBonus + archiveProgress.auraBonus,
      dailyPerfect: isDailyPerfect,
      isNewHighScore: wasRushHighScore,
      auraBreakdown: {
        answers: finalSession.earnedAura,
        perfectBonus: result.dailyPerfectBonus + perfectAuraBonus,
        archiveBonus: archiveProgress.auraBonus,
      },
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
        isRush={activeMode === 'rush'}
      />

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col">
        <Header
          stats={stats}
          onUpdateStats={handleUpdateStats}
          onOpenStreakModal={() => setIsStreakModalOpen(true)}
          onOpenSoundboard={() => setIsSoundboardOpen(true)}
          onOpenCollection={(initialTab = 'achievements') => {
            setCollectionInitialTab(initialTab);
            setIsCollectionOpen(true);
          }}
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
          initialTab={collectionInitialTab}
          onClose={() => setIsCollectionOpen(false)}
          onUpdateStats={handleUpdateStats}
        />
      )}

      {activeNotification && (
        <div className={`fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-2xl border-2 bg-zinc-950/95 px-4 py-3 text-center ${notificationToneClasses[activeNotification.tone]}`} role="status" aria-live="polite">
          <div className={`text-[10px] font-mono font-black ${notificationLabelClasses[activeNotification.tone]}`}>{activeNotification.title}</div>
          <div className="mt-1 text-xs font-bold text-white">{activeNotification.detail}</div>
        </div>
      )}
    </div>
  );
}
