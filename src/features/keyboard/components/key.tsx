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
        "h-20 w-10 touch-manipulation select-none border-black border-r transition-colors active:translate-y-0.5 md:h-24 md:w-12",
        pitch.includes("#") &&
          "-mx-3 md:-mx-4 z-10 h-14 w-7 border-r-0 bg-black text-white text-xs md:h-16 md:w-8",
        highlighted && (pitch.includes("#") ? "bg-red-600" : "bg-red-200"),
        !pitch.includes("#") && "bg-white text-xs md:text-sm",
      )}
      onPointerDown={() => onPress?.(pitch)}
    >
      {pitchLabels[pitch]}
    </button>
  );
}
