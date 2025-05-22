import type { Song } from "@/lib/song.schema";
import rawSong from "@/songs/twinkle_twinkle.json";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScrollScore } from "./scroll-score";

const song = rawSong as Song;

describe("ScrollScore", () => {
  it("highlights current note", () => {
    render(<ScrollScore song={song} currentIndex={0} />);
    const highlight = screen.getByTestId("highlight");
    expect(highlight.className).toContain("bg-red-500");
    
    const first = screen.getAllByText("ド")[0];
    expect(first.className).toContain("text-white");
  });
});
