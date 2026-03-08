// Web Audio API sound effects — no external files needed

let audioCtx: AudioContext | null = null;

const getCtx = () => {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
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
  const notes = [523, 659, 784, 1047];
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

export const playBlip = () => {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.04);
  gain.gain.setValueAtTime(0.05, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.1);
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

const MELODY = [
  261.6, 293.7, 370.0, 392.0,
  440.0, 493.9, 523.3, 493.9,
  440.0, 392.0, 370.0, 293.7,
  261.6, 293.7, 392.0, 261.6,
];

const createRain = (ctx: AudioContext) => {
  const len = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 800;
  lp.Q.value = 0.5;

  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 400;
  bp.Q.value = 0.7;

  const gain = ctx.createGain();
  gain.gain.value = 0.08;

  source.connect(lp);
  lp.connect(bp);
  bp.connect(gain);
  gain.connect(ctx.destination);

  return { source, gain };
};

export const startBgMusic = () => {
  if (bgPlaying) return;
  bgPlaying = true;
  const ctx = getCtx();

  // Rain ambience
  const rain = createRain(ctx);
  rain.source.start();
  rainSource = rain.source;
  bgSources.push(rain.source);
  bgNodes.push(rain.gain);

  // Soft tanpura drone
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

  createDrone(130.8, 0.025);
  createDrone(196.0, 0.015);

  // Delay for warmth
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

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.connect(delay);

    const vibrato = ctx.createOscillator();
    const vibratoGain = ctx.createGain();
    vibrato.frequency.value = 5;
    vibratoGain.gain.value = 2;
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);
    vibrato.start(now);
    vibrato.stop(now + 1.2);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.045, now + 0.15);
    gain.gain.setValueAtTime(0.045, now + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.start(now);
    osc.stop(now + 1.3);

    noteIndex++;
  }, 1000);
};

export const stopBgMusic = () => {
  bgPlaying = false;
  bgSources.forEach((s) => { try { s.stop(); } catch {} });
  bgSources = [];
  bgNodes = [];
  rainSource = null;
  if (bgInterval) {
    clearInterval(bgInterval);
    bgInterval = null;
  }
};

export const isBgMusicPlaying = () => bgPlaying;
