"use client";

import { RotateCcw } from "lucide-react";

type Props = {
  onReset: () => void;
};

export function ResetButton({ onReset }: Props) {
  return (
    <button
      type="button"
      onClick={onReset}
      className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
      aria-label="最初からやり直す"
    >
      <RotateCcw className="h-5 w-5" />
    </button>
  );
}
