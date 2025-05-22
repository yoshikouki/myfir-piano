import { cn } from "@/lib/utils";
import { type Pitch, pitchLabels } from "../pitches";

export type KeyProps = {
  pitch: Pitch;
  highlighted?: boolean;
  onPress?: (pitch: Pitch) => void;
};

export function Key({ pitch, highlighted, onPress }: KeyProps) {
  return (
    <button
      type="button"
      data-pitch={pitch}
      className={cn(
        "h-32 w-16 touch-manipulation select-none border-black border-r transition-colors active:translate-y-0.5 md:h-40 md:w-20",
        pitch.includes("#") &&
          "-mx-4 md:-mx-5 z-10 h-20 w-10 border-r-0 bg-black text-white md:h-24 md:w-12",
        highlighted && (pitch.includes("#") ? "bg-red-600" : "bg-red-200"),
        !pitch.includes("#") && "bg-white text-sm md:text-base",
      )}
      onPointerDown={() => onPress?.(pitch)}
    >
      {!pitch.includes("#") && pitchLabels[pitch]}
    </button>
  );
}
