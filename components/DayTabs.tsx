'use client';

import React from 'react';
import { Calendar, CheckCircle2, Moon, Activity } from 'lucide-react';
import { DaySchedule } from '@/types/program';

interface DayTabsProps {
  days: Record<string, DaySchedule>;
  activeDayId: string;
  dayCompletionStatus: Record<string, boolean>; // dayId -> true if all exercises done
  onSelectDay: (dayId: string) => void;
}

const DAY_KEYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

export default function DayTabs({
  days,
  activeDayId,
  dayCompletionStatus,
  onSelectDay,
}: DayTabsProps) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2 min-w-max px-1">
        {DAY_KEYS.map((key) => {
          const day = days[key];
          if (!day) return null;

          const isActive = activeDayId === key;
          const isDone = dayCompletionStatus[key];

          return (
            <button
              key={key}
              onClick={() => onSelectDay(key)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-500 text-zinc-950 font-bold shadow-lg shadow-emerald-500/20 scale-[1.02]'
                  : day.isRest
                  ? 'bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800/80'
                  : isDone
                  ? 'bg-zinc-900 text-emerald-400 border border-emerald-500/30'
                  : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              <span>{day.dayName}</span>

              {day.isRest ? (
                day.restReason === 'badminton' ? (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-zinc-950/20 text-zinc-950 font-extrabold' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                    Badminton
                  </span>
                ) : (
                  <Moon className={`w-3.5 h-3.5 ${isActive ? 'text-zinc-950' : 'text-zinc-500'}`} />
                )
              ) : isDone ? (
                <CheckCircle2 className={`w-3.5 h-3.5 ${isActive ? 'text-zinc-950' : 'text-emerald-400'}`} />
              ) : (
                <Activity className={`w-3.5 h-3.5 ${isActive ? 'text-zinc-950' : 'text-zinc-500'}`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
