import type { Pitch } from "@/features/keyboard/pitches";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PianoAudioEngine } from "./piano-audio-engine";

vi.mock("tone", () => ({
  default: {
    start: vi.fn().mockResolvedValue(undefined),
    Destination: {},
  },
  PolySynth: vi.fn(() => ({
    chain: vi.fn().mockReturnThis(),
    triggerAttackRelease: vi.fn(),
    triggerRelease: vi.fn(),
    set: vi.fn(),
  })),
  Synth: vi.fn(),
  Reverb: vi.fn(() => ({})),
  Chorus: vi.fn(() => ({})),
  EQ3: vi.fn(() => ({})),
  start: vi.fn().mockResolvedValue(undefined),
  Destination: {},
}));

describe("PianoAudioEngine", () => {
  let engine: PianoAudioEngine;

  beforeEach(() => {
    vi.clearAllMocks();
    engine = new PianoAudioEngine();
  });

  describe("load", () => {
    it("should initialize audio components", async () => {
      await engine.load();
      expect(vi.mocked(await import("tone")).PolySynth).toHaveBeenCalled();
    });

    it("should not reinitialize if already loaded", async () => {
      await engine.load();
      const polySynthMock = vi.mocked(await import("tone")).PolySynth;
      const callCount = polySynthMock.mock.calls.length;

      await engine.load();
      expect(polySynthMock).toHaveBeenCalledTimes(callCount);
    });
  });

  describe("playNote", () => {
    it("should play a note when loaded", async () => {
      await engine.load();
      const pitch: Pitch = "C4";
      engine.playNote(pitch, 0.8);

      const mockSynth = vi.mocked(await import("tone")).PolySynth.mock.results[0].value;
      expect(mockSynth.triggerAttackRelease).toHaveBeenCalled();
    });

    it("should not play if not loaded", () => {
      const pitch: Pitch = "C4";
      engine.playNote(pitch, 0.8);
    });
  });

  describe("playNoteWithDuration", () => {
    it("should play a note with specified duration", async () => {
      await engine.load();
      const pitch: Pitch = "C4";
      engine.playNoteWithDuration(pitch, 0.8, 1, 120);

      const mockSynth = vi.mocked(await import("tone")).PolySynth.mock.results[0].value;
      expect(mockSynth.set).toHaveBeenCalled();
      expect(mockSynth.triggerAttackRelease).toHaveBeenCalledWith(
        "C4",
        0.5,
        undefined,
        expect.any(Number),
      );
    });
  });

  describe("stopNote", () => {
    it("should stop a playing note", async () => {
      await engine.load();
      const pitch: Pitch = "C4";
      engine.stopNote(pitch);

      const mockSynth = vi.mocked(await import("tone")).PolySynth.mock.results[0].value;
      expect(mockSynth.triggerRelease).toHaveBeenCalledWith("C4");
    });
  });
});
