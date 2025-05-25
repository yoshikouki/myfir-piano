import type { Song } from "@/songs/song.schema";
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
      song.notes.filter((note) => note.pitch === "C4").length,
    );
  });

  it("adjusts note width based on duration", () => {
    const testSong: Song = {
      meta: song.meta,
      notes: [
        { pitch: "C4", duration: 1 },
        { pitch: "D4", duration: 2 },
        { pitch: "E4", duration: 0.5 },
      ],
    };
    const { container } = render(<ScrollScore song={testSong} />);
    const noteContainers = container.querySelectorAll(
      "div.relative.inline-block[style*='width']",
    );
    expect(noteContainers[0]).toHaveStyle({ width: "60px" });
    expect(noteContainers[1]).toHaveStyle({ width: "120px" });
    expect(noteContainers[2]).toHaveStyle({ width: "60px" });
  });

  it("applies left alignment for notes with duration >= 2", () => {
    const testSong: Song = {
      meta: song.meta,
      notes: [
        { pitch: "C4", duration: 1 },
        { pitch: "D4", duration: 2 },
        { pitch: "E4", duration: 3 },
      ],
    };
    const { container } = render(<ScrollScore song={testSong} />);
    const noteContainers = container.querySelectorAll(
      "div.relative.inline-block[style*='width']",
    );
    expect(noteContainers[0]).toHaveClass("text-center");
    expect(noteContainers[0]).not.toHaveClass("text-left");
    expect(noteContainers[1]).toHaveClass("text-left");
    expect(noteContainers[1]).not.toHaveClass("text-center");
    expect(noteContainers[2]).toHaveClass("text-left");
    expect(noteContainers[2]).not.toHaveClass("text-center");
  });

  it("adjusts highlight width to match current note duration", () => {
    const testSong: Song = {
      meta: song.meta,
      notes: [
        { pitch: "C4", duration: 1 },
        { pitch: "D4", duration: 2 },
      ],
    };
    const { rerender } = render(<ScrollScore song={testSong} currentIndex={0} />);
    expect(screen.getByTestId("highlight")).toHaveStyle({ width: "60px" });

    rerender(<ScrollScore song={testSong} currentIndex={1} />);
    expect(screen.getByTestId("highlight")).toHaveStyle({ width: "120px" });
  });
});
