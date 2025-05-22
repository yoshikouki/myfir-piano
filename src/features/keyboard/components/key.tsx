import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import { type Pitch, isBlackKey, pitchLabels } from "../pitches";

const keyVariants = cva(
  "touch-manipulation select-none transition-colors active:translate-y-0.5 pointer-events-auto flex items-end justify-center pb-4",
  {
    variants: {
      keyType: {
        white: "h-full flex-1 border-black border-r text-sm md:text-base relative",
        black: "h-2/5 w-full border-r-0 text-white",
      },
      highlighted: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        keyType: "white",
        highlighted: false,
        className: "bg-white",
      },
      {
        keyType: "white",
        highlighted: true,
        className: "bg-red-200",
      },
      {
        keyType: "black",
        highlighted: false,
        className: "bg-black",
      },
      {
        keyType: "black",
        highlighted: true,
        className: "bg-red-600",
      },
    ],
    defaultVariants: {
      keyType: "white",
      highlighted: false,
    },
  },
);

export type KeyProps = {
  pitch: Pitch;
  highlighted?: boolean;
  onPress?: (pitch: Pitch) => void;
} & VariantProps<typeof keyVariants>;

export function Key({ pitch, highlighted = false, onPress }: KeyProps) {
  const keyType = isBlackKey(pitch) ? "black" : "white";

  return (
    <button
      type="button"
      data-pitch={pitch}
      className={cn(keyVariants({ keyType, highlighted }))}
      onPointerDown={() => onPress?.(pitch)}
    >
      {keyType === "white" && pitchLabels[pitch]}
    </button>
  );
}
