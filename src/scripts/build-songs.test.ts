import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildSongs } from "./build-songs";

const jsonPath = join(process.cwd(), "src/songs/twinkle_twinkle.json");

describe("buildSongs", () => {
  it("validates song JSON", async () => {
    await buildSongs();
    const data = JSON.parse(await readFile(jsonPath, "utf8"));
    expect(data.meta.id).toBe("twinkle_twinkle");
    expect(data.notes.length).toBeGreaterThan(0);
  });
});
