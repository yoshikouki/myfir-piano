import type { Song } from "@/songs/song.schema";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PlayDemoButton } from "./play-demo-button";

vi.mock("@/lib/audio/sample-audio-engine", () => ({
  SampleAudioEngine: vi.fn().mockImplementation(() => ({
    load: vi.fn().mockResolvedValue(undefined),
    playNote: vi.fn(),
    playNoteWithDuration: vi.fn(),
    stopNote: vi.fn(),
  })),
}));

const mockSong: Song = {
  meta: {
    title: "Test Song",
    titleJp: "テストソング",
    bpm: 120,
    emoji: "🎵",
  },
  notes: [
    { pitch: "C4", duration: 1 },
    { pitch: "D4", duration: 1 },
    { pitch: "E4", duration: 1 },
  ],
};

describe("PlayDemoButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
  });

  it("should render with initial state", () => {
    render(<PlayDemoButton song={mockSong} />);

    const button = screen.getByRole("button", { name: "おてほんを再生" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("おてほん");
  });

  it("should display play button initially", () => {
    render(<PlayDemoButton song={mockSong} />);

    const playIcon = screen.getByRole("button").querySelector("svg");
    expect(playIcon).toHaveClass("lucide-play");
  });

  it("should accept onIndexChange prop", () => {
    const onIndexChange = vi.fn();
    render(<PlayDemoButton song={mockSong} onIndexChange={onIndexChange} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });
});
