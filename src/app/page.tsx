"use client";

import { Keyboard } from "@/features/keyboard/components/keyboard";
import type { Pitch } from "@/features/keyboard/pitches";
import { PlayController } from "@/features/player/play-controller";
import { ScrollScore } from "@/features/score/components/scroll-score";
import { SampleAudioEngine } from "@/lib/audio/sample-audio-engine";
import type { Song } from "@/lib/song.schema";
import twinkleTwinkleSong from "@/songs/twinkle_twinkle.json";
import { useEffect, useState } from "react";

export default function Home() {
  const [_currentIndex, setCurrentIndex] = useState(0);
  const [playController, setPlayController] = useState<PlayController | null>(null);
  const [song] = useState<Song>(twinkleTwinkleSong as Song);
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

  const handleReset = () => {
    if (!playController) return;
    playController.reset();
    setCurrentIndex(0);
    setIsCompleted(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-gray-200 border-b bg-white px-4 py-3 shadow-sm">
        <h1 className="text-center font-bold text-xl md:text-2xl">{song.meta.titleJp}</h1>
      </header>

      <div className="flex flex-1 flex-col p-4 pb-32">
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="w-full max-w-4xl">
            <div className="mb-8 text-center">
              <div className="rounded-lg bg-gray-100 p-2 md:p-4">
                <ScrollScore song={song} />
              </div>
            </div>
            <div className="text-center">
              {isCompleted ? (
                <div className="space-y-4">
                  <div className="font-bold text-green-600 text-xl md:text-2xl">🎉 完成！</div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
                  >
                    もう一度
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed right-0 bottom-0 left-0 border-gray-200 border-t bg-white shadow-lg">
        <div className="flex justify-center overflow-x-auto p-2">
          <Keyboard
            highlightedPitch={playController?.getCurrentNote()?.pitch}
            onPress={handleKeyPress}
          />
        </div>
      </div>
    </div>
  );
}
