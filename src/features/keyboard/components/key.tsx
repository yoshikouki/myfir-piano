import { cn } from "@/lib/utils";
import { type Pitch, pitchLabels } from "../pitches";

export type KeyProps = {
  pitch: Pitch;
  highlighted?: boolean;
  onPress?: (pitch: Pitch) => void;
};

export function Key({ pitch, highlighted, onPress }: KeyProps) {
  const isBlackKey = pitch.includes("#");

  return (
    <button
      type="button"
      data-pitch={pitch}
      className={cn(
        "touch-manipulation select-none transition-colors active:translate-y-0.5",
        isBlackKey && "h-20 w-full border-r-0 text-white md:h-24",
        isBlackKey && !highlighted && "bg-black",
        isBlackKey && highlighted && "bg-red-600",
        !isBlackKey && "h-32 flex-1 border-black border-r text-sm md:h-40 md:text-base",
        !isBlackKey && !highlighted && "bg-white",
        !isBlackKey && highlighted && "bg-red-200",
      )}
      onPointerDown={() => onPress?.(pitch)}
    >
      {!isBlackKey && pitchLabels[pitch]}
    </button>
  );
}
