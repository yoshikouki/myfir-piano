import type { Pitch } from "@/features/keyboard/pitches";
import { pitchLabels } from "@/features/keyboard/pitches";
import { cn } from "@/lib/utils";
import type { Song } from "@/songs/song.schema";
import { motion } from "motion/react";
import { useMemo } from "react";

export type ScrollScoreProps = {
  song: Song;
  currentIndex?: number;
};

const BASE_NOTE_WIDTH = 60;
const NOTE_GAP = 8;
const CENTER_POSITION = 1;

export function ScrollScore({ song, currentIndex = -1 }: ScrollScoreProps) {
  const notePositions = useMemo(() => {
    const positions: number[] = [];
    let currentPosition = 0;
    
    song.notes.forEach((note, index) => {
      positions[index] = currentPosition;
      currentPosition += BASE_NOTE_WIDTH * Math.max(1, note.duration) + NOTE_GAP;
    });
    
    return positions;
  }, [song.notes]);

  const scrollOffset = useMemo(() => {
    const centerOffset = notePositions[CENTER_POSITION] || 0;
    const currentOffset = notePositions[currentIndex] || 0;
    return centerOffset - currentOffset;
  }, [notePositions, currentIndex]);

  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="flex justify-start gap-2 whitespace-nowrap text-2xl"
        animate={{ x: scrollOffset }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          delay: 0.2,
        }}
      >
        {song.notes.map((note, index) => {
          const noteWidth = BASE_NOTE_WIDTH * Math.max(1, note.duration);
          const isLongNote = note.duration >= 2;
          const isHighlighted = index === currentIndex;

          return (
            <div
              key={`${index}-${note.pitch}`}
              className={cn(
                "relative inline-block h-full rounded",
                isLongNote ? "text-left" : "text-center",
                isHighlighted ? "bg-primary" : "bg-muted"
              )}
              style={{ width: `${noteWidth}px` }}
              role="note"
              data-highlighted={isHighlighted}
            >
              <motion.span
                className={cn(
                  "relative inline-block pr-2",
                  isLongNote ? "pl-4" : "pl-2",
                  isHighlighted ? "text-primary-foreground" : "text-foreground"
                )}
                animate={{ scale: isHighlighted ? 1.2 : 1 }}
                transition={{ duration: 0.2, delay: 0.2 }}
              >
                {pitchLabels[note.pitch as Pitch]}
              </motion.span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
