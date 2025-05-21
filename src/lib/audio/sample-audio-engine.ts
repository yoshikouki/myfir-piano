import type { Pitch } from "@/features/keyboard/pitches";
import type { AudioEngine } from "./audio-engine";

export class SampleAudioEngine implements AudioEngine {
  private ctx = new AudioContext();
  private buffers = new Map<Pitch, AudioBuffer>();

  async load() {
    await Promise.all(Array.from(this.buffers.keys()).map(() => Promise.resolve()));
  }

  register(pitch: Pitch, buffer: AudioBuffer) {
    this.buffers.set(pitch, buffer);
  }

  playNote(pitch: Pitch, velocity: number) {
    const buffer = this.buffers.get(pitch);
    if (!buffer) return;
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.value = velocity;
    src.connect(gain).connect(this.ctx.destination);
    src.start();
  }
}
