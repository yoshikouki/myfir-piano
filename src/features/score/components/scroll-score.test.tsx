import type { Song } from "@/lib/song.schema";
import rawSong from "@/songs/twinkle_twinkle.json";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScrollScore } from "./scroll-score";

const song = rawSong as Song;

describe("ScrollScore", () => {
  it("shows highlight when current note is selected", () => {
    render(<ScrollScore song={song} currentIndex={0} />);
    expect(screen.getByTestId("highlight")).toBeInTheDocument();
  });

  it("hides highlight when no current note", () => {
    render(<ScrollScore song={song} />);
    expect(screen.queryByTestId("highlight")).not.toBeInTheDocument();
  });

  it("renders all notes from song", () => {
    render(<ScrollScore song={song} />);
    expect(screen.getAllByText("ド")).toHaveLength(
      song.notes.filter(note => note.pitch === "C4").length
    );
  });
});
