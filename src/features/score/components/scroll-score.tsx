import type { Pitch } from "@/features/keyboard/pitches";
import { pitchLabels } from "@/features/keyboard/pitches";
import { cn } from "@/lib/utils";
import type { Song } from "@/songs/song.schema";

export type ScrollScoreProps = {
  song: Song;
  currentIndex?: number;
};

const BASE_NOTE_WIDTH = 60;
const NOTE_GAP = 8;

export function ScrollScore({ song, currentIndex = -1 }: ScrollScoreProps) {
  let currentOffset = 0;
  const noteOffsets = song.notes.map((note) => {
    const offset = currentOffset;
    currentOffset += BASE_NOTE_WIDTH * Math.max(1, note.duration) + NOTE_GAP;
    return offset;
  });

  const translateX =
    currentIndex >= 0
      ? `calc(20% - ${noteOffsets[currentIndex]}px - ${BASE_NOTE_WIDTH / 2}px)`
      : "0";

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex gap-2 whitespace-nowrap text-2xl transition-transform duration-500 ease-out"
        style={{
          transform: `translateX(${translateX})`,
          paddingLeft: "20%",
          paddingRight: "80%",
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
                "relative inline-block h-full rounded transition-colors duration-200",
                isLongNote ? "text-left" : "text-center",
                isHighlighted ? "bg-primary" : "bg-muted",
              )}
              style={{
                width: `${noteWidth}px`,
                minWidth: `${noteWidth}px`,
              }}
              role="note"
              data-highlighted={isHighlighted}
            >
              <span
                className={cn(
                  "relative inline-block py-1 pr-2 transition-transform duration-200",
                  isLongNote ? "pl-4" : "pl-2",
                  isHighlighted ? "scale-125 text-primary-foreground" : "text-foreground",
                )}
                style={{
                  transformOrigin: "center",
                }}
              >
                {pitchLabels[note.pitch as Pitch]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
