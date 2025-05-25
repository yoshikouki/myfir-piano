import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import { motion } from "motion/react";
import { type Pitch, isBlackKey, pitchLabels } from "../pitches";

const keyVariants = cva(
  "touch-manipulation select-none active:translate-y-0.5 pointer-events-auto flex items-end justify-center pb-4",
  {
    variants: {
      keyType: {
        white: "h-full flex-1 border-l text-sm md:text-base relative",
        black: "h-1/2 w-full text-white rounded-b-md",
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
  onRelease?: (pitch: Pitch) => void;
} & VariantProps<typeof keyVariants>;

export function Key({ pitch, highlighted = false, onPress, onRelease }: KeyProps) {
  const keyType = isBlackKey(pitch) ? "black" : "white";

  const getBackgroundColor = () => {
    if (keyType === "white") {
      return highlighted ? "#fecaca" : "#ffffff";
    }
    return highlighted ? "#dc2626" : "#000000";
  };

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
      className={cn(keyVariants({ keyType, highlighted: false }))}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerUp}
      animate={{
        backgroundColor: getBackgroundColor(),
      }}
      transition={{
        duration: 0.2,
        delay: 0.2,
      }}
    >
      {keyType === "white" && pitchLabels[pitch]}
    </motion.button>
  );
}
