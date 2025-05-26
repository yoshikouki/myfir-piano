import type { Pitch } from "@/features/keyboard/pitches";
import * as Tone from "tone";
import type { AudioEngine } from "./audio-engine";

export class PianoAudioEngine implements AudioEngine {
  private synth: Tone.PolySynth | null = null;
  private reverb: Tone.Reverb | null = null;
  private chorus: Tone.Chorus | null = null;
  private eq: Tone.EQ3 | null = null;
  private loaded = false;

  async load(): Promise<void> {
    if (this.loaded) return;

    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: "fmsine",
        modulationType: "sine",
        modulationIndex: 2,
        harmonicity: 3,
      },
      envelope: {
        attack: 0.001,
        decay: 0.3,
        sustain: 0.1,
        release: 1.2,
        attackCurve: "exponential",
        decayCurve: "exponential",
        releaseCurve: "exponential",
      },
      volume: -8,
    });

    this.reverb = new Tone.Reverb({
      decay: 2.5,
      preDelay: 0.01,
      wet: 0.15,
    });

    this.chorus = new Tone.Chorus({
      frequency: 2,
      delayTime: 3.5,
      depth: 0.3,
      wet: 0.1,
    });

    this.eq = new Tone.EQ3({
      low: -2,
      mid: 0,
      high: 2,
      lowFrequency: 200,
      highFrequency: 3000,
    });

    this.synth.chain(this.chorus, this.eq, this.reverb, Tone.Destination);

    await Tone.start();
    this.loaded = true;
  }

  playNote(pitch: Pitch, velocity: number): void {
    if (!this.synth || !this.loaded) return;

    const note = this.pitchToNote(pitch);
    const adjustedVelocity = this.getVelocityForPitch(pitch, velocity);
    this.synth.triggerAttackRelease(note, "4n", undefined, adjustedVelocity);
  }

  playNoteWithDuration(pitch: Pitch, velocity: number, duration: number, bpm: number): void {
    if (!this.synth || !this.loaded) return;

    const note = this.pitchToNote(pitch);
    const durationInSeconds = (60 / bpm) * duration;
    const adjustedVelocity = this.getVelocityForPitch(pitch, velocity);

    const envelope = this.getEnvelopeForPitch(pitch);
    this.synth.set({ envelope });

    this.synth.triggerAttackRelease(note, durationInSeconds, undefined, adjustedVelocity);
  }

  stopNote(pitch: Pitch): void {
    if (!this.synth || !this.loaded) return;

    const note = this.pitchToNote(pitch);
    this.synth.triggerRelease(note);
  }

  private getVelocityForPitch(pitch: Pitch, baseVelocity: number): number {
    const noteNumber = this.getNoteNumber(pitch);
    const adjustment = 1 - (noteNumber - 60) * 0.008;
    return baseVelocity * adjustment * 0.7;
  }

  private getEnvelopeForPitch(pitch: Pitch): Partial<Tone.EnvelopeOptions> {
    const noteNumber = this.getNoteNumber(pitch);
    const relativePosition = (noteNumber - 48) / 36;

    return {
      attack: 0.001 + relativePosition * 0.002,
      decay: 0.3 - relativePosition * 0.1,
      sustain: 0.1 - relativePosition * 0.05,
      release: 1.2 + relativePosition * 0.8,
    };
  }

  private getNoteNumber(pitch: Pitch): number {
    const noteNumbers: Record<Pitch, number> = {
      A3: 57,
      "A#3": 58,
      B3: 59,
      C4: 60,
      "C#4": 61,
      D4: 62,
      "D#4": 63,
      E4: 64,
      F4: 65,
      "F#4": 66,
      G4: 67,
      "G#4": 68,
      A4: 69,
      "A#4": 70,
      B4: 71,
      C5: 72,
      "C#5": 73,
      D5: 74,
      "D#5": 75,
      E5: 76,
      F5: 77,
      "F#5": 78,
      G5: 79,
    };
    return noteNumbers[pitch];
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
