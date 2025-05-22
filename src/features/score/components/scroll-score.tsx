import type { Pitch } from "@/features/keyboard/pitches";
import { pitchLabels } from "@/features/keyboard/pitches";
import type { Song } from "@/lib/song.schema";
import { motion } from "motion/react";

export type ScrollScoreProps = {
  song: Song;
  currentIndex?: number;
};

function pitchToKatakana(pitch: Pitch): string {
  return pitchLabels[pitch];
}

export function ScrollScore({ song, currentIndex }: ScrollScoreProps) {
  const currentNoteIndex = currentIndex ?? -1;
  const visibleRange = 7;
  const centerPosition = 1;

  const startIndex = Math.max(0, currentNoteIndex - centerPosition);
  const endIndex = Math.min(song.notes.length, startIndex + visibleRange);
  const _visibleNotes = song.notes.slice(startIndex, endIndex);

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex justify-start gap-2 whitespace-nowrap text-2xl"
        animate={{
          x:
            currentNoteIndex >= centerPosition
              ? -(currentNoteIndex - centerPosition) * (60 + 8)
              : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        {song.notes.map((n, i) => (
          <motion.span
            key={`${i}-${n.pitch}`}
            className={`inline-block min-w-[60px] text-center ${
              i === currentNoteIndex ? "rounded bg-red-500 px-2 text-white" : ""
            }`}
            animate={{
              scale: i === currentNoteIndex ? 1.2 : 1,
            }}
            transition={{
              duration: 0.2,
            }}
          >
            {pitchToKatakana(n.pitch as Pitch)}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
