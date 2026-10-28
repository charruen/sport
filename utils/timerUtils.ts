export interface TimedRepInfo {
  isTimed: boolean;
  totalSeconds: number;
  perSide: boolean;
  rawSeconds: number;
}

/**
 * Analyse une chaîne de répétitions (ex: "30s", "45s", "1m", "1m15", "20s/côté")
 * pour déterminer s'il s'agit d'un exercice au temps (gainage, isométrie)
 * et extraire sa durée en secondes.
 */
export function parseTimedReps(reps: string): TimedRepInfo {
  if (!reps) return { isTimed: false, totalSeconds: 0, perSide: false, rawSeconds: 0 };

  const clean = reps.trim().toLowerCase();

  // Format en secondes, ex: "30s", "45s", "20s/côté", "25s/cote", "20s/jambe"
  const secMatch = clean.match(/^(\d+)\s*s(?:ec)?(?:\/(?:côté|cote|jambe))?$/);
  if (secMatch) {
    const sec = parseInt(secMatch[1], 10);
    const perSide = clean.includes('côté') || clean.includes('cote') || clean.includes('jambe');
    return {
      isTimed: true,
      rawSeconds: sec,
      totalSeconds: sec,
      perSide,
    };
  }

  // Format en minutes et secondes, ex: "1m", "1m15", "1m30", "1min30"
  const minMatch = clean.match(/^(\d+)\s*m(?:in)?(?:\s*(\d+))?(?:\/(?:côté|cote))?$/);
  if (minMatch) {
    const min = parseInt(minMatch[1], 10);
    const sec = minMatch[2] ? parseInt(minMatch[2], 10) : 0;
    const total = min * 60 + sec;
    const perSide = clean.includes('côté') || clean.includes('cote');
    return {
      isTimed: true,
      rawSeconds: total,
      totalSeconds: total,
      perSide,
    };
  }

  return { isTimed: false, totalSeconds: 0, perSide: false, rawSeconds: 0 };
}
