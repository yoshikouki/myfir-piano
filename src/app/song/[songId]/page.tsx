"use client";

import { Keyboard } from "@/features/keyboard/components/keyboard";
import type { Pitch } from "@/features/keyboard/pitches";
import { PlayController } from "@/features/player/play-controller";
import { ScrollScore } from "@/features/score/components/scroll-score";
import { type SongId, loadSong } from "@/features/songs/songs";
import { SampleAudioEngine } from "@/lib/audio/sample-audio-engine";
import type { Song } from "@/songs/song.schema";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SongPage() {
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
        setError("楽曲の読み込みに失敗しました");
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

  const handleReset = () => {
    if (!playController) return;
    playController.reset();
    setCurrentIndex(0);
    setIsCompleted(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500">楽曲を読み込み中...</div>
      </div>
    );
  }

  if (error || !song) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="mb-4 text-red-500">{error || "楽曲が見つかりません"}</div>
        <Link
          href="/"
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          楽曲リストに戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-gray-200 border-b bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-blue-500 hover:text-blue-600">
            ← 楽曲リスト
          </Link>
          <h1 className="font-bold text-xl md:text-2xl">{song.meta.titleJp}</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="flex flex-1 flex-col p-4 pb-32">
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="w-full max-w-4xl">
            <div className="space-y-8 text-center">
              <div className="rounded-lg bg-gray-100 p-2 md:p-4">
                <ScrollScore song={song} currentIndex={currentIndex} />
              </div>
              <div>
                {isCompleted ? (
                  <div className="space-y-4">
                    <div className="font-bold text-green-600 text-xl md:text-2xl">
                      🎉 完成！
                    </div>
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
