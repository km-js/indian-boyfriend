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

// ── Background music (soft rain + Bollywood-romantic melody) ──

let bgNodes: AudioNode[] = [];
let bgSources: (OscillatorNode | AudioBufferSourceNode)[] = [];
let bgPlaying = false;
let bgInterval: ReturnType<typeof setInterval> | null = null;
let rainSource: AudioBufferSourceNode | null = null;
let bgInterval: ReturnType<typeof setInterval> | null = null;

// Raag Yaman-inspired notes (romantic Bollywood feel) in Hz
// Sa Re Ga(tivra) Ma Pa Dha Ni Sa — C D F# G A B C
const MELODY = [
  // Phrase 1: ascending
  261.6, 293.7, 370.0, 392.0,
  // Phrase 2: pause on Pa, descend
  440.0, 493.9, 523.3, 493.9,
  // Phrase 3: gentle descent
  440.0, 392.0, 370.0, 293.7,
  // Phrase 4: resolve
  261.6, 293.7, 392.0, 261.6,
];

export const startBgMusic = () => {
  if (bgPlaying) return;
  bgPlaying = true;
  const ctx = getCtx();

  // Soft tanpura-like drone (Sa + Pa)
  const createDrone = (freq: number, vol: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.value = vol;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    bgSources.push(osc);
    bgNodes.push(gain);
  };

  createDrone(130.8, 0.035); // Sa (low)
  createDrone(196.0, 0.02);  // Pa (low)
  createDrone(261.6, 0.015); // Sa (mid, soft)

  // Reverb-like delay for warmth
  const delay = ctx.createDelay(0.5);
  delay.delayTime.value = 0.3;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.25;
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(ctx.destination);
  bgNodes.push(delay, feedback);

  // Melody loop
  let noteIndex = 0;
  bgInterval = setInterval(() => {
    if (!bgPlaying) return;
    const now = ctx.currentTime;
    const freq = MELODY[noteIndex % MELODY.length];

    // Main note (triangle for flute-like warmth)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.connect(delay); // feed into delay for reverb

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
    gain.gain.linearRampToValueAtTime(0.055, now + 0.15);
    gain.gain.setValueAtTime(0.055, now + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.start(now);
    osc.stop(now + 1.3);

    noteIndex++;
  }, 1000);
};

export const stopBgMusic = () => {
  bgPlaying = false;
  bgSources.forEach((osc) => { try { osc.stop(); } catch {} });
  bgSources = [];
  bgNodes = [];
  if (bgInterval) {
    clearInterval(bgInterval);
    bgInterval = null;
  }
};

export const isBgMusicPlaying = () => bgPlaying;
