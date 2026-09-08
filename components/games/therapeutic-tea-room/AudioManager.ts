type OscillatorHandle = {
  oscillator: OscillatorNode;
  gain: GainNode;
};

/**
 * A small procedural-audio adapter. Replace the methods with decoded assets
 * later without changing any interaction code.
 */
export class AudioManager {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambience: AudioBufferSourceNode | null = null;
  private ambienceGain: GainNode | null = null;
  private radioNotes: OscillatorHandle[] = [];
  private enabled = true;

  constructor(enabled = true) {
    this.enabled = enabled;
  }

  async start() {
    if (!this.enabled) return;

    const AudioContextClass = window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return;

    if (!this.context) {
      this.context = new AudioContextClass();
      this.master = this.context.createGain();
      this.master.gain.value = 0.36;
      this.master.connect(this.context.destination);
      this.startAmbience();
    }

    await this.context.resume();
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!this.master || !this.context) return;
    this.master.gain.setTargetAtTime(enabled ? 0.36 : 0.0001, this.context.currentTime, 0.15);
  }

  setOutdoorPresence(active: boolean) {
    if (!this.ambienceGain || !this.context) return;
    this.ambienceGain.gain.setTargetAtTime(active ? 0.1 : 0.045, this.context.currentTime, 0.6);
  }

  playKettle() {
    this.softTone(196, 0.18, "sine", 0.16);
    this.softTone(392, 0.11, "sine", 0.06, 0.08);
  }

  playCup() {
    this.softTone(1480, 0.09, "sine", 0.1);
    this.softTone(2210, 0.06, "sine", 0.035, 0.015);
  }

  playBasket() {
    this.softTone(260, 0.1, "triangle", 0.08);
    this.softTone(390, 0.07, "triangle", 0.04, 0.04);
  }

  playPhoto() {
    this.softTone(523, 0.22, "sine", 0.07);
    this.softTone(659, 0.2, "sine", 0.05, 0.08);
  }

  playPlant() {
    this.softTone(740, 0.16, "sine", 0.045);
  }

  playWindow() {
    this.softTone(330, 0.22, "sine", 0.05);
    this.softTone(494, 0.18, "sine", 0.035, 0.08);
  }

  toggleRadio(active: boolean) {
    this.stopRadio();
    if (!active || !this.context || !this.master || !this.enabled) return;

    const now = this.context.currentTime;
    [261.63, 329.63, 392].forEach((frequency, index) => {
      const oscillator = this.context!.createOscillator();
      const gain = this.context!.createGain();
      oscillator.type = index === 0 ? "triangle" : "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(index === 0 ? 0.018 : 0.011, now + 0.5);
      oscillator.connect(gain).connect(this.master!);
      oscillator.start();
      this.radioNotes.push({ oscillator, gain });
    });
  }

  dispose() {
    this.stopRadio();
    this.ambience?.stop();
    this.ambience?.disconnect();
    this.master?.disconnect();
    void this.context?.close();
    this.context = null;
    this.master = null;
    this.ambience = null;
    this.ambienceGain = null;
  }

  private startAmbience() {
    if (!this.context || !this.master) return;

    const sampleRate = this.context.sampleRate;
    const buffer = this.context.createBuffer(1, sampleRate * 2, sampleRate);
    const data = buffer.getChannelData(0);
    let previous = 0;
    for (let index = 0; index < data.length; index += 1) {
      const white = Math.random() * 2 - 1;
      previous = previous * 0.985 + white * 0.015;
      data[index] = previous;
    }

    const source = this.context.createBufferSource();
    const filter = this.context.createBiquadFilter();
    const gain = this.context.createGain();
    source.buffer = buffer;
    source.loop = true;
    filter.type = "lowpass";
    filter.frequency.value = 700;
    gain.gain.value = 0.045;
    source.connect(filter).connect(gain).connect(this.master);
    source.start();
    this.ambience = source;
    this.ambienceGain = gain;
  }

  private softTone(
    frequency: number,
    duration: number,
    type: OscillatorType,
    volume: number,
    delay = 0
  ) {
    if (!this.context || !this.master || !this.enabled) return;
    const start = this.context.currentTime + delay;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain).connect(this.master);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);
  }

  private stopRadio() {
    if (!this.context) return;
    this.radioNotes.forEach(({ oscillator, gain }) => {
      gain.gain.setTargetAtTime(0.0001, this.context!.currentTime, 0.08);
      oscillator.stop(this.context!.currentTime + 0.3);
    });
    this.radioNotes = [];
  }
}
