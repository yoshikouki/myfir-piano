import type { Pitch } from "@/features/keyboard/pitches";
import type { AudioEngine } from "./audio-engine";

export class SampleAudioEngine implements AudioEngine {
  private ctx: AudioContext | null = null;
  private buffers = new Map<Pitch, AudioBuffer>();

  async load() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }

    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }

    const baseFreq = 261.63;
    const pitchToSemitone: Record<Pitch, number> = {
      C3: -12,
      "C#3": -11,
      D3: -10,
      "D#3": -9,
      E3: -8,
      F3: -7,
      "F#3": -6,
      G3: -5,
      "G#3": -4,
      A3: -3,
      "A#3": -2,
      B3: -1,
      C4: 0,
      "C#4": 1,
      D4: 2,
      "D#4": 3,
      E4: 4,
      F4: 5,
      "F#4": 6,
      G4: 7,
      "G#4": 8,
      A4: 9,
      "A#4": 10,
      B4: 11,
      C5: 12,
    };

    for (const [pitch, semitone] of Object.entries(pitchToSemitone)) {
      const frequency = baseFreq * 2 ** (semitone / 12);
      const buffer = this.createToneBuffer(frequency, 1.0);
      this.buffers.set(pitch as Pitch, buffer);
    }
  }

  private createToneBuffer(frequency: number, duration: number): AudioBuffer {
    if (!this.ctx) throw new Error("AudioContext not initialized");

    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      data[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 2);
    }

    return buffer;
  }

  playNote(pitch: Pitch, velocity: number) {
    if (!this.ctx) return;

    const buffer = this.buffers.get(pitch);
    if (!buffer) return;

    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.value = velocity * 0.3;
    src.connect(gain).connect(this.ctx.destination);
    src.start();
  }
}
