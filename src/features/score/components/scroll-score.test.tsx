import type { Song } from "@/lib/song.schema";
import rawSong from "@/songs/twinkle_twinkle.json";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScrollScore } from "./scroll-score";

const song = rawSong as Song;

describe("ScrollScore", () => {
  it("highlights current note", () => {
    render(<ScrollScore song={song} currentIndex={0} />);
    const first = screen.getAllByText("き")[0];
    expect(first.className).toContain("bg-red-500");
  });
});
