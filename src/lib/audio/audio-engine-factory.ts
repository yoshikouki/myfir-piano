import type { AudioEngine } from "./audio-engine";
import { PianoAudioEngine } from "./piano-audio-engine";
import { SampleAudioEngine } from "./sample-audio-engine";

export type AudioEngineType = "sample" | "piano";

export function createAudioEngine(type: AudioEngineType): AudioEngine {
  switch (type) {
    case "piano":
      return new PianoAudioEngine();
    case "sample":
      return new SampleAudioEngine();
    default:
      return new SampleAudioEngine();
  }
}
