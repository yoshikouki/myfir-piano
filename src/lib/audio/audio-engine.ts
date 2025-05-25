import type { Pitch } from "@/features/keyboard/pitches";

export interface AudioEngine {
  load(): Promise<void>;
  playNote(pitch: Pitch, velocity: number): void;
  playNoteWithDuration(pitch: Pitch, velocity: number, duration: number, bpm: number): void;
  stopNote(pitch: Pitch): void;
}
