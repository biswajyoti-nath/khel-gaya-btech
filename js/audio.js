// CYBER//BRAINROT SYNTHESIS AUDIO ENGINE (Zero-Dependency Web Audio API)
class CyberAudio {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('cbr_muted') === 'true';
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('cbr_muted', this.muted);
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.1) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy catch
    }
  }

  // SOUND EFFECTS
  click() {
    this.playTone(800, 'triangle', 0.04, 0.05);
  }

  flip() {
    this.playTone(440, 'sine', 0.08, 0.07);
    setTimeout(() => this.playTone(660, 'sine', 0.08, 0.07), 40);
  }

  correct() {
    this.playTone(523.25, 'triangle', 0.1, 0.12); // C5
    setTimeout(() => this.playTone(659.25, 'triangle', 0.1, 0.12), 80); // E5
    setTimeout(() => this.playTone(783.99, 'triangle', 0.18, 0.14), 160); // G5
  }

  wrong() {
    this.playTone(280, 'sawtooth', 0.12, 0.1);
    setTimeout(() => this.playTone(220, 'sawtooth', 0.22, 0.12), 100);
  }

  streak() {
    const notes = [587.33, 739.99, 880, 1174.66]; // D5, F#5, A5, D6
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.15, 0.1), idx * 70);
    });
  }

  victory() {
    const fan = [440, 554.37, 659.25, 880, 1108.73];
    fan.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'square', 0.2, 0.08), idx * 90);
    });
  }
}

window.cyberSound = new CyberAudio();
