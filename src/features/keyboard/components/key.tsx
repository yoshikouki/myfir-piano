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
        "h-24 w-8 border border-black transition-colors active:translate-y-0.5",
        pitch.includes("#") && "-mx-2 z-10 h-16 w-6 bg-black text-white",
        highlighted && (pitch.includes("#") ? "bg-red-600" : "bg-red-200"),
      )}
      onPointerDown={() => onPress?.(pitch)}
    >
      {pitchLabels[pitch]}
    </button>
  );
}
