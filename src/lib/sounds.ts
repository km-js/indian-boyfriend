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

// ── Background music (looping gentle melody) ──

let bgOscillators: OscillatorNode[] = [];
let bgGains: GainNode[] = [];
let bgPlaying = false;
let bgInterval: ReturnType<typeof setInterval> | null = null;

const BGM_NOTES = [
  // A gentle pentatonic lullaby loop
  392, 440, 494, 523, 587, 523, 494, 440,
  392, 349, 330, 349, 392, 440, 494, 440,
];

export const startBgMusic = () => {
  if (bgPlaying) return;
  bgPlaying = true;
  const ctx = getCtx();

  // Soft pad drone
  const pad = ctx.createOscillator();
  const padGain = ctx.createGain();
  pad.type = "sine";
  pad.frequency.value = 220;
  padGain.gain.value = 0.04;
  pad.connect(padGain);
  padGain.connect(ctx.destination);
  pad.start();
  bgOscillators.push(pad);
  bgGains.push(padGain);

  // Second harmonic
  const pad2 = ctx.createOscillator();
  const pad2Gain = ctx.createGain();
  pad2.type = "sine";
  pad2.frequency.value = 330;
  pad2Gain.gain.value = 0.025;
  pad2.connect(pad2Gain);
  pad2Gain.connect(ctx.destination);
  pad2.start();
  bgOscillators.push(pad2);
  bgGains.push(pad2Gain);

  // Melody notes
  let noteIndex = 0;
  bgInterval = setInterval(() => {
    if (!bgPlaying) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = BGM_NOTES[noteIndex % BGM_NOTES.length];
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.8);
    noteIndex++;
  }, 800);
};

export const stopBgMusic = () => {
  bgPlaying = false;
  bgOscillators.forEach((osc) => { try { osc.stop(); } catch {} });
  bgOscillators = [];
  bgGains = [];
  if (bgInterval) {
    clearInterval(bgInterval);
    bgInterval = null;
  }
};

export const isBgMusicPlaying = () => bgPlaying;
