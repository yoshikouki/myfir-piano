import type { Pitch } from "@/features/keyboard/pitches";
import { pitchLabels } from "@/features/keyboard/pitches";
import { cn } from "@/lib/utils";
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
  const baseNoteWidth = 60;
  const noteGap = 8;

  const startIndex = Math.max(0, currentNoteIndex - centerPosition);
  const endIndex = Math.min(song.notes.length, startIndex + visibleRange);
  const _visibleNotes = song.notes.slice(startIndex, endIndex);

  const calculateNoteWidth = (duration: number) => {
    return baseNoteWidth * Math.max(1, duration);
  };

  const calculateNotePosition = (index: number) => {
    let position = 0;
    for (let i = 0; i < index; i++) {
      position += calculateNoteWidth(song.notes[i].duration) + noteGap;
    }
    return position;
  };

  const isLongNote = ({ duration }: { duration: number }) => duration >= 2;

  const highlightPosition = calculateNotePosition(centerPosition);
  const currentNotePosition = calculateNotePosition(currentNoteIndex);
  const initialX = highlightPosition;

  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="flex justify-start gap-2 whitespace-nowrap text-2xl"
        initial={{
          x: initialX,
        }}
        animate={{
          x: -currentNotePosition + initialX,
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
            className={cn("relative inline-block", isLongNote(n) ? "text-left" : "text-center")}
            style={{
              minWidth: `${calculateNoteWidth(n.duration)}px`,
              width: `${calculateNoteWidth(n.duration)}px`,
            }}
          >
            <motion.div
              className={cn(
                "relative inline-block h-full rounded",
                i === currentNoteIndex ? "bg-primary" : "",
              )}
              animate={{
                scale: i === currentNoteIndex ? 1 : 1,
              }}
              transition={{
                duration: 0.2,
                delay: 0.2,
              }}
            >
              <motion.span
                className={cn(
                  "relative inline-block pr-2",
                  isLongNote(n) ? "pl-4" : "pl-2",
                  i === currentNoteIndex ? "text-primary-foreground" : "text-foreground",
                )}
                animate={{
                  scale: i === currentNoteIndex ? 1.2 : 1,
                }}
                transition={{
                  duration: 0.2,
                  delay: 0.2,
                }}
              >
                {pitchToKatakana(n.pitch as Pitch)}
              </motion.span>
            </motion.div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
