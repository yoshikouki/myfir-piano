"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";

type SongHeaderProps = {
  emoji?: string;
  title: string;
};

export function SongHeader({ emoji, title }: SongHeaderProps) {
  const handleTitleClick = () => {
    window.dispatchEvent(new Event("song-title-click"));
  };

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/"
        className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
        aria-label="ホームに戻る"
      >
        <ChevronLeft className="h-6 w-6" />
      </Link>
      <button
        type="button"
        onClick={handleTitleClick}
        className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-gray-100"
        aria-label="曲をリセット"
      >
        {emoji && <span className="text-2xl">{emoji}</span>}
        <h1 className="font-bold text-xl md:text-2xl">{title}</h1>
      </button>
    </div>
  );
}
