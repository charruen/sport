'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import DayTabs from '@/components/DayTabs';
import ExerciseCard from '@/components/ExerciseCard';
import RestTimer from '@/components/RestTimer';
import EquipmentTip from '@/components/EquipmentTip';
import programDataRaw from '@/data/program.json';
import { ProgramData, WeekProgram, DaySchedule } from '@/types/program';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Trophy, Dumbbell, Sparkles, Moon, Activity, CheckCircle2 } from 'lucide-react';

const programData = programDataRaw as unknown as ProgramData;

export default function Page() {
  const [currentWeekNumber, setCurrentWeekNumber] = useState<number>(1);
  const [activeDayId, setActiveDayId] = useState<string>('lundi');
  const [progressMap, setProgressMap] = useState<Record<string, boolean>>({});
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [timerData, setTimerData] = useState<{ initialSeconds: number; exerciseName?: string } | null>(null);

  // Charger la progression initiale depuis localStorage puis Supabase
  useEffect(() => {
    // 1. Charger localStorage immédiatement
    try {
      const localData = localStorage.getItem('coach_user_progress');
      if (localData) {
        setProgressMap(JSON.parse(localData));
      }
    } catch (err) {
      console.warn('Erreur lecture localStorage:', err);
    }

    // 2. Charger Supabase si configuré
    if (supabase) {
      const client = supabase;
      const fetchSupabaseProgress = async () => {
        try {
          const { data, error } = await client
            .from('user_progress')
            .select('week_number, day_id, exercise_id, set_index, completed');

          if (!error && data) {
            const newMap: Record<string, boolean> = {};
            data.forEach((row) => {
              if (row.completed) {
                const key = `${row.week_number}_${row.day_id}_${row.exercise_id}_${row.set_index}`;
                newMap[key] = true;
              }
            });

            setProgressMap((prev) => {
              const merged = { ...prev, ...newMap };
              localStorage.setItem('coach_user_progress', JSON.stringify(merged));
              return merged;
            });
            setIsOnline(true);
          }
        } catch (err) {
          console.warn('Supabase fetch offline or failed:', err);
          setIsOnline(false);
        }
      };

      fetchSupabaseProgress();
    }
  }, []);

  // Synchroniser avec Supabase lors des changements d'état
  const handleToggleSet = async (exerciseId: string, setIndex: number, restSeconds: number) => {
    const key = `${currentWeekNumber}_${activeDayId}_${exerciseId}_${setIndex}`;
    const nextState = !progressMap[key];

    // Mise à jour locale immédiate
    const updatedMap = { ...progressMap, [key]: nextState };
    setProgressMap(updatedMap);
    try {
      localStorage.setItem('coach_user_progress', JSON.stringify(updatedMap));
    } catch (err) {
      console.warn('Erreur sauvegarde localStorage:', err);
    }

    // Lancer le minuteur de repos si la série a été validée
    if (nextState) {
      const currentWeekObj = programData.weeks.find((w) => w.weekNumber === currentWeekNumber);
      const dayObj = currentWeekObj?.days[activeDayId];
      const exObj = dayObj?.exercises.find((e) => e.id === exerciseId);

      setTimerData({
        initialSeconds: restSeconds,
        exerciseName: exObj ? `${exObj.name} — Série ${setIndex + 1}` : undefined,
      });
    }

    // Persistance Supabase (UPSERT)
    if (supabase) {
      const client = supabase;
      try {
        const { error } = await client
          .from('user_progress')
          .upsert(
            {
              week_number: currentWeekNumber,
              day_id: activeDayId,
              exercise_id: exerciseId,
              set_index: setIndex,
              completed: nextState,
              completed_at: new Date().toISOString(),
            },
            { onConflict: 'week_number,day_id,exercise_id,set_index' }
          );

        if (error) console.warn('Supabase upsert warning:', error.message);
        else setIsOnline(true);
      } catch (err) {
        console.warn('Supabase upsert failed (working offline):', err);
        setIsOnline(false);
      }
    }
  };

  // Obtenir la semaine active
  const currentWeek: WeekProgram = useMemo(() => {
    return programData.weeks.find((w) => w.weekNumber === currentWeekNumber) || programData.weeks[0];
  }, [currentWeekNumber]);

  // Obtenir le jour actif
  const currentDay: DaySchedule = useMemo(() => {
    return currentWeek.days[activeDayId] || currentWeek.days['lundi'];
  }, [currentWeek, activeDayId]);

  // Calcul du nombre total de séries dans tout le programme (34 semaines)
  const totalSetsCount = useMemo(() => {
    let count = 0;
    programData.weeks.forEach((w) => {
      Object.values(w.days).forEach((d) => {
        d.exercises.forEach((ex) => {
          count += ex.sets;
        });
      });
    });
    return count;
  }, []);

  // Calcul des séries complétées
  const completedSetsCount = useMemo(() => {
    return Object.values(progressMap).filter(Boolean).length;
  }, [progressMap]);

  // Statut d'achèvement de chaque jour dans la semaine active
  const dayCompletionStatus = useMemo(() => {
    const status: Record<string, boolean> = {};
    Object.keys(currentWeek.days).forEach((dKey) => {
      const dayObj = currentWeek.days[dKey];
      if (dayObj.isRest || dayObj.exercises.length === 0) {
        status[dKey] = true;
      } else {
        let allDone = true;
        dayObj.exercises.forEach((ex) => {
          for (let s = 0; s < ex.sets; s++) {
            const key = `${currentWeekNumber}_${dKey}_${ex.id}_${s}`;
            if (!progressMap[key]) {
              allDone = false;
            }
          }
        });
        status[dKey] = allDone;
      }
    });
    return status;
  }, [currentWeek, currentWeekNumber, progressMap]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-zinc-950">
      {/* Header avec progression et sélecteur de semaine */}
      <Header
        currentWeek={currentWeek}
        totalWeeks={programData.weeks.length}
        completedSetsCount={completedSetsCount}
        totalSetsCount={totalSetsCount}
        isSupabaseOnline={isOnline}
        onSelectWeek={(wNum) => setCurrentWeekNumber(wNum)}
      />

      {/* Contenu principal */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">
        {/* Onglets des jours */}
        <DayTabs
          days={currentWeek.days}
          activeDayId={activeDayId}
          dayCompletionStatus={dayCompletionStatus}
          onSelectDay={(dId) => setActiveDayId(dId)}
        />

        {/* Bannière du jour */}
        <div className="mt-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                {currentDay.dayName}
                {currentDay.isRest && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                    Repos
                  </span>
                )}
              </h2>
              {currentDay.subtitle && (
                <p className="text-xs text-zinc-400 mt-0.5">{currentDay.subtitle}</p>
              )}
            </div>

            {!currentDay.isRest && dayCompletionStatus[activeDayId] && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4" /> Séance Validée !
              </span>
            )}
          </div>
        </div>

        {/* Conseil matériel anti-glisse */}
        <EquipmentTip />

        {/* Vue Séance / Exercices ou Vue Repos */}
        {currentDay.isRest ? (
          <div className="my-8 p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 text-center flex flex-col items-center justify-center">
            {currentDay.restReason === 'badminton' ? (
              <>
                <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-400 mb-4 border border-amber-500/20">
                  <Activity className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">Option Badminton (18h-20h)</h3>
                <p className="text-sm text-zinc-400 max-w-md mt-2 leading-relaxed">
                  Cette séance au lycée compte comme ton travail <strong className="text-amber-300">cardio et membres inférieurs</strong>. Repos total sur le haut du corps à la maison !
                </p>
              </>
            ) : (
              <>
                <div className="p-4 rounded-2xl bg-zinc-800 text-zinc-400 mb-4 border border-zinc-700">
                  <Moon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">Jour de Repos Musculaire</h3>
                <p className="text-sm text-zinc-400 max-w-md mt-2 leading-relaxed">
                  Les fibres musculaires se reconstruisent pendant le repos et le sommeil. Mange à ta faim, reste bien hydraté et recharge les batteries !
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {currentDay.exercises.map((ex) => {
              // Récupérer les indices des séries complétées pour cet exercice
              const completedIndexes: number[] = [];
              for (let s = 0; s < ex.sets; s++) {
                const key = `${currentWeekNumber}_${activeDayId}_${ex.id}_${s}`;
                if (progressMap[key]) {
                  completedIndexes.push(s);
                }
              }

              return (
                <ExerciseCard
                  key={ex.id}
                  exercise={ex}
                  completedSetIndexes={completedIndexes}
                  onToggleSet={handleToggleSet}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* Minuteur de repos flottant (si actif) */}
      {timerData && (
        <RestTimer
          initialSeconds={timerData.initialSeconds}
          exerciseName={timerData.exerciseName}
          onClose={() => setTimerData(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-500">
        <p>Coach Musculation Personnel — 34 Semaines (Oct. 2026 à Mai 2027)</p>
      </footer>
    </div>
  );
}