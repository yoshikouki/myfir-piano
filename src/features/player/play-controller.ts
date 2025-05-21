import type { Pitch } from "@/features/keyboard/pitches";
import type { AudioEngine } from "@/lib/audio/audio-engine";
import type { Song } from "@/lib/song.schema";

export class PlayController {
  constructor(private engine: AudioEngine) {}

  song: Song | undefined;
  index = 0;

  async load(song: Song) {
    this.song = song;
    await this.engine.load();
  }

  press(pitch: Pitch) {
    if (!this.song) return;
    const note = this.song.notes[this.index];
    if (note.pitch === pitch) {
      this.engine.playNote(pitch, 1);
      this.index += 1;
    }
  }
}
