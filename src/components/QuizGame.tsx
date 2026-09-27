import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Timer, Volume2, Play, CheckCircle2, XCircle, ArrowRight, Flame, HelpCircle, RotateCcw, Zap } from 'lucide-react';
import { GameMode, Question, QuizSessionState, UserStats } from '../types';
import { MemeArt } from './MemeArt';
import { getLocalMediaAsset } from '../data/media';
import { fisherYates } from '../utils/shuffle';
import { soundManager } from '../utils/audio';
import { calculateNormalScore, calculateRushScore, comboMultiplier } from '../utils/scoring';

interface QuizGameProps {
  mode: GameMode;
  questions: Question[];
  stats: UserStats;
  isPracticeRun?: boolean;
  onFinishGame: (finalSession: QuizSessionState) => void;
  onExitGame: () => void;
  triggerScreenShake: () => void;
}

function getInitialWave(question?: Question): number {
  return question?.challengeWave ?? 1;
}

function createInitialSession(mode: GameMode, questions: Question[], isPracticeRun = false): QuizSessionState {
  const startedAt = performance.now();
  return {
    mode,
    questions,
    currentIndex: 0,
    score: 0,
    correctCount: 0,
    wrongCount: 0,
    combo: 0,
    highestCombo: 0,
    timeLeft: mode === 'rush' ? 60 : 0,
    lives: mode === 'challenge' ? 3 : 1,
    maxLives: 3,
    isFinished: false,
    selectedOption: null,
    isAnswered: false,
    earnedAura: 0,
    streakExtended: false,
    startedAt,
    questionStartedAt: startedAt,
    rushEndsAt: mode === 'rush' ? startedAt + 60_000 : null,
    questionTimesMs: [],
    questionsAnswered: 0,
    challengeWave: getInitialWave(questions[0]),
    highestChallengeWave: getInitialWave(questions[0]),
    challengeVictory: false,
    finalBossDefeated: false,
    isPracticeRun,
    isNewHighScore: false,
    scoreEvents: [],
    dailyPerfect: false,
    correctByCategory: {},
    answeredSubjectKeys: [],
  };
}

export const QuizGame: React.FC<QuizGameProps> = ({ mode, questions, stats, isPracticeRun = false, onFinishGame, onExitGame, triggerScreenShake }) => {
  const [session, setSession] = useState<QuizSessionState>(() => createInitialSession(mode, questions, isPracticeRun));
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isSpeakingVoice, setIsSpeakingVoice] = useState(false);
  const [scoreFlash, setScoreFlash] = useState('');
  const [waveAnnouncement, setWaveAnnouncement] = useState<number | null>(null);
  const mediaTimeoutRef = useRef<number | null>(null);
  const advanceTimeoutRef = useRef<number | null>(null);
  const didFinishRef = useRef(false);
  const rushEndsAtRef = useRef<number | null>(session.rushEndsAt);

  const currentQ = session.questions[session.currentIndex] ?? session.questions[0];

  const triggerMediaForQuestion = useCallback((question: Question) => {
    if (question.mode === 'sound' && question.audioClip) {
      setIsPlayingAudio(true);
      soundManager.play(question.audioClip);
      if (mediaTimeoutRef.current) window.clearTimeout(mediaTimeoutRef.current);
      mediaTimeoutRef.current = window.setTimeout(() => setIsPlayingAudio(false), 1200);
    } else if (question.mode === 'voice' && question.voiceText) {
      setIsSpeakingVoice(true);
      soundManager.speakMemeText(question.voiceText, 1, 1, undefined, () => setIsSpeakingVoice(false));
    }
  }, []);

  // Stop only current playback between questions; keep the AudioContext alive.
  useEffect(() => {
    setIsPlayingAudio(false);
    setIsSpeakingVoice(false);
    soundManager.stopCurrentPlayback();
    const nextQuestion = session.questions[session.currentIndex + 1];
    if (nextQuestion?.visualType === 'image' && nextQuestion.visualContent) {
      const nextAsset = getLocalMediaAsset(nextQuestion.visualContent);
      if (nextAsset) {
        const preload = new Image();
        preload.src = nextAsset.src;
      }
    }
    setSession((previous) => previous.isFinished ? previous : { ...previous, questionStartedAt: performance.now() });
    return () => {
      soundManager.stopCurrentPlayback();
      if (mediaTimeoutRef.current) window.clearTimeout(mediaTimeoutRef.current);
      if (advanceTimeoutRef.current) window.clearTimeout(advanceTimeoutRef.current);
    };
  }, [currentQ?.id]);

  // Rush is a real wall-clock timer. Feedback and transition states do not pause it.
  useEffect(() => {
    if (mode !== 'rush' || session.isFinished || !rushEndsAtRef.current) return;
    const timer = window.setInterval(() => {
      const end = rushEndsAtRef.current ?? performance.now();
      const remainingMs = Math.max(0, end - performance.now());
      const remaining = Math.ceil(remainingMs / 1000);
      setSession((previous) => {
        if (previous.isFinished) return previous;
        if (remainingMs <= 0) {
          soundManager.play('game_over');
          return { ...previous, timeLeft: 0, isFinished: true };
        }
        return previous.timeLeft === remaining ? previous : { ...previous, timeLeft: remaining };
      });
    }, 100);
    return () => window.clearInterval(timer);
  }, [mode, session.isFinished]);

  useEffect(() => {
    if (!session.isFinished || didFinishRef.current) return;
    didFinishRef.current = true;
    onFinishGame(session);
  }, [session, onFinishGame]);

  const advanceQuestion = useCallback((state: QuizSessionState = session) => {
    if (state.isFinished) return;

    if (state.mode === 'rush') {
      const end = state.rushEndsAt ?? rushEndsAtRef.current ?? performance.now();
      if (performance.now() >= end) {
        setSession((previous) => ({ ...previous, timeLeft: 0, isFinished: true }));
        return;
      }
    }

    let nextIndex = state.currentIndex + 1;
    let nextQuestions = state.questions;
    if (nextIndex >= nextQuestions.length) {
      if (state.mode === 'rush') {
        // A large pool should be enough, but never let exhaustion end a timed run.
        nextQuestions = fisherYates(nextQuestions);
        if (nextQuestions[0]?.id === state.questions[state.currentIndex]?.id && nextQuestions.length > 1) {
          [nextQuestions[0], nextQuestions[1]] = [nextQuestions[1], nextQuestions[0]];
        }
        nextIndex = 0;
      } else {
        soundManager.play('level_up');
        setSession((previous) => ({ ...previous, isFinished: true }));
        return;
      }
    }

    const nextQuestion = nextQuestions[nextIndex];
    const nextWave = nextQuestion?.challengeWave ?? state.challengeWave;
    const changedWave = state.mode === 'challenge' && nextWave !== state.challengeWave;
    const commitNext = () => {
      setSession((previous) => ({
        ...previous,
        questions: nextQuestions,
        currentIndex: nextIndex,
        selectedOption: null,
        isAnswered: false,
        challengeWave: nextWave,
        highestChallengeWave: Math.max(previous.highestChallengeWave, nextWave),
        questionStartedAt: performance.now(),
      }));
      setWaveAnnouncement(null);
    };

    if (changedWave) {
      setWaveAnnouncement(nextWave);
      window.setTimeout(commitNext, 650);
    } else {
      commitNext();
    }
  }, [session]);

  const handleSelectOption = (index: number) => {
    if (!currentQ || session.isAnswered || session.isFinished || waveAnnouncement !== null) return;
    if (mode === 'rush' && rushEndsAtRef.current && performance.now() >= rushEndsAtRef.current) {
      setSession((previous) => ({ ...previous, timeLeft: 0, isFinished: true }));
      return;
    }

    const answerTimeMs = Math.max(0, performance.now() - session.questionStartedAt);
    const isCorrect = index === currentQ.correctAnswer;
    const nextCombo = isCorrect ? session.combo + 1 : 0;
    const highestCombo = Math.max(session.highestCombo, nextCombo);
    const nextLives = !isCorrect && mode === 'challenge' ? session.lives - 1 : session.lives;
    let scoreDelta = 0;
    let scoreEvent = '';

    if (isCorrect) {
      if (mode === 'rush') {
        const speedBonus = answerTimeMs < 1_000 ? 75 : answerTimeMs < 2_000 ? 50 : 0;
        scoreDelta = calculateRushScore(currentQ.difficulty, nextCombo, answerTimeMs, true);
        scoreEvent = speedBonus > 0 ? `+${scoreDelta} FAST` : `+${scoreDelta}`;
        if (nextCombo >= 3) scoreEvent = `${scoreEvent} • x${comboMultiplier(nextCombo).toFixed(1)} COMBO`;
      } else {
        scoreDelta = calculateNormalScore(nextCombo, true);
        scoreEvent = `+${scoreDelta}`;
      }
      soundManager.play(nextCombo >= 3 ? 'airhorn' : 'correct');
    } else {
      triggerScreenShake();
      soundManager.play('wrong');
    }

    const category = currentQ.category ?? currentQ.mode;
    const correctByCategory = { ...session.correctByCategory };
    if (isCorrect) correctByCategory[category] = (correctByCategory[category] ?? 0) + 1;
    const updatedSession: QuizSessionState = {
      ...session,
      selectedOption: index,
      isAnswered: true,
      score: session.score + scoreDelta,
      correctCount: session.correctCount + (isCorrect ? 1 : 0),
      wrongCount: session.wrongCount + (isCorrect ? 0 : 1),
      combo: nextCombo,
      highestCombo,
      lives: nextLives,
      earnedAura: session.earnedAura + (isCorrect ? 100 + nextCombo * 25 : 0),
      questionTimesMs: [...session.questionTimesMs, answerTimeMs],
      questionsAnswered: session.questionsAnswered + 1,
      scoreEvents: scoreEvent ? [...session.scoreEvents, scoreEvent] : session.scoreEvents,
      correctByCategory,
      answeredSubjectKeys: [...new Set([...session.answeredSubjectKeys, currentQ.subjectKey ?? currentQ.visualContent ?? currentQ.id])],
      highestChallengeWave: Math.max(session.highestChallengeWave, currentQ.challengeWave ?? session.challengeWave),
      challengeVictory: session.challengeVictory || (mode === 'challenge' && currentQ.challengeWave === 6 && isCorrect),
      finalBossDefeated: session.finalBossDefeated || (mode === 'challenge' && currentQ.challengeWave === 6 && isCorrect),
    };
    setSession(updatedSession);
    if (scoreEvent) {
      setScoreFlash(scoreEvent);
      window.setTimeout(() => setScoreFlash(''), 700);
    }

    if (nextLives <= 0) {
      advanceTimeoutRef.current = window.setTimeout(() => {
        soundManager.play('game_over');
        setSession((previous) => ({ ...previous, isFinished: true }));
      }, 650);
    } else if (mode === 'rush') {
      advanceTimeoutRef.current = window.setTimeout(() => advanceQuestion(updatedSession), 450);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (session.isFinished) return;
      if (!session.isAnswered) {
        const key = Number(event.key);
        if (key >= 1 && key <= 4) handleSelectOption(key - 1);
      } else if ((event.key === 'Enter' || event.key === ' ') && mode !== 'rush') {
        event.preventDefault();
        advanceQuestion();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [session.isAnswered, session.isFinished, session.currentIndex, mode, advanceQuestion]);

  const replayAudio = () => currentQ && triggerMediaForQuestion(currentQ);
  const challengeTotalWaves = 6;
  const progressLabel = mode === 'rush' ? `${session.questionsAnswered} ANSWERED` : `Q ${session.currentIndex + 1}/${session.questions.length}`;

  if (!currentQ) return null;

  return (
    <div className="relative z-10 w-full max-w-3xl mx-auto px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-zinc-900/90 border border-zinc-700/80 rounded-2xl p-3 mb-4 backdrop-blur-md shadow-lg">
        <div className="flex min-w-0 items-center gap-2">
          <button onClick={onExitGame} className="min-h-11 px-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1 font-mono" title="Exit Quiz">
            <RotateCcw className="w-3.5 h-3.5" /> QUIT
          </button>
          <div className="min-w-0 font-mono text-xs">
            <span className="text-pink-400 font-bold uppercase">{mode} MODE</span>
            <span className="text-zinc-500 mx-1.5">•</span>
            <span className="text-zinc-300">{progressLabel}</span>
            {mode === 'challenge' && <span className="ml-2 text-indigo-300">WAVE {session.challengeWave}/{challengeTotalWaves}</span>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {session.combo > 1 && (
            <motion.div initial={{ scale: 0.8, rotate: -5 }} animate={{ scale: 1, rotate: 0 }} className="flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-pink-500 text-black font-black text-xs px-2.5 py-1 rounded-full shadow-[0_0_12px_rgba(236,72,153,0.6)]">
              <Flame className="w-3.5 h-3.5 fill-black" />
              <span>{session.combo}x {session.combo >= 4 ? 'GIGA SIGMA!' : 'COMBO'}</span>
            </motion.div>
          )}
          {mode === 'challenge' && (
            <div className="flex items-center gap-1" aria-label={`${session.lives} hearts remaining`}>
              {[...Array(session.maxLives)].map((_, index) => <Heart key={index} className={`w-5 h-5 ${index < session.lives ? 'text-red-500 fill-red-500' : 'text-zinc-700'}`} />)}
            </div>
          )}
          {mode === 'rush' && (
            <div className={`flex items-center gap-1 border px-3 py-1 rounded-xl font-mono text-sm font-bold ${session.timeLeft <= 10 ? 'bg-red-950 border-red-400 text-red-200' : 'bg-zinc-800 border-red-500/70 text-red-300'}`}>
              <Timer className="w-4 h-4 text-red-400" /> <span>{session.timeLeft}s</span>
            </div>
          )}
          <div className="font-mono text-xs text-yellow-300 font-bold bg-zinc-800 px-2 py-1 rounded border border-zinc-700">{session.score} PTS</div>
        </div>
      </div>

      <motion.div key={currentQ.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }} className="relative bg-zinc-950/90 border-2 border-pink-500/60 rounded-2xl p-4 sm:p-6 shadow-[0_0_25px_rgba(236,72,153,0.2)] overflow-hidden">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="max-w-[75%] truncate text-[10px] font-mono font-bold tracking-widest text-pink-400 uppercase bg-pink-950/60 px-2.5 py-1 rounded-md border border-pink-800">{currentQ.subtitle || 'VIRAL CULTURE TEST'}</span>
          <span className={`shrink-0 text-[10px] font-black uppercase px-2 py-0.5 rounded ${currentQ.difficulty === 'sigma' ? 'bg-purple-600 text-white' : currentQ.difficulty === 'hard' ? 'bg-red-600 text-white' : currentQ.difficulty === 'medium' ? 'bg-yellow-500 text-black' : 'bg-green-600 text-white'}`}>{currentQ.difficulty}</span>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-white leading-snug mb-4">{currentQ.question}</h2>

        {currentQ.visualType === 'image' && currentQ.visualContent && <div className="my-3"><MemeArt type={currentQ.visualContent} altText={currentQ.question} variant={currentQ.imageVariant} /></div>}
        {currentQ.visualType === 'emoji' && currentQ.visualContent && <div className="my-4 p-4 rounded-2xl bg-zinc-900 border-2 border-yellow-400/50 flex flex-col items-center justify-center gap-2"><span className="text-4xl sm:text-5xl tracking-widest">{currentQ.visualContent}</span><span className="text-[10px] font-mono text-yellow-300/80 uppercase">DECODE THE BRAINROT COMBINATION</span></div>}
        {currentQ.visualType === 'ascii' && currentQ.visualContent && <div className="my-4 p-3 rounded-xl bg-black border border-cyan-500/50 font-mono text-cyan-300 text-center text-sm sm:text-base font-bold tracking-widest whitespace-pre-line">{currentQ.visualContent}</div>}

        {currentQ.mode === 'sound' && (
          <div className="my-4 p-5 rounded-2xl bg-purple-950/40 border-2 border-purple-500 flex flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-1.5 h-6" aria-hidden="true">{[40, 70, 100, 60, 90, 50, 80, 45].map((height, index) => <span key={index} className={`w-1.5 rounded-full bg-purple-400 ${isPlayingAudio ? 'animate-pulse' : 'opacity-40'}`} style={{ height: isPlayingAudio ? `${height}%` : '20%' }} />)}</div>
            <button onClick={replayAudio} className={`min-h-11 flex items-center gap-2 font-black text-sm px-6 py-3 rounded-xl cursor-pointer active:scale-95 ${isPlayingAudio ? 'bg-purple-500 text-white' : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'}`}><Volume2 className="w-5 h-5" />{isPlayingAudio ? 'PLAYING RECREATION…' : 'PLAY SOUND RECREATION 🔊'}</button>
            <span className="text-xs text-purple-300 font-mono">Original Web Audio recreation • no bundled recording</span>
          </div>
        )}

        {currentQ.mode === 'voice' && (
          <div className="my-4 p-5 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500 flex flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-1.5 h-7" aria-hidden="true">{[30, 80, 50, 100, 75, 45, 95, 60, 40].map((height, index) => <span key={index} className={`w-1.5 rounded-full bg-emerald-400 ${isSpeakingVoice ? 'animate-bounce' : 'opacity-40'}`} style={{ height: isSpeakingVoice ? `${height}%` : '25%', animationDelay: `${index * 0.08}s` }} />)}</div>
            <button onClick={replayAudio} className="min-h-11 flex items-center gap-2 font-black text-sm px-6 py-3 rounded-xl cursor-pointer active:scale-95 bg-gradient-to-r from-emerald-500 to-teal-500 text-black"><Play className="w-5 h-5" />{isSpeakingVoice ? 'SPEAKING…' : 'PLAY SYNTHESIZED NARRATION 🎙️'}</button>
            <div className="text-[10px] text-emerald-200/80 font-mono bg-black/50 px-3 py-1.5 rounded-lg border border-emerald-800/80">Neutral narration • no creator impersonation</div>
          </div>
        )}

        <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
          {currentQ.options.map((option, index) => {
            const isSelected = session.selectedOption === index;
            const isCorrectAnswer = index === currentQ.correctAnswer;
            let buttonStyle = 'bg-zinc-900/90 border-zinc-700 hover:border-pink-400 text-zinc-200 hover:text-white';
            if (session.isAnswered) {
              if (isCorrectAnswer) buttonStyle = 'bg-emerald-950/90 border-emerald-400 text-emerald-200 font-bold shadow-[0_0_15px_rgba(52,211,153,0.5)]';
              else if (isSelected) buttonStyle = 'bg-red-950/90 border-red-500 text-red-200 font-bold';
              else buttonStyle = 'bg-zinc-900/40 border-zinc-800 text-zinc-500 opacity-60';
            }
            return <motion.button key={`${currentQ.id}-${index}`} whileHover={!session.isAnswered ? { scale: 1.015 } : {}} whileTap={!session.isAnswered ? { scale: 0.98 } : {}} onClick={() => handleSelectOption(index)} disabled={session.isAnswered || waveAnnouncement !== null} aria-pressed={isSelected} className={`relative min-h-11 flex items-center justify-between p-3.5 sm:p-4 rounded-xl border-2 text-left text-sm transition-all cursor-pointer ${buttonStyle}`}>
              <div className="flex items-center gap-3"><span className="w-7 h-7 shrink-0 rounded-lg bg-black/70 border border-zinc-600 flex items-center justify-center text-xs font-mono font-black text-pink-400">{['A', 'B', 'C', 'D'][index] ?? String(index + 1)}</span><span className="font-semibold leading-snug">{option}</span></div>
              {session.isAnswered && <div>{isCorrectAnswer && <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-2" />}{isSelected && !isCorrectAnswer && <XCircle className="w-5 h-5 text-red-400 ml-2" />}</div>}
            </motion.button>;
          })}
          <AnimatePresence>{scoreFlash && <motion.div initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: -12, scale: 1 }} exit={{ opacity: 0 }} className="pointer-events-none absolute right-2 top-0 text-sm font-black text-yellow-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]"><Zap className="inline w-4 h-4 fill-yellow-300" /> {scoreFlash}</motion.div>}</AnimatePresence>
        </div>

        <AnimatePresence>
          {session.isAnswered && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 p-4 rounded-xl bg-zinc-900 border border-zinc-700 text-xs sm:text-sm text-zinc-300 space-y-2 overflow-hidden">
            <div className="flex items-center justify-between"><div className="flex items-center gap-1.5 text-pink-400 font-mono font-bold"><HelpCircle className="w-4 h-4" /><span>{session.selectedOption === currentQ.correctAnswer ? 'LOCKED IN:' : 'COOKED:'}</span></div>{mode !== 'rush' && <span className="text-zinc-500 font-mono text-[10px]">PRESS ENTER FOR NEXT</span>}</div>
            <p className="text-zinc-200">{currentQ.explanation}</p><p className="text-zinc-400 text-xs italic">Context: {currentQ.memeContext}</p>
          </motion.div>}
        </AnimatePresence>

        {session.isAnswered && mode !== 'rush' && session.lives > 0 && <div className="mt-4 flex justify-end"><button onClick={() => advanceQuestion()} className="min-h-11 flex items-center gap-2 bg-gradient-to-r from-pink-500 to-yellow-400 text-black font-black text-sm px-6 py-3 rounded-xl cursor-pointer shadow-[0_0_15px_rgba(236,72,153,0.5)] active:scale-95"><span>{session.currentIndex + 1 >= session.questions.length ? 'FINISH QUIZ' : 'NEXT QUESTION'}</span><ArrowRight className="w-4 h-4" /></button></div>}
      </motion.div>

      <AnimatePresence>{waveAnnouncement !== null && <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"><div className="rounded-3xl border-2 border-indigo-400 bg-indigo-950/95 px-8 py-6 text-center shadow-[0_0_50px_rgba(99,102,241,0.6)]"><div className="text-xs font-mono text-indigo-300">CHALLENGE PROGRESSION</div><div className="mt-1 text-4xl font-black text-white">{waveAnnouncement === 6 ? 'FINAL BOSS' : `WAVE ${waveAnnouncement}`}</div><div className="mt-2 text-xs font-mono text-indigo-200">{waveAnnouncement >= 5 ? 'DEEP LORE DETECTED' : 'NEXT TIER LOADED'}</div></div></motion.div>}</AnimatePresence>
    </div>
  );
};
