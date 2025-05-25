import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import { motion } from "motion/react";
import { type Pitch, isBlackKey, pitchLabels } from "../pitches";

const keyVariants = cva(
  "touch-manipulation select-none active:translate-y-0.5 pointer-events-auto flex items-end justify-center pb-4 rounded-b-md shadow-sm",
  {
    variants: {
      keyType: {
        white: "h-full flex-1 text-sm md:text-base relative",
        black: "h-1/2 w-full text-white rounded-t-sm rounded-b-lg",
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
        className: "bg-primary text-white font-bold shadow-lg border-0",
      },
      {
        keyType: "black",
        highlighted: false,
        className: "bg-black",
      },
      {
        keyType: "black",
        highlighted: true,
        className: "bg-primary shadow-lg",
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
  onRelease?: (pitch: Pitch) => void;
} & VariantProps<typeof keyVariants>;

export function Key({ pitch, highlighted = false, onPress, onRelease }: KeyProps) {
  const keyType = isBlackKey(pitch) ? "black" : "white";

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    onPress?.(pitch);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    onRelease?.(pitch);
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    e.preventDefault();
    onRelease?.(pitch);
  };

  return (
    <motion.button
      type="button"
      data-pitch={pitch}
      aria-pressed={highlighted}
      aria-label={`${pitchLabels[pitch]} ${pitch}`}
      className={cn(keyVariants({ keyType, highlighted }))}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerUp}
      transition={{
        duration: 0.2,
        delay: 0.2,
      }}
    >
      {keyType === "white" && pitchLabels[pitch]}
    </motion.button>
  );
}
