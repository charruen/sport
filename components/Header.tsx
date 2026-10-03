'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Dumbbell, Trophy, Sparkles, Wifi, WifiOff } from 'lucide-react';
import { WeekProgram } from '@/types/program';

interface HeaderProps {
  currentWeek: WeekProgram;
  totalWeeks: number;
  completedSetsCount: number;
  totalSetsCount: number;
  isSupabaseOnline: boolean;
  onSelectWeek: (weekNum: number) => void;
}

export default function Header({
  currentWeek,
  totalWeeks,
  completedSetsCount,
  totalSetsCount,
  isSupabaseOnline,
  onSelectWeek,
}: HeaderProps) {
  const globalProgress = totalSetsCount > 0 ? Math.min(100, Math.round((completedSetsCount / totalSetsCount) * 100)) : 0;

  return (
    <header className="bg-zinc-950/80 border-b border-zinc-800/80 sticky top-0 z-40 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Titre Principal & Status Sync */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-600 to-cyan-500 text-zinc-950 shadow-lg shadow-emerald-500/20">
              <Dumbbell className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white">
                  Coach Sportif
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  34 Semaines
                </span>
              </div>
              <p className="text-xs text-zinc-400">Objectif Bras, Abdos & Pompes Diamant</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {isSupabaseOnline ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" title="Synchronisé avec Supabase">
                <Wifi className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-medium">Cloud Synced</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700" title="Sauvegarde locale (hors ligne)">
                <WifiOff className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-medium">Local Mode</span>
              </span>
            )}
          </div>
        </div>

        {/* Barre de Progression Globale (Saison) */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3.5 mb-4">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" /> Progression Saison 2026-2027
            </span>
            <span className="text-emerald-400 font-mono font-bold text-sm">
              {globalProgress}% <span className="text-zinc-500 font-normal text-xs">({completedSetsCount}/{totalSetsCount} séries)</span>
            </span>
          </div>
          <div className="w-full bg-zinc-950 rounded-full h-2.5 overflow-hidden border border-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500 rounded-full"
              style={{ width: `${globalProgress}%` }}
            />
          </div>
        </div>

        {/* Navigation Semaine & Phase */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-900/50 border border-zinc-800/60 p-3 rounded-2xl">
          {/* Flèches et Sélecteur */}
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <button
              onClick={() => onSelectWeek(Math.max(1, currentWeek.weekNumber - 1))}
              disabled={currentWeek.weekNumber === 1}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-zinc-800 text-zinc-200 transition-colors"
              title="Semaine précédente"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-center sm:text-left">
              <select
                value={currentWeek.weekNumber}
                onChange={(e) => onSelectWeek(Number(e.target.value))}
                className="bg-zinc-900 text-white font-bold text-sm rounded-lg px-2.5 py-1 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((wNum) => (
                  <option key={wNum} value={wNum}>
                    Semaine {wNum} / {totalWeeks}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                {currentWeek.startDate} — {currentWeek.endDate}
              </p>
            </div>

            <button
              onClick={() => onSelectWeek(Math.min(totalWeeks, currentWeek.weekNumber + 1))}
              disabled={currentWeek.weekNumber === totalWeeks}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-zinc-800 text-zinc-200 transition-colors"
              title="Semaine suivante"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Badge Phase Active */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-cyan-300 text-xs">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="truncate">
              <span className="font-bold">Phase {currentWeek.phaseNumber}:</span> {currentWeek.phaseTitle}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
