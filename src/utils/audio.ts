import { SoundEffectType } from '../types';

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public play(type: SoundEffectType) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      switch (type) {
        case 'vine_boom':
          this.playVineBoom(ctx);
          break;
        case 'airhorn':
          this.playAirhorn(ctx);
          break;
        case 'metal_pipe':
          this.playMetalPipe(ctx);
          break;
        case 'roblox_oof':
          this.playRobloxOof(ctx);
          break;
        case 'bruh':
          this.playBruh(ctx);
          break;
        case 'correct':
          this.playCorrect(ctx);
          break;
        case 'wrong':
          this.playWrong(ctx);
          break;
        case 'level_up':
          this.playLevelUp(ctx);
          break;
        case 'countdown_tick':
          this.playTick(ctx);
          break;
        case 'sad_violin':
          this.playSadViolin(ctx);
          break;
        case 'illuminati':
          this.playIlluminati(ctx);
          break;
        case 'game_over':
          this.playGameOver(ctx);
          break;
        case 'discord_ping':
          this.playDiscordPing(ctx);
          break;
        case 'windows_error':
          this.playWindowsError(ctx);
          break;
        case 'dun_dun_dun':
          this.playDunDunDun(ctx);
          break;
      }
    } catch {
      // Audio autoplay policy catch
    }
  }

  // Iconic Vine Boom: Deep resonant bass impact with slight distortion
  private playVineBoom(ctx: AudioContext) {
    const t = ctx.currentTime;
    
    // Sub bass oscillator
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const distortion = ctx.createWaveShaper();

    // Subtle drive curve
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    const k = 20;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    distortion.curve = curve;
    distortion.oversample = '4x';

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(32, t + 0.7);

    gain.gain.setValueAtTime(1.0, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

    osc.connect(distortion);
    distortion.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.95);

    // Initial punch click
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(350, t);
    clickOsc.frequency.exponentialRampToValueAtTime(40, t + 0.08);
    clickGain.gain.setValueAtTime(0.8, t);
    clickGain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);
    clickOsc.start(t);
    clickOsc.stop(t + 0.08);
  }

  // Iconic MLG Airhorn: triple blast
  private playAirhorn(ctx: AudioContext) {
    const blastTimes = [0, 0.14, 0.32];
    blastTimes.forEach((delay) => {
      const t = ctx.currentTime + delay;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';
      osc1.frequency.setValueAtTime(587.33, t); // D5
      osc2.frequency.setValueAtTime(592, t); // slight detune

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.13);
      osc2.stop(t + 0.13);
    });
  }

  // Iconic Metal Pipe: metallic clanging resonant frequencies
  private playMetalPipe(ctx: AudioContext) {
    const t = ctx.currentTime;
    const freqs = [385, 784, 1145, 1720, 2480, 3950];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.94, t + 1.2);

      const initVol = 0.15 / (idx + 1);
      gain.gain.setValueAtTime(initVol, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + (idx === 0 ? 1.4 : 0.8));

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 1.5);
    });
  }

  // Iconic Roblox Oof: upward pitch slide
  private playRobloxOof(ctx: AudioContext) {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.18);

    // Formant-like filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(650, t);
    filter.Q.setValueAtTime(3, t);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.23);
  }

  // Bruh: Downward vocal glide with resonant formant
  private playBruh(ctx: AudioContext) {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.35);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(500, t);
    filter.Q.setValueAtTime(4, t);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.38);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.4);
  }

  private playCorrect(ctx: AudioContext) {
    const t = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((note, i) => {
      const noteTime = t + i * 0.06;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note, noteTime);

      gain.gain.setValueAtTime(0.25, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(noteTime);
      osc.stop(noteTime + 0.16);
    });
  }

  private playWrong(ctx: AudioContext) {
    const t = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    osc1.frequency.setValueAtTime(130, t);
    osc2.frequency.setValueAtTime(123, t); // dissonant tritone-ish clash

    osc1.frequency.linearRampToValueAtTime(70, t + 0.35);
    osc2.frequency.linearRampToValueAtTime(65, t + 0.35);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.36);
    osc2.stop(t + 0.36);
  }

  private playLevelUp(ctx: AudioContext) {
    const t = ctx.currentTime;
    const melody = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
    melody.forEach((freq, i) => {
      const noteTime = t + i * 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, noteTime);
      gain.gain.setValueAtTime(0.18, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(noteTime);
      osc.stop(noteTime + 0.13);
    });
  }

  private playTick(ctx: AudioContext) {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.05);
  }

  private playSadViolin(ctx: AudioContext) {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const vibrato = ctx.createOscillator();
    const vibratoGain = ctx.createGain();
    const gain = ctx.createGain();

    vibrato.frequency.setValueAtTime(6, t); // 6 Hz vibrato
    vibratoGain.gain.setValueAtTime(10, t);
    vibrato.connect(osc.frequency);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(659.25, t); // E5
    osc.frequency.linearRampToValueAtTime(587.33, t + 0.6); // D5
    osc.frequency.linearRampToValueAtTime(523.25, t + 1.2); // C5

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    vibrato.start(t);
    osc.start(t);
    vibrato.stop(t + 1.4);
    osc.stop(t + 1.4);
  }

  private playIlluminati(ctx: AudioContext) {
    const t = ctx.currentTime;
    // Spooky X-files motif: E5 -> B4 -> G4 -> E4
    const notes = [659.25, 493.88, 392.00, 329.63];
    notes.forEach((freq, idx) => {
      const noteTime = t + idx * 0.25;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);
      gain.gain.setValueAtTime(0.2, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(noteTime);
      osc.stop(noteTime + 0.3);
    });
  }

  private playGameOver(ctx: AudioContext) {
    const t = ctx.currentTime;
    const notes = [440, 415, 392, 349];
    notes.forEach((freq, idx) => {
      const noteTime = t + idx * 0.15;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, noteTime);
      gain.gain.setValueAtTime(0.25, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(noteTime);
      osc.stop(noteTime + 0.25);
    });
  }

  // Iconic Discord Notification Ping (two sine tones: high B5 then F#5)
  private playDiscordPing(ctx: AudioContext) {
    const t = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(987.77, t); // B5
    gain1.gain.setValueAtTime(0.3, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.13);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(739.99, t + 0.08); // F#5
    gain2.gain.setValueAtTime(0.28, t + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.26);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(t + 0.08);
    osc2.stop(t + 0.28);
  }

  // Windows XP Critical Stop / Error Sound (chord clash: C4 + F#4 + A4)
  private playWindowsError(ctx: AudioContext) {
    const t = ctx.currentTime;
    const freqs = [261.63, 369.99, 440.00];
    freqs.forEach((f) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.5);
    });
  }

  // Dramatic Dun Dun Dunnn (classic soap opera / meme reveal: C# -> C# -> C)
  private playDunDunDun(ctx: AudioContext) {
    const t = ctx.currentTime;
    const hits = [
      { time: 0, freq: 277.18, dur: 0.2 }, // C#4
      { time: 0.26, freq: 277.18, dur: 0.2 }, // C#4
      { time: 0.56, freq: 261.63, dur: 0.8 }, // C4 dramatic hold
    ];

    hits.forEach((hit) => {
      const hitTime = t + hit.time;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';
      osc1.frequency.setValueAtTime(hit.freq, hitTime);
      osc2.frequency.setValueAtTime(hit.freq * 0.5, hitTime); // sub octave for dramatic weight

      gain.gain.setValueAtTime(0.35, hitTime);
      gain.gain.exponentialRampToValueAtTime(0.001, hitTime + hit.dur);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(hitTime);
      osc2.start(hitTime);
      osc1.stop(hitTime + hit.dur + 0.05);
      osc2.stop(hitTime + hit.dur + 0.05);
    });
  }

  // High-fidelity speech synthesis for Voice Mode with character profiling
  public speakMemeText(
    text: string, 
    pitch = 1.0, 
    rate = 1.0, 
    speakerName?: string,
    onEnd?: () => void
  ) {
    if (this.isMuted) {
      if (onEnd) onEnd();
      return;
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.play('roblox_oof');
      if (onEnd) setTimeout(onEnd, 1000);
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = 1.0;

      // Character-based cadence adjustments
      let targetPitch = pitch;
      let targetRate = rate;

      if (speakerName) {
        const sLower = speakerName.toLowerCase();
        if (sLower.includes('squidward')) {
          targetPitch = 1.55; // Nasal cartoon pitch
          targetRate = 0.95;
        } else if (sLower.includes('chill')) {
          targetPitch = 0.82; // Laid-back relaxed pitch
          targetRate = 0.85;
        } else if (sLower.includes('kai') || sLower.includes('streamer')) {
          targetPitch = 1.15; // Hype energetic pitch
          targetRate = 1.25;
        } else if (sLower.includes('caseoh')) {
          targetPitch = 0.72; // Deep resonant booming pitch
          targetRate = 1.1;
        } else if (sLower.includes('hawk') || sLower.includes('haliey')) {
          targetPitch = 1.28; // Playful southern drawl
          targetRate = 1.05;
        } else if (sLower.includes('sigma') || sLower.includes('chad')) {
          targetPitch = 0.65; // Ultra deep sigma grindset pitch
          targetRate = 0.85;
        }
      }

      utterance.pitch = Math.max(0.5, Math.min(2.0, targetPitch));
      utterance.rate = Math.max(0.6, Math.min(1.8, targetRate));

      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        // Look for quality natural English voices
        const preferred = voices.find(v => 
          (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Daniel') || v.name.includes('Samantha') || v.name.includes('Oliver')) 
          && v.lang.startsWith('en')
        ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
        
        if (preferred) utterance.voice = preferred;
      }

      if (onEnd) {
        utterance.onend = () => onEnd();
        utterance.onerror = () => onEnd();
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      if (onEnd) onEnd();
    }
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const soundManager = new SoundSynthesizer();
