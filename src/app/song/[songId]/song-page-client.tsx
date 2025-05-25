"use client";
import { Keyboard } from "@/features/keyboard/components/keyboard";
import type { Pitch } from "@/features/keyboard/pitches";
import { PlayController } from "@/features/player/play-controller";
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

  const handleReset = () => {
    if (!playController) return;
    playController.reset();
    setCurrentIndex(0);
    setIsCompleted(false);
  };

  return (
    <div className="flex min-h-screen flex-col pt-16">
      <div className="flex flex-1 flex-col p-4 pb-32">
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="w-full max-w-4xl">
            <div className="space-y-8 text-center">
              <ScrollScore song={song} currentIndex={currentIndex} />
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

      <Keyboard
        highlightedPitch={playController?.getCurrentNote()?.pitch}
        onPress={handleKeyPress}
        onRelease={handleKeyRelease}
      />
    </div>
  );
}
