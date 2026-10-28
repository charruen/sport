'use client';

import React, { useState } from 'react';
import { Check, Info, Timer, Dumbbell, Sparkles, Play, Flame } from 'lucide-react';
import { Exercise } from '@/types/program';
import { parseTimedReps } from '@/utils/timerUtils';

interface ExerciseCardProps {
  exercise: Exercise;
  completedSetIndexes: number[]; // e.g. [0, 2] means sets 0 and 2 are done
  onToggleSet: (exerciseId: string, setIndex: number, restSeconds: number) => void;
  onStartEffortTimer?: (exercise: Exercise, setIndex: number, durationSeconds: number, perSide: boolean) => void;
}

const TARGET_COLORS: Record<string, string> = {
  Triceps: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  Pectoraux: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Biceps: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Dos: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Abdos: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  Mollets: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Full Body': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
};

export default function ExerciseCard({
  exercise,
  completedSetIndexes,
  onToggleSet,
  onStartEffortTimer,
}: ExerciseCardProps) {
  const [showTip, setShowTip] = useState(false);

  const isDiamond = exercise.name.toUpperCase().includes('DIAMANT');
  const isNegative = exercise.name.toUpperCase().includes('NÉGATIVE');

  const timedInfo = parseTimedReps(exercise.reps);

  // Première série incomplète
  let nextIncompleteSetIndex = -1;
  for (let i = 0; i < exercise.sets; i++) {
    if (!completedSetIndexes.includes(i)) {
      nextIncompleteSetIndex = i;
      break;
    }
  }

  return (
    <div
      className={`p-4 rounded-2xl border transition-all duration-300 ${
        isDiamond
          ? 'bg-gradient-to-br from-zinc-900 via-indigo-950/30 to-zinc-900 border-indigo-500/40 shadow-lg shadow-indigo-500/10'
          : 'bg-zinc-900/90 border-zinc-800/80 hover:border-zinc-700'
      }`}
    >
      {/* Header exercice */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                TARGET_COLORS[exercise.target] || 'bg-zinc-800 text-zinc-300 border-zinc-700'
              }`}
            >
              {exercise.target}
            </span>
            {timedInfo.isTimed && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
                <Timer className="w-3 h-3" /> Exercice au temps
              </span>
            )}
            {isDiamond && (
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500 text-zinc-950 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Exercice Clé
              </span>
            )}
            {isNegative && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Force Excentrique
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            {exercise.name}
          </h3>
        </div>

        <button
          onClick={() => setShowTip(!showTip)}
          className={`p-1.5 rounded-lg border transition-colors ${
            showTip
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
              : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 border-zinc-700'
          }`}
          title="Consigne technique"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Répétitions & Temps de repos */}
      <div className="flex items-center gap-4 text-xs text-zinc-400 mb-4 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/60">
        <div className="flex items-center gap-1.5 font-medium text-zinc-200">
          <Dumbbell className="w-4 h-4 text-emerald-400" />
          <span>
            {exercise.sets} séries ×{' '}
            <strong className={`${timedInfo.isTimed ? 'text-cyan-400' : 'text-emerald-400'} font-bold`}>
              {exercise.reps} {timedInfo.isTimed ? 'maintien' : 'reps'}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-400 ml-auto font-mono">
          <Timer className="w-3.5 h-3.5 text-zinc-500" />
          <span>{exercise.restSeconds}s repos</span>
        </div>
      </div>

      {/* Bulle d'instruction dépliante */}
      {showTip && (
        <div className="mb-4 p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200 animate-fadeIn leading-relaxed">
          <strong className="text-cyan-400 font-bold block mb-1">💡 Consigne exécution :</strong>
          {exercise.tip}
        </div>
      )}

      {/* Bouton d'action rapide pour lancer le chrono d'effort (si exercice au temps) */}
      {timedInfo.isTimed && nextIncompleteSetIndex !== -1 && onStartEffortTimer && (
        <button
          onClick={() =>
            onStartEffortTimer(
              exercise,
              nextIncompleteSetIndex,
              timedInfo.totalSeconds,
              timedInfo.perSide
            )
          }
          className="w-full mb-3 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500/20 via-emerald-500/20 to-cyan-500/20 hover:from-cyan-500/30 hover:to-emerald-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99]"
        >
          <Play className="w-3.5 h-3.5 fill-current text-cyan-400" />
          <span>
            Démarrer le chrono : Série {nextIncompleteSetIndex + 1} ({exercise.reps})
          </span>
          <Flame className="w-3.5 h-3.5 text-amber-400 ml-1" />
        </button>
      )}

      {/* Boutons Séries (Checkboxes manuelles) */}
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: exercise.sets }).map((_, setIdx) => {
          const isDone = completedSetIndexes.includes(setIdx);

          return (
            <button
              key={setIdx}
              onClick={() => onToggleSet(exercise.id, setIdx, exercise.restSeconds)}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 border ${
                isDone
                  ? 'bg-emerald-500 text-zinc-950 border-emerald-400 shadow-md shadow-emerald-500/20 scale-[0.98]'
                  : 'bg-zinc-800 hover:bg-zinc-700/80 text-zinc-300 border-zinc-700 hover:border-zinc-600'
              }`}
            >
              {isDone ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Série {setIdx + 1}</span>
                </>
              ) : (
                <span>Série {setIdx + 1}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
