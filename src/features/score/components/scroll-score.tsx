import type { Pitch } from "@/features/keyboard/pitches";
import { pitchLabels } from "@/features/keyboard/pitches";
import type { Song } from "@/songs/song.schema";
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

  const initialX = centerPosition * (60 + 8);

  return (
    <div className="relative overflow-hidden">
      {currentNoteIndex >= 0 && (
        <motion.div
          layoutId="highlight"
          data-testid="highlight"
          className="absolute top-0 left-0 h-full w-[60px] rounded bg-red-500"
          style={{
            left: `${centerPosition * (60 + 8)}px`,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        />
      )}
      <motion.div
        className="flex justify-start gap-2 whitespace-nowrap text-2xl"
        initial={{
          x: initialX,
        }}
        animate={{
          x: -(currentNoteIndex * (60 + 8)) + initialX,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          delay: 0.2,
        }}
      >
        {song.notes.map((n, i) => (
          <div
            key={`${i}-${n.pitch}`}
            className="relative inline-block min-w-[60px] text-center"
          >
            <motion.span
              className="relative inline-block px-2"
              animate={{
                scale: i === currentNoteIndex ? 1.2 : 1,
                color: i === currentNoteIndex ? "#fde047" : "#000000",
              }}
              transition={{
                duration: 0.2,
                delay: 0.2,
              }}
            >
              {pitchToKatakana(n.pitch as Pitch)}
            </motion.span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
