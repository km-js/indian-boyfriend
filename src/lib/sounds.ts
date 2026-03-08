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

/** Cute emotion change sound — rising sparkle */
export const playEmotionChange = () => {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.15);
  osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.25);
  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.3);
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

// ── Background music (romantic bird chirping) ──

let bgPlaying = false;
let bgChirpInterval: ReturnType<typeof setInterval> | null = null;
let bgChirpSources: OscillatorNode[] = [];
let rainSource: AudioBufferSourceNode | null = null;
let rainGain: GainNode | null = null;

/** Start a continuous soft rain layer */
const startRain = (ctx: AudioContext) => {
  const duration = 4; // seconds of buffer, looped
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  // Brown noise for natural rain texture
  let last = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  // Bandpass to shape rain character
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 1000;
  bp.Q.value = 0.5;

  // Highpass to remove rumble
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 300;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2); // gentle fade in

  source.connect(bp);
  bp.connect(hp);
  hp.connect(gain);
  gain.connect(ctx.destination);
  source.start();

  rainSource = source;
  rainGain = gain;
};

const stopRain = (ctx: AudioContext) => {
  if (rainGain) {
    rainGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 1);
  }
  setTimeout(() => {
    try { rainSource?.stop(); } catch {}
    rainSource = null;
    rainGain = null;
  }, 1200);
};

/** Single bird chirp — short sine sweep with harmonics */
const playChirp = (ctx: AudioContext, baseFreq: number, volume: number, time: number) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.connect(gain);
  gain.connect(ctx.destination);

  const dur = 0.08 + Math.random() * 0.06;
  osc.frequency.setValueAtTime(baseFreq, time);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * (1.2 + Math.random() * 0.6), time + dur * 0.4);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, time + dur);

  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(volume, time + 0.01);
  gain.gain.setValueAtTime(volume, time + dur * 0.5);
  gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

  osc.start(time);
  osc.stop(time + dur + 0.01);
  bgChirpSources.push(osc);

  // Harmonic overtone
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = "sine";
  osc2.frequency.value = baseFreq * 2;
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  gain2.gain.setValueAtTime(0, time);
  gain2.gain.linearRampToValueAtTime(volume * 0.3, time + 0.01);
  gain2.gain.exponentialRampToValueAtTime(0.001, time + dur);
  osc2.start(time);
  osc2.stop(time + dur + 0.01);
  bgChirpSources.push(osc2);
};

/** A multi-note bird phrase (2-5 chirps in quick succession) */
const playBirdPhrase = (ctx: AudioContext) => {
  const now = ctx.currentTime;
  const noteCount = 2 + Math.floor(Math.random() * 4);
  const baseFreq = 1800 + Math.random() * 2000;
  const vol = 0.04 + Math.random() * 0.04;

  for (let i = 0; i < noteCount; i++) {
    const freq = baseFreq + (Math.random() - 0.5) * 400;
    const time = now + i * (0.08 + Math.random() * 0.06);
    playChirp(ctx, freq, vol, time);
  }
};

export const startBgMusic = () => {
  if (bgPlaying) return;
  bgPlaying = true;
  const ctx = getCtx();

  // Start rain layer
  startRain(ctx);

  // Play initial chirps
  playBirdPhrase(ctx);
  setTimeout(() => bgPlaying && playBirdPhrase(ctx), 600);

  // Random chirps at varying intervals
  bgChirpInterval = setInterval(() => {
    if (!bgPlaying) return;
    playBirdPhrase(ctx);

    if (Math.random() > 0.5) {
      setTimeout(() => {
        if (bgPlaying) playBirdPhrase(ctx);
      }, 300 + Math.random() * 700);
    }
  }, 800 + Math.random() * 1200);
};

export const stopBgMusic = () => {
  bgPlaying = false;
  const ctx = getCtx();

  // Fade out rain
  stopRain(ctx);

  bgChirpSources.forEach((osc) => { try { osc.stop(); } catch {} });
  bgChirpSources = [];
  if (bgChirpInterval) {
    clearInterval(bgChirpInterval);
    bgChirpInterval = null;
  }
};

export const isBgMusicPlaying = () => bgPlaying;
