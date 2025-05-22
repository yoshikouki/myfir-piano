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
  const [currentIndex, setCurrentIndex] = useState(0);
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
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 font-bold text-3xl">{song.meta.titleJp}</h1>
          <div className="rounded-lg bg-gray-100 p-4">
            <ScrollScore song={song} />
          </div>
        </div>
        <div className="flex justify-center">
          <Keyboard
            highlightedPitch={playController?.getCurrentNote()?.pitch}
            onPress={handleKeyPress}
          />
        </div>
        <div className="mt-4 text-center">
          {isCompleted ? (
            <div className="space-y-4">
              <div className="font-bold text-2xl text-green-600">🎉 完成！</div>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
              >
                もう一度
              </button>
            </div>
          ) : (
            <div className="text-gray-600 text-sm">
              進行: {currentIndex + 1} / {song.notes.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
