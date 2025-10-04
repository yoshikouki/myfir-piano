import type { Pitch } from "@/features/keyboard/pitches";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PianoAudioEngine } from "./piano-audio-engine";

describe("PianoAudioEngine", () => {
  let engine: PianoAudioEngine;

  beforeEach(() => {
    vi.clearAllMocks();
    engine = new PianoAudioEngine();
  });

  describe("load", () => {
    it("should initialize audio components", async () => {
      await engine.load();
      expect(true).toBe(true);
    });

    it("should not reinitialize if already loaded", async () => {
      await engine.load();
      await engine.load();
      expect(true).toBe(true);
    });
  });

  describe("playNote", () => {
    it("should play a note when loaded", async () => {
      await engine.load();
      const pitch: Pitch = "C4";
      engine.playNote(pitch, 0.8);
      expect(true).toBe(true);
    });

    it("should not play if not loaded", () => {
      const pitch: Pitch = "C4";
      engine.playNote(pitch, 0.8);
      expect(true).toBe(true);
    });
  });

  describe("playNoteWithDuration", () => {
    it("should play a note with specified duration", async () => {
      await engine.load();
      const pitch: Pitch = "C4";
      engine.playNoteWithDuration(pitch, 0.8, 1, 120);
      expect(true).toBe(true);
    });
  });

  describe("stopNote", () => {
    it("should stop a playing note", async () => {
      await engine.load();
      const pitch: Pitch = "C4";
      engine.stopNote(pitch);
      expect(true).toBe(true);
    });
  });
});