import React, { useState, useEffect } from 'react';
import { GameMode, Question, QuizSessionState, UserStats } from './types';
import { QUESTIONS_DB } from './data/questions';
import { loadUserStats, saveUserStats, recordGameCompletion } from './utils/storage';
import { soundManager } from './utils/audio';
import { appendRecentQuestionIds, prepareQuizQuestions } from './utils/shuffle';
import { getDailyQuestions, getDateKey, seededRandom } from './utils/daily';
import { Header } from './components/Header';
import { BrainrotBackground } from './components/BrainrotBackground';
import { ModeSelector } from './components/ModeSelector';
import { QuizGame } from './components/QuizGame';
import { ResultsModal } from './components/ResultsModal';
import { StreakModal } from './components/StreakModal';
import { SoundboardDrawer } from './components/SoundboardDrawer';

export default function App() {
  const [stats, setStats] = useState<UserStats>(loadUserStats);
  const [activeMode, setActiveMode] = useState<GameMode | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [completedSession, setCompletedSession] = useState<QuizSessionState | null>(null);
  const [streakExtendedAlert, setStreakExtendedAlert] = useState<boolean>(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState<boolean>(false);
  const [isSoundboardOpen, setIsSoundboardOpen] = useState<boolean>(false);
  const [isScreenShaking, setIsScreenShaking] = useState<boolean>(false);

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
    setTimeout(() => setIsScreenShaking(false), 500);
  };

  // Start selected mode
  const handleSelectMode = (mode: GameMode) => {
    let qList: Question[];
    let limit = 10;

    if (mode === 'daily') {
      qList = getDailyQuestions(QUESTIONS_DB);
      limit = 5;
    } else if (mode === 'rush') {
      qList = QUESTIONS_DB.filter((question) => question.eligibleForRush !== false && question.mode !== 'challenge' && question.mode !== 'daily' && question.mode !== 'sound' && question.mode !== 'voice');
      limit = 40;
    } else if (mode === 'challenge') {
      qList = QUESTIONS_DB.filter((question) => question.mode === 'challenge');
      limit = 6;
    } else if (mode === 'mix') {
      qList = QUESTIONS_DB.filter((question) => question.mode !== 'challenge' && question.mode !== 'daily' && question.mode !== 'rush');
    } else {
      qList = QUESTIONS_DB.filter((question) => question.mode === mode);
    }

    if (qList.length === 0) qList = QUESTIONS_DB.filter((question) => question.mode !== 'daily');

    const preparedQuestions = prepareQuizQuestions(qList, {
      limit,
      recentIds: mode === 'daily' ? [] : stats.recentQuestionIds,
      random: mode === 'daily' ? seededRandom(getDateKey()) : Math.random,
    });

    setActiveQuestions(preparedQuestions);
    setActiveMode(mode);
    setCompletedSession(null);
  };

  // When Quiz completes
  const handleFinishGame = (finalSession: QuizSessionState) => {
    const isCorrect = finalSession.correctCount;
    const isWrong = finalSession.wrongCount;
    const earnedAura = finalSession.earnedAura;
    const extraScore = finalSession.mode === 'rush' ? finalSession.score : finalSession.currentIndex + 1;

    const { updatedStats, streakExtended } = recordGameCompletion(
      stats,
      isCorrect,
      isWrong,
      earnedAura,
      finalSession.mode,
      extraScore
    );

    const withRecentQuestions = {
      ...updatedStats,
      recentQuestionIds: appendRecentQuestionIds(updatedStats.recentQuestionIds, finalSession.questions),
    };
    saveUserStats(withRecentQuestions);
    setStats(withRecentQuestions);
    setStreakExtendedAlert(finalSession.mode === 'daily' && streakExtended);
    setCompletedSession(finalSession);
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
    <div className={`relative min-h-screen bg-black text-white font-sans flex flex-col justify-between select-none ${
      isScreenShaking ? 'animate-bounce' : ''
    }`}>
      {/* Background with CRT Scanlines */}
      <BrainrotBackground
        crtEnabled={stats.crtEnabled}
        scanlinesEnabled={stats.scanlinesEnabled}
      />

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col">
        <Header
          stats={stats}
          onUpdateStats={handleUpdateStats}
          onOpenStreakModal={() => setIsStreakModalOpen(true)}
          onOpenSoundboard={() => setIsSoundboardOpen(true)}
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
    </div>
  );
}
