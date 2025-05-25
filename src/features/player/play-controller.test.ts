import type { Song } from "@/songs/song.schema";
import rawSong from "@/songs/twinkle_twinkle.json";
import { describe, expect, it, vi } from "vitest";
import { PlayController } from "./play-controller";

const song = rawSong as Song;

const engine = {
  load: vi.fn().mockResolvedValue(undefined),
  playNote: vi.fn(),
  playNoteWithDuration: vi.fn(),
  stopNote: vi.fn(),
};

describe("PlayController", () => {
  it("plays note with duration when correct key pressed", async () => {
    const controller = new PlayController(engine);
    await controller.load(song);
    controller.press("C4");
    expect(engine.playNoteWithDuration).toHaveBeenCalledWith("C4", 1, 1, 100);
    expect(controller.index).toBe(1);
  });

  it("plays note with lower velocity when incorrect key pressed", async () => {
    const controller = new PlayController(engine);
    await controller.load(song);
    controller.press("D4");
    expect(engine.playNote).toHaveBeenCalledWith("D4", 0.5);
    expect(controller.index).toBe(0);
  });

  it("progresses through the song correctly", async () => {
    const controller = new PlayController(engine);
    await controller.load(song);

    controller.press("C4");
    expect(engine.playNoteWithDuration).toHaveBeenCalledWith("C4", 1, 1, 100);

    controller.press("C4");
    expect(engine.playNoteWithDuration).toHaveBeenCalledWith("C4", 1, 1, 100);

    controller.press("G4");
    expect(engine.playNoteWithDuration).toHaveBeenCalledWith("G4", 1, 1, 100);

    expect(controller.index).toBe(3);
  });
});
