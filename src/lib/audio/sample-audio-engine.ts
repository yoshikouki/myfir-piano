import type { Pitch } from "@/features/keyboard/pitches";
import type * as ToneTypes from "tone";
import type { AudioEngine } from "./audio-engine";

export class SampleAudioEngine implements AudioEngine {
  private synth: ToneTypes.PolySynth | null = null;
  private loaded = false;
  private Tone: typeof ToneTypes | null = null;

  async load(): Promise<void> {
    if (this.loaded) return;

    const Tone = await import("tone");
    this.Tone = Tone;

    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: "triangle",
      },
      envelope: {
        attack: 0.01,
        decay: 0.8,
        sustain: 0.3,
        release: 2.5,
      },
    }).toDestination();

    await Tone.start();
    this.loaded = true;
  }

  playNote(pitch: Pitch, velocity: number): void {
    if (!this.synth || !this.loaded) return;

    const note = this.pitchToNote(pitch);
    this.synth.triggerAttackRelease(note, "4n", undefined, velocity * 0.8);
  }

  playNoteWithDuration(pitch: Pitch, velocity: number, duration: number, bpm: number): void {
    if (!this.synth || !this.loaded) return;

    const note = this.pitchToNote(pitch);
    const durationInSeconds = (60 / bpm) * duration;

    if (duration > 1) {
      const sustainLevel = Math.max(0.05, 0.3 - (duration - 1) * 0.05);
      const decayTime = Math.min(1.5, 0.8 + (duration - 1) * 0.2);

      this.synth.set({
        envelope: {
          attack: 0.01,
          decay: decayTime,
          sustain: sustainLevel,
          release: 2.5,
        },
      });
    }

    this.synth.triggerAttackRelease(note, durationInSeconds, undefined, velocity * 0.8);
  }

  stopNote(pitch: Pitch): void {
    if (!this.synth || !this.loaded) return;

    const note = this.pitchToNote(pitch);
    this.synth.triggerRelease(note);
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
