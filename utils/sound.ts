/**
 * Génère des signaux sonores sans fichier mp3 externe via l'AudioContext natif du navigateur.
 */

function getAudioContext(): AudioContext | null {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    return new AudioContextClass();
  } catch {
    return null;
  }
}

/**
 * Signal de fin de repos standard (La5 -> Ré6)
 */
export function playTimerBeep() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const playPulse = (freq: number, startTime: number, duration: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.15, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  };

  const now = ctx.currentTime;
  playPulse(880, now, 0.15);
  playPulse(1174.66, now + 0.2, 0.3);
}

/**
 * Carillon joyeux de fin d'effort (Do5 - Mi5 - Sol5) pour célébrer la série réussie !
 */
export function playSuccessChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  const now = ctx.currentTime;

  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + index * 0.12);

    gain.gain.setValueAtTime(0.2, now + index * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.12 + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + index * 0.12);
    osc.stop(now + index * 0.12 + 0.35);
  });
}

/**
 * Double bip vif pour avertir de changer de côté
 */
export function playSwitchSideBeep() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const playTone = (freq: number, startTime: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.18, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.12);
  };

  const now = ctx.currentTime;
  playTone(987.77, now); // B5
  playTone(987.77, now + 0.15);
}
