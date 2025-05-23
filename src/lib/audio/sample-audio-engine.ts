import type { Pitch } from "@/features/keyboard/pitches";
import * as Tone from "tone";
import type { AudioEngine } from "./audio-engine";

export class SampleAudioEngine implements AudioEngine {
  private synth: Tone.Synth | null = null;
  private loaded = false;

  async load(): Promise<void> {
    if (this.loaded) return;

    this.synth = new Tone.Synth({
      oscillator: {
        type: "sine",
      },
      envelope: {
        attack: 0.05,
        decay: 0.3,
        sustain: 0.2,
        release: 0.8,
      },
    }).toDestination();

    await Tone.start();
    this.loaded = true;
  }

  playNote(pitch: Pitch, velocity: number): void {
    if (!this.synth || !this.loaded) return;

    const note = this.pitchToNote(pitch);
    this.synth.triggerAttackRelease(note, "8n", undefined, velocity * 0.8);
  }

  private pitchToNote(pitch: Pitch): string {
    const noteMap: Record<Pitch, string> = {
      A3: "A3",
      "A#3": "A#3",
      B3: "B3",
      C4: "C4",
      "C#4": "C#4",
      D4: "D4",
      "D#4": "D#4",
      E4: "E4",
      F4: "F4",
      "F#4": "F#4",
      G4: "G4",
      "G#4": "G#4",
      A4: "A4",
      "A#4": "A#4",
      B4: "B4",
      C5: "C5",
      "C#5": "C#5",
      D5: "D5",
      "D#5": "D#5",
      E5: "E5",
      F5: "F5",
      "F#5": "F#5",
      G5: "G5",
    };
    return noteMap[pitch];
  }
}
