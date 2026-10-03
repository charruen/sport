'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, X, BellRing } from 'lucide-react';
import { playTimerBeep } from '@/utils/sound';

interface RestTimerProps {
  initialSeconds: number;
  exerciseName?: string;
  onClose: () => void;
}

export default function RestTimer({ initialSeconds, exerciseName, onClose }: RestTimerProps) {
  const [totalDuration, setTotalDuration] = useState<number>(initialSeconds);
  const [timeLeft, setTimeLeft] = useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setIsFinished(true);
      playTimerBeep();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  const handleAddTen = () => {
    setTimeLeft((prev) => prev + 10);
    setTotalDuration((prev) => Math.max(prev, timeLeft + 10));
    if (isFinished) setIsFinished(false);
  };

  const handleReset = () => {
    setTimeLeft(initialSeconds);
    setTotalDuration(initialSeconds);
    setIsRunning(true);
    setIsFinished(false);
  };

  const percentage = Math.max(0, Math.min(100, (timeLeft / totalDuration) * 100));

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm px-4 sm:px-0">
      <div className={`p-4 rounded-2xl shadow-2xl border transition-all duration-300 backdrop-blur-xl ${
        isFinished 
          ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100 ring-2 ring-emerald-500 animate-bounce' 
          : 'bg-zinc-900/95 border-zinc-800 text-zinc-100'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`p-2 rounded-lg ${isFinished ? 'bg-emerald-500 text-zinc-950' : 'bg-emerald-500/10 text-emerald-400'}`}>
              <BellRing className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Temps de repos</h4>
              {exerciseName && <p className="text-xs font-medium text-zinc-200 truncate max-w-[180px]">{exerciseName}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Minuteur / Horloge */}
        <div className="flex items-center justify-between my-2">
          <div className="font-mono text-3xl font-extrabold tracking-tight">
            {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
              title={isRunning ? 'Pause' : 'Reprendre'}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={handleAddTen}
              className="px-2.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-emerald-400 text-xs font-bold transition-colors flex items-center gap-1"
              title="Ajouter 10s"
            >
              <Plus className="w-3.5 h-3.5" /> 10s
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition-colors"
              title="Réinitialiser"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden mt-3">
          <div
            className={`h-full transition-all duration-1000 ease-linear ${isFinished ? 'bg-emerald-400' : 'bg-emerald-500'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {isFinished && (
          <p className="mt-2 text-center text-xs font-bold text-emerald-300">
            Prêt pour la série suivante ! 🔥
          </p>
        )}
      </div>
    </div>
  );
}
