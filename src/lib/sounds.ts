// Web Audio API sound effects — no external files needed

let audioCtx: AudioContext | null = null;

const getCtx = () => {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
};

/** Soft tap / click */
export const playTap = () => {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.1);
};

/** Swoosh transition between steps */
export const playSwoosh = () => {
  const ctx = getCtx();
  const bufferSize = ctx.sampleRate * 0.25;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.setValueAtTime(2000, ctx.currentTime);
  bandpass.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.2);
  bandpass.Q.value = 2;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

  source.connect(bandpass);
  bandpass.connect(gain);
  gain.connect(ctx.destination);
  source.start(ctx.currentTime);
};

/** Magical chime / sparkle for reveal */
export const playChime = () => {
  const ctx = getCtx();
  const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(ctx.destination);

    const startTime = ctx.currentTime + i * 0.12;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

    osc.start(startTime);
    osc.stop(startTime + 0.6);
  });
};

/** Soft pop for incoming/outgoing messages */
export const playMessagePop = (incoming = true) => {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.setValueAtTime(incoming ? 880 : 660, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(incoming ? 440 : 330, ctx.currentTime + 0.12);
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.15);
};

// ── Background music (romantic soft rain + gentle melody) ──

let bgPlaying = false;
let bgSourceNode: AudioBufferSourceNode | null = null;
let bgGainNode: GainNode | null = null;
let bgMelodyInterval: ReturnType<typeof setInterval> | null = null;
let bgMelodySources: OscillatorNode[] = [];

// Romantic melody notes (Raag Yaman-inspired) in Hz
const MELODY = [
  261.6, 293.7, 370.0, 392.0,
  440.0, 493.9, 523.3, 493.9,
  440.0, 392.0, 370.0, 293.7,
  261.6, 293.7, 392.0, 261.6,
];

export const startBgMusic = () => {
  if (bgPlaying) return;
  bgPlaying = true;
  const ctx = getCtx();

  // ── Soft rain layer (brown noise) ──
  const duration = 4;
  const sampleRate = ctx.sampleRate;
  const bufferSize = sampleRate * duration;
  const buffer = ctx.createBuffer(2, bufferSize, sampleRate);

  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.02 * white) / 1.02;
      data[i] = lastOut * 3.5;
    }
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.value = 800;
  bandpass.Q.value = 0.5;

  const highpass = ctx.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 200;

  const rainGain = ctx.createGain();
  rainGain.gain.value = 0.14;

  source.connect(highpass);
  highpass.connect(bandpass);
  bandpass.connect(rainGain);
  rainGain.connect(ctx.destination);
  source.start();
  bgSourceNode = source;
  bgGainNode = rainGain;

  // ── Soft romantic melody layer ──
  const delay = ctx.createDelay(0.5);
  delay.delayTime.value = 0.3;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.2;
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(ctx.destination);

  let noteIndex = 0;
  bgMelodyInterval = setInterval(() => {
    if (!bgPlaying) return;
    const now = ctx.currentTime;
    const freq = MELODY[noteIndex % MELODY.length];

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.connect(delay);

    // Gentle vibrato
    const vibrato = ctx.createOscillator();
    const vibratoGain = ctx.createGain();
    vibrato.frequency.value = 5;
    vibratoGain.gain.value = 2;
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);
    vibrato.start(now);
    vibrato.stop(now + 1.2);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.15);
    gain.gain.setValueAtTime(0.04, now + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.start(now);
    osc.stop(now + 1.3);
    bgMelodySources.push(osc);

    noteIndex++;
  }, 1200);
};

export const stopBgMusic = () => {
  bgPlaying = false;
  if (bgSourceNode) {
    try { bgSourceNode.stop(); } catch {}
    bgSourceNode = null;
  }
  bgGainNode = null;
  bgMelodySources.forEach((osc) => { try { osc.stop(); } catch {} });
  bgMelodySources = [];
  if (bgMelodyInterval) {
    clearInterval(bgMelodyInterval);
    bgMelodyInterval = null;
  }
};

export const isBgMusicPlaying = () => bgPlaying;
