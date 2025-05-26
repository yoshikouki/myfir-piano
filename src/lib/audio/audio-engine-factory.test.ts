import { describe, expect, it } from "vitest";
import { createAudioEngine } from "./audio-engine-factory";
import { PianoAudioEngine } from "./piano-audio-engine";
import { SampleAudioEngine } from "./sample-audio-engine";

describe("createAudioEngine", () => {
  it("should create SampleAudioEngine when type is 'sample'", () => {
    const engine = createAudioEngine("sample");
    expect(engine).toBeInstanceOf(SampleAudioEngine);
  });

  it("should create PianoAudioEngine when type is 'piano'", () => {
    const engine = createAudioEngine("piano");
    expect(engine).toBeInstanceOf(PianoAudioEngine);
  });

  it("should create SampleAudioEngine by default for unknown type", () => {
    const engine = createAudioEngine("unknown" as "sample");
    expect(engine).toBeInstanceOf(SampleAudioEngine);
  });
});
