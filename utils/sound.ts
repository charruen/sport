/**
  * Génère un signal sonore (bip-bip) sans fichier mp3 externe via l'Web Audio API native du navigateur.
  */
export function playTimerBeep() {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();

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
    // Bip 1 (880 Hz - La5)
    playPulse(880, now, 0.15);
    // Bip 2 (1174.66 Hz - Ré6)
    playPulse(1174.66, now + 0.2, 0.3);
  } catch (err) {
    console.warn('AudioContext non supporté ou bloqué par le navigateur:', err);
  }
}
