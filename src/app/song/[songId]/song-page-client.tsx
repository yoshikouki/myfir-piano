"use client";

import { HeaderContainer } from "@/components/header-container";
import { Keyboard } from "@/features/keyboard/components/keyboard";
import type { Pitch } from "@/features/keyboard/pitches";
import { PlayController } from "@/features/player/play-controller";
import { ScrollScore } from "@/features/score/components/scroll-score";
import { type SongId, loadSong } from "@/features/songs/songs";
import { SampleAudioEngine } from "@/lib/audio/sample-audio-engine";
import type { Song } from "@/songs/song.schema";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SongPageClient() {
  const params = useParams();
  const songId = params.songId as SongId;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [playController, setPlayController] = useState<PlayController | null>(null);
  const [song, setSong] = useState<Song | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSongData = async () => {
      try {
        const songData = await loadSong(songId);
        setSong(songData);

        const engine = new SampleAudioEngine();
        const controller = new PlayController(engine);
        controller.load(songData);
        setPlayController(controller);
      } catch (err) {
        setError("きょくの よみこみに しっぱいしました");
        console.error("Failed to load song:", err);
      } finally {
        setLoading(false);
      }
    };

    if (songId) {
      loadSongData();
    }
  }, [songId]);

  const handleKeyPress = async (pitch: Pitch) => {
    if (!playController) return;
    await playController.ensureAudioEngineLoaded();
    const oldIndex = playController.index;
    playController.press(pitch);
    const newIndex = playController.index;
    if (newIndex !== oldIndex) {
      setCurrentIndex(newIndex);
      setIsCompleted(playController.isCompleted() || false);
    }
  };

  const handleKeyRelease = (pitch: Pitch) => {
    if (!playController) return;
    playController.audioEngine.stopNote(pitch);
  };

  const handleReset = () => {
    if (!playController) return;
    playController.reset();
    setCurrentIndex(0);
    setIsCompleted(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">きょくを よみこみちゅう...</div>
      </div>
    );
  }

  if (error || !song) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="mb-4 text-destructive">{error || "きょくが みつかりません"}</div>
        <Link
          href="/"
          className="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          きょくリストに もどる
        </Link>
      </div>
    );
  }

  return (
    <>
      <HeaderContainer>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
            aria-label="ホームに戻る"
          >
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <div className="flex items-center gap-2">
            {song.meta.emoji && <span className="text-2xl">{song.meta.emoji}</span>}
            <h1 className="font-bold text-xl md:text-2xl">{song.meta.titleJp}</h1>
          </div>
        </div>
      </HeaderContainer>
      <div className="flex min-h-screen flex-col pt-16">
        <div className="flex flex-1 flex-col p-4 pb-32">
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="w-full max-w-4xl">
              <div className="space-y-8 text-center">
                <div className="rounded-lg bg-muted p-2 md:p-4">
                  <ScrollScore song={song} currentIndex={currentIndex} />
                </div>
                <div>
                  {isCompleted ? (
                    <div className="space-y-4">
                      <div className="font-bold text-primary text-xl md:text-2xl">
                        🎉 かんせい！
                      </div>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="rounded-lg bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90"
                      >
                        もう一度
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed right-0 bottom-0 left-0 h-1/3 min-h-40 border-border border-t bg-background shadow-lg md:h-1/3">
          <div className="flex h-full justify-center overflow-x-auto">
            <Keyboard
              highlightedPitch={playController?.getCurrentNote()?.pitch}
              onPress={handleKeyPress}
              onRelease={handleKeyRelease}
            />
          </div>
        </div>
      </div>
    </>
  );
}
