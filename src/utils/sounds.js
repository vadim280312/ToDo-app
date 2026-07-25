function playTone(freqs, duration, type = 'sine') {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
      gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + duration);
    });
  } catch (e) {}
}

export const SOUNDS = {
  add:      () => playTone([440], 0.12),
  complete: () => playTone([523.25, 659.25, 783.99], 0.18),
  delete:   () => playTone([280, 140], 0.14, 'sawtooth'),
  allDone:  () => playTone([523.25, 659.25, 783.99, 1046.50], 0.25),
  undo:     () => playTone([330, 440], 0.1)
};