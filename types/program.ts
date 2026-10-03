export interface Exercise {
  id: string;
  name: string;
  target: 'Triceps' | 'Biceps' | 'Pectoraux' | 'Épaules' | 'Dos' | 'Abdos' | 'Mollets' | 'Full Body';
  sets: number;
  reps: string; // e.g. "10", "12", "30s", "1m", "4s desc."
  restSeconds: number;
  tip: string;
}

export interface DaySchedule {
  dayId: 'lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi' | 'samedi' | 'dimanche';
  dayName: string;
  isRest: boolean;
  restReason?: string;
  subtitle?: string;
  exercises: Exercise[];
}

export interface WeekProgram {
  weekNumber: number;
  startDate: string; // e.g. "05 Oct 2026"
  endDate: string;   // e.g. "11 Oct 2026"
  phaseNumber: number;
  phaseTitle: string;
  phaseDescription: string;
  days: Record<string, DaySchedule>;
}

export interface ProgramData {
  weeks: WeekProgram[];
  phases: {
    number: number;
    title: string;
    description: string;
    weeksRange: string;
  }[];
}

export interface ProgressItem {
  week_number: number;
  day_id: string;
  exercise_id: string;
  set_index: number;
  completed: boolean;
  completed_at?: string;
}
