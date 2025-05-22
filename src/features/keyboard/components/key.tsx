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
        "h-32 w-16 touch-manipulation select-none border-black border-r transition-colors active:translate-y-0.5 md:h-40 md:w-20",
        isBlackKey && "-mx-4 md:-mx-5 z-10 h-20 w-10 border-r-0 text-white md:h-24 md:w-12",
        isBlackKey && !highlighted && "bg-black",
        isBlackKey && highlighted && "bg-red-600",
        !isBlackKey && !highlighted && "bg-white text-sm md:text-base",
        !isBlackKey && highlighted && "bg-red-200 text-sm md:text-base",
      )}
      onPointerDown={() => onPress?.(pitch)}
    >
      {!isBlackKey && pitchLabels[pitch]}
    </button>
  );
}
