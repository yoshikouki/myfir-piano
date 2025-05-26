"use client";
import { Keyboard } from "@/features/keyboard/components/keyboard";
import type { Pitch } from "@/features/keyboard/pitches";
import { PlayController } from "@/features/player/play-controller";
import { CompletionOverlay } from "@/features/score/components/completion-overlay";
import { ScrollScore } from "@/features/score/components/scroll-score";
import { useAudioEngine } from "@/lib/audio/audio-engine-context";
import { createAudioEngine } from "@/lib/audio/audio-engine-factory";
import type { Song } from "@/songs/song.schema";
import { useEffect, useState } from "react";

type Props = {
  song: Song;
  demoPlayingIndex?: number;
};

export default function SongPageClient({ song, demoPlayingIndex = -1 }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playController, setPlayController] = useState<PlayController | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const { engineType } = useAudioEngine();

  useEffect(() => {
    const engine = createAudioEngine(engineType);
    const controller = new PlayController(engine);
    controller.load(song);
    setPlayController(controller);
  }, [song, engineType]);

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

  return (
    <>
      <div className="flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 py-10">
        <ScrollScore
          song={song}
          currentIndex={demoPlayingIndex >= 0 ? demoPlayingIndex : currentIndex}
        />
      </div>

      <Keyboard
        highlightedPitch={playController?.getCurrentNote()?.pitch}
        onPress={handleKeyPress}
        onRelease={handleKeyRelease}
      />

      <CompletionOverlay isVisible={isCompleted} />
    </>
  );
}
