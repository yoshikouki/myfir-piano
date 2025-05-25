import type { Pitch } from "@/features/keyboard/pitches";
import type { AudioEngine } from "@/lib/audio/audio-engine";
import type { Song } from "@/songs/song.schema";

export class PlayController {
  constructor(private engine: AudioEngine) {}

  song: Song | undefined;
  index = 0;

  get audioEngine(): AudioEngine {
    return this.engine;
  }

  async load(song: Song) {
    this.song = song;
    await this.engine.load();
  }

  press(pitch: Pitch) {
    if (!this.song) return;
    this.engine.playNote(pitch, 1);
    const note = this.song.notes[this.index];
    if (note.pitch === pitch) {
      this.index += 1;
    }
  }

  async ensureAudioEngineLoaded() {
    await this.engine.load();
  }

  getCurrentNote() {
    if (!this.song || this.index >= this.song.notes.length) return undefined;
    return this.song.notes[this.index];
  }

  isCompleted() {
    return this.song && this.index >= this.song.notes.length;
  }

  reset() {
    this.index = 0;
  }
}
