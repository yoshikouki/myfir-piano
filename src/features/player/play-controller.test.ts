import type { Song } from "@/lib/song.schema";
import rawSong from "@/songs/twinkle_twinkle.json";
import { describe, expect, it, vi } from "vitest";
import { PlayController } from "./play-controller";

const song = rawSong as Song;

const engine = {
  load: vi.fn().mockResolvedValue(undefined),
  playNote: vi.fn(),
};

describe("PlayController", () => {
  it("plays note when correct key pressed", async () => {
    const controller = new PlayController(engine);
    await controller.load(song);
    controller.press("C4");
    expect(engine.playNote).toHaveBeenCalled();
  });
});
