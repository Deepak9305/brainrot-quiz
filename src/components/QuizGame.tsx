import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Timer, 
  Volume2, 
  Play, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Flame, 
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { GameMode, Question, QuizSessionState, UserStats } from '../types';
import { MemeArt } from './MemeArt';
import { soundManager } from '../utils/audio';

interface QuizGameProps {
  mode: GameMode;
  questions: Question[];
  stats: UserStats;
  onFinishGame: (finalSession: QuizSessionState) => void;
  onExitGame: () => void;
  triggerScreenShake: () => void;
}

export const QuizGame: React.FC<QuizGameProps> = ({
  mode,
  questions,
  stats,
  onFinishGame,
  onExitGame,
  triggerScreenShake,
}) => {
  const [session, setSession] = useState<QuizSessionState>({
    mode,
    questions,
    currentIndex: 0,
    score: 0,
    correctCount: 0,
    wrongCount: 0,
    combo: 0,
    highestCombo: 0,
    timeLeft: mode === 'rush' ? 60 : 15,
    lives: mode === 'challenge' ? 3 : 1,
    maxLives: 3,
    isFinished: false,
    selectedOption: null,
    isAnswered: false,
    earnedAura: 0,
    streakExtended: false,
  });

  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isSpeakingVoice, setIsSpeakingVoice] = useState<boolean>(false);
  const mediaTimeoutRef = useRef<number | null>(null);
  const advanceTimeoutRef = useRef<number | null>(null);

  const currentQ = session.questions[session.currentIndex] || session.questions[0];

  // Play audio or speak voice clip on load of a question
  const triggerMediaForQuestion = useCallback((q: Question) => {
    if (q.mode === 'sound' && q.audioClip) {
      setIsPlayingAudio(true);
      soundManager.play(q.audioClip);
      if (mediaTimeoutRef.current) window.clearTimeout(mediaTimeoutRef.current);
      mediaTimeoutRef.current = window.setTimeout(() => setIsPlayingAudio(false), 1200);
    } else if (q.mode === 'voice' && q.voiceText) {
      setIsSpeakingVoice(true);
      soundManager.speakMemeText(
        q.voiceText,
        1.0,
        1.0,
        undefined,
        () => setIsSpeakingVoice(false)
      );
    }
  }, []);

  // Stop narration and stale timers when questions change or the component unmounts.
  useEffect(() => {
    setIsPlayingAudio(false);
    setIsSpeakingVoice(false);
    soundManager.stopSpeaking();
    return () => {
      soundManager.stopSpeaking();
      soundManager.stop();
      if (mediaTimeoutRef.current) window.clearTimeout(mediaTimeoutRef.current);
      if (advanceTimeoutRef.current) window.clearTimeout(advanceTimeoutRef.current);
    };
  }, [currentQ?.id]);

  // Timer loop
  useEffect(() => {
    if (session.isFinished || session.isAnswered) return;

    const timer = setInterval(() => {
      setSession((prev) => {
        // If rush mode, global 60s countdown
        if (prev.mode === 'rush') {
          if (prev.timeLeft <= 1) {
            clearInterval(timer);
            soundManager.play('game_over');
            return { ...prev, timeLeft: 0, isFinished: true };
          }
          if (prev.timeLeft <= 6) {
            soundManager.play('countdown_tick');
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        }

        // For other modes, optional per-question pace (except challenge or relaxed)
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session.isFinished, session.isAnswered]);

  // Handle game end trigger
  useEffect(() => {
    if (session.isFinished) {
      onFinishGame(session);
    }
  }, [session.isFinished, onFinishGame, session]);

  // Handle Option selection
  const handleSelectOption = (index: number) => {
    if (session.isAnswered || session.isFinished) return;

    const isCorrect = index === currentQ.correctAnswer;
    const nextCombo = isCorrect ? session.combo + 1 : 0;
    const highestCombo = Math.max(session.highestCombo, nextCombo);
    
    // Combo aura multiplier
    const auraGain = isCorrect ? (100 + nextCombo * 25) : 0;

    if (isCorrect) {
      if (nextCombo >= 3) {
        soundManager.play('airhorn');
      } else {
        soundManager.play('correct');
      }
    } else {
      triggerScreenShake();
      soundManager.play('wrong');
    }

    let nextLives = session.lives;
    if (!isCorrect && session.mode === 'challenge') {
      nextLives = session.lives - 1;
    }

    const updatedSession: QuizSessionState = {
      ...session,
      selectedOption: index,
      isAnswered: true,
      score: isCorrect ? session.score + 100 * Math.max(1, nextCombo) : session.score,
      correctCount: isCorrect ? session.correctCount + 1 : session.correctCount,
      wrongCount: !isCorrect ? session.wrongCount + 1 : session.wrongCount,
      combo: nextCombo,
      highestCombo,
      lives: nextLives,
      earnedAura: session.earnedAura + auraGain,
    };

    setSession(updatedSession);

    // If challenge mode and out of lives
    if (nextLives <= 0) {
      advanceTimeoutRef.current = window.setTimeout(() => {
        soundManager.play('game_over');
        setSession((prev) => ({ ...prev, isFinished: true }));
      }, 1400);
    } else if (session.mode === 'rush' && session.timeLeft > 0) {
      // In rush mode, immediately advance after 400ms!
      advanceTimeoutRef.current = window.setTimeout(() => {
        advanceQuestion(updatedSession);
      }, 450);
    }
  };

  const advanceQuestion = (curState = session) => {
    const nextIndex = curState.currentIndex + 1;
    if (nextIndex >= curState.questions.length) {
      // Finished all questions!
      soundManager.play('level_up');
      setSession((prev) => ({ ...prev, isFinished: true }));
    } else {
      setSession((prev) => ({
        ...prev,
        currentIndex: nextIndex,
        selectedOption: null,
        isAnswered: false,
      }));
    }
  };

  // Keyboard shortcut listener (1, 2, 3, 4, Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (session.isFinished) return;

      if (!session.isAnswered) {
        if (e.key === '1') handleSelectOption(0);
        if (e.key === '2') handleSelectOption(1);
        if (e.key === '3') handleSelectOption(2);
        if (e.key === '4') handleSelectOption(3);
      } else if (e.key === 'Enter' || e.key === ' ') {
        advanceQuestion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [session.isAnswered, session.isFinished, session.currentIndex]);

  const replayAudio = () => {
    triggerMediaForQuestion(currentQ);
  };

  return (
    <div className="relative z-10 w-full max-w-3xl mx-auto px-4 py-3">
      {/* Top Status Bar */}
      <div className="flex items-center justify-between gap-2 bg-zinc-900/90 border border-zinc-700/80 rounded-2xl p-3 mb-4 backdrop-blur-md shadow-lg">
        {/* Mode & Progress */}
        <div className="flex items-center gap-2">
          <button
            onClick={onExitGame}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1 font-mono"
            title="Exit Quiz"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            QUIT
          </button>
          <div className="font-mono text-xs">
            <span className="text-pink-400 font-bold uppercase">{mode} MODE</span>
            <span className="text-zinc-500 mx-1.5">•</span>
            <span className="text-zinc-300">
              Q {session.currentIndex + 1}/{session.questions.length}
            </span>
          </div>
        </div>

        {/* Combo Multiplier */}
        {session.combo > 1 && (
          <motion.div 
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            className="flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-pink-500 text-black font-black text-xs px-2.5 py-1 rounded-full shadow-[0_0_12px_rgba(236,72,153,0.6)] animate-pulse"
          >
            <Flame className="w-3.5 h-3.5 fill-black" />
            <span>{session.combo}x {session.combo >= 4 ? 'GIGA SIGMA!' : 'COMBO'}</span>
          </motion.div>
        )}

        {/* Challenge Hearts or Rush Timer */}
        <div className="flex items-center gap-3">
          {mode === 'challenge' && (
            <div className="flex items-center gap-1">
              {[...Array(session.maxLives)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-5 h-5 transition-transform ${
                    i < session.lives
                      ? 'text-red-500 fill-red-500 animate-pulse'
                      : 'text-zinc-700'
                  }`}
                />
              ))}
            </div>
          )}

          {mode === 'rush' && (
            <div className="flex items-center gap-1 bg-red-950/80 border border-red-500/80 text-red-300 px-3 py-1 rounded-xl font-mono text-sm font-bold shadow-[0_0_10px_rgba(239,68,68,0.4)]">
              <Timer className="w-4 h-4 text-red-400 animate-spin" />
              <span>{session.timeLeft}s</span>
            </div>
          )}

          {/* Score Counter */}
          <div className="font-mono text-xs text-yellow-300 font-bold bg-zinc-800 px-2 py-1 rounded border border-zinc-700">
            {session.score} PTS
          </div>
        </div>
      </div>

      {/* Question Card */}
      <motion.div
        key={currentQ.id}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="relative bg-zinc-950/90 border-2 border-pink-500/60 rounded-2xl p-5 sm:p-6 shadow-[0_0_25px_rgba(236,72,153,0.2)] overflow-hidden"
      >
        {/* Question Header & Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono font-bold tracking-widest text-pink-400 uppercase bg-pink-950/60 px-2.5 py-1 rounded-md border border-pink-800">
            {currentQ.subtitle || 'VIRAL CULTURE TEST'}
          </span>
          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
            currentQ.difficulty === 'sigma' ? 'bg-purple-600 text-white animate-pulse' :
            currentQ.difficulty === 'hard' ? 'bg-red-600 text-white' :
            currentQ.difficulty === 'medium' ? 'bg-yellow-500 text-black' : 'bg-green-600 text-white'
          }`}>
            {currentQ.difficulty}
          </span>
        </div>

        {/* Question Text */}
        <h2 className="text-lg sm:text-xl font-bold text-white leading-snug mb-4">
          {currentQ.question}
        </h2>

        {/* Visual / Media Container */}
        {currentQ.visualType === 'image' && currentQ.visualContent && (
          <div className="my-4">
            <MemeArt 
              type={currentQ.visualContent} 
              altText={currentQ.question}
              variant={currentQ.imageVariant}
            />
          </div>
        )}

        {currentQ.visualType === 'emoji' && currentQ.visualContent && (
          <div className="my-5 p-4 rounded-2xl bg-zinc-900 border-2 border-yellow-400/50 flex flex-col items-center justify-center gap-2 shadow-[0_0_20px_rgba(250,204,21,0.2)]">
            <span className="text-4xl sm:text-5xl tracking-widest animate-bounce">
              {currentQ.visualContent}
            </span>
            <span className="text-[10px] font-mono text-yellow-300/80 uppercase">
              DECODE THE BRAINROT COMBINATION
            </span>
          </div>
        )}

        {currentQ.visualType === 'ascii' && currentQ.visualContent && (
          <div className="my-4 p-3 rounded-xl bg-black border border-cyan-500/50 font-mono text-cyan-300 text-center text-sm sm:text-base font-bold tracking-widest whitespace-pre-line shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            {currentQ.visualContent}
          </div>
        )}

        {/* Sound Mode Player Button */}
        {currentQ.mode === 'sound' && (
          <div className="my-4 p-5 rounded-2xl bg-purple-950/40 border-2 border-purple-500 flex flex-col items-center justify-center gap-3 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            <div className="flex items-center gap-1.5 h-6">
              {[40, 70, 100, 60, 90, 50, 80, 45].map((h, i) => (
                <span
                  key={i}
                  className={`w-1.5 rounded-full bg-purple-400 transition-all ${
                    isPlayingAudio ? 'animate-pulse' : 'opacity-40'
                  }`}
                  style={{ height: isPlayingAudio ? `${h}%` : '20%' }}
                />
              ))}
            </div>

            <button
              onClick={replayAudio}
              className={`flex items-center gap-2 font-black text-sm px-6 py-3 rounded-xl cursor-pointer transition-all active:scale-95 ${
                isPlayingAudio
                  ? 'bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.8)] scale-105'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-md'
              }`}
            >
              <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-ping' : ''}`} />
              {isPlayingAudio ? 'PLAYING AUDIO EFFECT...' : 'REPLAY SOUND EFFECT 🔊'}
            </button>
            <span className="text-xs text-purple-300 font-mono">
              Pure offline Web Audio synthesis • Zero network required
            </span>
          </div>
        )}

        {/* Voice Mode Player Button */}
        {currentQ.mode === 'voice' && (
          <div className="my-4 p-5 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500 flex flex-col items-center justify-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            {currentQ.speakerName && (
              <span className="text-[10px] font-mono font-black uppercase tracking-wider bg-emerald-900/80 text-emerald-300 border border-emerald-400/60 px-3 py-1 rounded-full">
                QUOTE MODE / NEUTRAL NARRATION
              </span>
            )}

            <div className="flex items-center gap-1.5 h-7">
              {[30, 80, 50, 100, 75, 45, 95, 60, 40].map((h, i) => (
                <span
                  key={i}
                  className={`w-1.5 rounded-full bg-emerald-400 transition-all ${
                    isSpeakingVoice ? 'animate-bounce' : 'opacity-40'
                  }`}
                  style={{ height: isSpeakingVoice ? `${h}%` : '25%', animationDelay: `${i * 0.08}s` }}
                />
              ))}
            </div>

            <button
              onClick={replayAudio}
              className={`flex items-center gap-2 font-black text-sm px-6 py-3 rounded-xl cursor-pointer transition-all active:scale-95 ${
                isSpeakingVoice
                  ? 'bg-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.8)] scale-105'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black shadow-md'
              }`}
            >
              <Play className={`w-5 h-5 ${isSpeakingVoice ? 'animate-spin' : ''}`} />
              {isSpeakingVoice ? 'SPEAKING SYNTHESIZED QUOTE...' : 'PLAY SYNTHESIZED NARRATION 🎙️'}
            </button>

            <div className="text-[10px] text-emerald-200/80 font-mono bg-black/50 px-3 py-1.5 rounded-lg border border-emerald-800/80">
              Synthesized narration • no creator impersonation
            </div>
          </div>
        )}

        {/* Options List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
          {currentQ.options.map((option, idx) => {
            const isSelected = session.selectedOption === idx;
            const isCorrectAnswer = idx === currentQ.correctAnswer;
            const optionLetter = ['A', 'B', 'C', 'D'][idx] || String(idx + 1);
            
            let btnStyle = 'bg-zinc-900/90 border-zinc-700 hover:border-pink-400 text-zinc-200 hover:text-white';
            
            if (session.isAnswered) {
              if (isCorrectAnswer) {
                btnStyle = 'bg-emerald-950/90 border-emerald-400 text-emerald-200 font-bold shadow-[0_0_15px_rgba(52,211,153,0.5)]';
              } else if (isSelected) {
                btnStyle = 'bg-red-950/90 border-red-500 text-red-200 font-bold shadow-[0_0_15px_rgba(239,68,68,0.5)]';
              } else {
                btnStyle = 'bg-zinc-900/40 border-zinc-800 text-zinc-500 opacity-60';
              }
            }

            return (
              <motion.button
                key={idx}
                whileHover={!session.isAnswered ? { scale: 1.015 } : {}}
                whileTap={!session.isAnswered ? { scale: 0.98 } : {}}
                onClick={() => handleSelectOption(idx)}
                disabled={session.isAnswered}
                className={`relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl border-2 text-left text-sm transition-all cursor-pointer ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-black/70 border border-zinc-600 flex items-center justify-center text-xs font-mono font-black text-pink-400 shadow-sm">
                    {optionLetter}
                  </span>
                  <span className="font-semibold leading-snug">{option}</span>
                </div>

                {session.isAnswered && (
                  <div>
                    {isCorrectAnswer && <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-2" />}
                    {isSelected && !isCorrectAnswer && <XCircle className="w-5 h-5 text-red-400 ml-2" />}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Answer Explanation Box */}
        <AnimatePresence>
          {session.isAnswered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 rounded-xl bg-zinc-900 border border-zinc-700 text-xs sm:text-sm text-zinc-300 space-y-2 overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-pink-400 font-mono font-bold">
                  <HelpCircle className="w-4 h-4" />
                  <span>{session.selectedOption === currentQ.correctAnswer ? 'LOCKED IN:' : 'COOKED:'}</span>
                </div>
                <span className="text-zinc-500 font-mono text-[10px]">
                  PRESS ENTER FOR NEXT
                </span>
              </div>
              <p className="text-zinc-200">{currentQ.explanation}</p>
              <p className="text-zinc-400 text-xs italic">Origin: {currentQ.memeContext}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next Button (Only in non-rush or when finished answering) */}
        {session.isAnswered && session.mode !== 'rush' && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => advanceQuestion()}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-yellow-400 hover:from-pink-400 hover:to-yellow-300 text-black font-black text-sm px-6 py-3 rounded-xl cursor-pointer shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-transform active:scale-95"
            >
              <span>{session.currentIndex + 1 >= session.questions.length ? 'FINISH QUIZ' : 'NEXT QUESTION'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
