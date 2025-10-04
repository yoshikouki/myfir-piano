import { describe, expect, it, vi } from "vitest";
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
    expect(vi.mocked(PianoAudioEngine)).toHaveBeenCalled();
    expect(engine).toMatchObject({
      load: expect.any(Function),
      playNote: expect.any(Function),
      playNoteWithDuration: expect.any(Function),
      stopNote: expect.any(Function),
    });
  });

  it("should create SampleAudioEngine by default for unknown type", () => {
    const engine = createAudioEngine("unknown" as "sample");
    expect(engine).toBeInstanceOf(SampleAudioEngine);
  });
});
