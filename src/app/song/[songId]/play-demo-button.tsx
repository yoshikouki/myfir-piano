"use client";

import { PlayController } from "@/features/player/play-controller";
import { useAudioEngine } from "@/lib/audio/audio-engine-context";
import { createAudioEngine } from "@/lib/audio/audio-engine-factory";
import { cn } from "@/lib/utils";
import type { Song } from "@/songs/song.schema";
import { Play, Square } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type PlayDemoButtonProps = {
  song: Song;
  onIndexChange?: (index: number) => void;
};

export function PlayDemoButton({ song, onIndexChange }: PlayDemoButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playController, setPlayController] = useState<PlayController | null>(null);
  const [timeoutIds, setTimeoutIds] = useState<number[]>([]);
  const { engineType } = useAudioEngine();

  useEffect(() => {
    const engine = createAudioEngine(engineType);
    const controller = new PlayController(engine);
    controller.load(song);
    setPlayController(controller);
  }, [song, engineType]);

  useEffect(() => {
    return () => {
      for (const id of timeoutIds) {
        clearTimeout(id);
      }
    };
  }, [timeoutIds]);

  const stopPlayback = useCallback(() => {
    for (const id of timeoutIds) {
      clearTimeout(id);
    }
    setTimeoutIds([]);
    setIsPlaying(false);
    onIndexChange?.(-1);
  }, [timeoutIds, onIndexChange]);

  const handlePlay = useCallback(async () => {
    if (!playController) return;

    if (isPlaying) {
      stopPlayback();
      return;
    }

    await playController.ensureAudioEngineLoaded();
    setIsPlaying(true);

    const newTimeoutIds: number[] = [];
    let currentTime = 0;

    song.notes.forEach((note, index) => {
      const timeoutId = window.setTimeout(() => {
        onIndexChange?.(index);
        playController.audioEngine.playNoteWithDuration(
          note.pitch,
          1,
          note.duration,
          song.meta.bpm,
        );
      }, currentTime);

      newTimeoutIds.push(timeoutId);
      currentTime += (60 / song.meta.bpm) * note.duration * 1000;
    });

    const finalTimeoutId = window.setTimeout(() => {
      setIsPlaying(false);
      setTimeoutIds([]);
      onIndexChange?.(-1);
    }, currentTime);

    newTimeoutIds.push(finalTimeoutId);
    setTimeoutIds(newTimeoutIds);
  }, [playController, song, isPlaying, stopPlayback, onIndexChange]);

  return (
    <button
      type="button"
      onClick={handlePlay}
      className={cn(
        "flex items-center gap-2 rounded-full border border-primary bg-background px-4 py-2 font-medium text-primary transition-colors hover:bg-primary/10",
        isPlaying && "bg-primary/20 font-bold",
      )}
      aria-label={isPlaying ? "おてほんを停止" : "おてほんを再生"}
    >
      {isPlaying ? <Square className="h-4 w-4 stroke-3" /> : <Play className="h-4 w-4" />}
      <span>おてほん</span>
    </button>
  );
}
