"use client";
import { Keyboard } from "@/features/keyboard/components/keyboard";
import type { Pitch } from "@/features/keyboard/pitches";
import { PlayController } from "@/features/player/play-controller";
import { CompletionOverlay } from "@/features/score/components/completion-overlay";
import { ScrollScore } from "@/features/score/components/scroll-score";
import { SampleAudioEngine } from "@/lib/audio/sample-audio-engine";
import type { Song } from "@/songs/song.schema";
import { useEffect, useState } from "react";

type Props = {
  song: Song;
};

export default function SongPageClient({ song }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playController, setPlayController] = useState<PlayController | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const engine = new SampleAudioEngine();
    const controller = new PlayController(engine);
    controller.load(song);
    setPlayController(controller);
  }, [song]);

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
    <div className="flex min-h-screen flex-col pt-16">
      <div className="flex flex-1 flex-col p-4 pb-32">
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="w-full max-w-4xl">
            <div className="space-y-8 text-center">
              <ScrollScore song={song} currentIndex={currentIndex} />
            </div>
          </div>
        </div>
      </div>

      <Keyboard
        highlightedPitch={playController?.getCurrentNote()?.pitch}
        onPress={handleKeyPress}
        onRelease={handleKeyRelease}
      />

      <CompletionOverlay isVisible={isCompleted} />
    </div>
  );
}
