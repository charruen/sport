'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, X, Flame, CheckCircle2, ArrowRight } from 'lucide-react';
import { playSuccessChime, playSwitchSideBeep } from '@/utils/sound';

interface EffortTimerProps {
  initialSeconds: number;
  perSide?: boolean;
  exerciseName: string;
  setIndex: number;
  totalSets: number;
  restSeconds: number;
  onComplete: (setIndex: number, restSeconds: number) => void;
  onClose: () => void;
}

export default function EffortTimer({
  initialSeconds,
  perSide = false,
  exerciseName,
  setIndex,
  totalSets,
  restSeconds,
  onComplete,
  onClose,
}: EffortTimerProps) {
  const [currentSide, setCurrentSide] = useState<1 | 2>(1);
  const [timeLeft, setTimeLeft] = useState<number>(initialSeconds);
  const [totalDuration, setTotalDuration] = useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isSwitching, setIsSwitching] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      if (perSide && currentSide === 1) {
        // Premier côté terminé, transition vers le deuxième côté
        setIsRunning(false);
        setIsSwitching(true);
        playSwitchSideBeep();

        setTimeout(() => {
          setCurrentSide(2);
          setTimeLeft(initialSeconds);
          setTotalDuration(initialSeconds);
          setIsSwitching(false);
          setIsRunning(true);
        }, 2000);
      } else {
        // Fin complète de l'exercice
        setIsRunning(false);
        setIsFinished(true);
        playSuccessChime();
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft, perSide, currentSide, initialSeconds]);

  const handleAddTen = () => {
    setTimeLeft((prev) => prev + 10);
    setTotalDuration((prev) => Math.max(prev, timeLeft + 10));
    if (isFinished) setIsFinished(false);
  };

  const handleReset = () => {
    setCurrentSide(1);
    setTimeLeft(initialSeconds);
    setTotalDuration(initialSeconds);
    setIsRunning(true);
    setIsFinished(false);
    setIsSwitching(false);
  };

  const handleValidateNow = () => {
    playSuccessChime();
    onComplete(setIndex, restSeconds);
  };

  const percentage = Math.max(0, Math.min(100, (timeLeft / totalDuration) * 100));

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm px-4 sm:px-0">
      <div
        className={`p-4 rounded-2xl shadow-2xl border transition-all duration-300 backdrop-blur-xl ${
          isFinished
            ? 'bg-emerald-950/95 border-emerald-500/60 text-emerald-100 ring-2 ring-emerald-500 shadow-emerald-500/20'
            : isSwitching
            ? 'bg-amber-950/95 border-amber-500/60 text-amber-100 ring-2 ring-amber-500 animate-pulse'
            : 'bg-zinc-900/95 border-cyan-500/40 text-zinc-100 shadow-cyan-500/10'
        }`}
      >
        {/* En-tête */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`p-2 rounded-lg ${
                isFinished
                  ? 'bg-emerald-500 text-zinc-950'
                  : isSwitching
                  ? 'bg-amber-500 text-zinc-950'
                  : 'bg-gradient-to-tr from-cyan-500 to-emerald-500 text-zinc-950'
              }`}
            >
              {isFinished ? <CheckCircle2 className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  {isFinished ? 'Série terminée !' : 'Chrono Effort'}
                </h4>
                {perSide && !isFinished && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {isSwitching ? 'Change de côté !' : `Côté ${currentSide}/2`}
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-zinc-200 truncate max-w-[200px]">
                {exerciseName} • Série {setIndex + 1}/{totalSets}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            title="Fermer sans valider"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Minuteur & Commandes */}
        {isSwitching ? (
          <div className="py-4 text-center">
            <p className="text-sm font-extrabold text-amber-300 animate-bounce">
              🔄 Change de côté (2 secondes)...
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between my-2">
            <div className="font-mono text-3xl font-extrabold tracking-tight">
              {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}
            </div>

            <div className="flex items-center gap-1.5">
              {!isFinished && (
                <>
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
                    title={isRunning ? 'Pause' : 'Reprendre'}
                  >
                    {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleAddTen}
                    className="px-2.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-cyan-400 text-xs font-bold transition-colors flex items-center gap-1"
                    title="Ajouter 10s"
                  >
                    <Plus className="w-3.5 h-3.5" /> 10s
                  </button>
                  <button
                    onClick={handleReset}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition-colors"
                    title="Recommencer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Barre de progression */}
        <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden mt-3">
          <div
            className={`h-full transition-all duration-1000 ease-linear ${
              isFinished ? 'bg-emerald-400' : 'bg-gradient-to-r from-cyan-400 to-emerald-400'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Actions de fin ou validation anticipée */}
        <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
          {isFinished ? (
            <button
              onClick={handleValidateNow}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all scale-[1.01]"
            >
              <span>Valider & Lancer le Repos ({restSeconds}s)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleValidateNow}
              className="w-full py-1.5 px-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Valider la série maintenant</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
