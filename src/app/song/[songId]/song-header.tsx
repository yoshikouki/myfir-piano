import { ChevronLeft } from "lucide-react";
import Link from "next/link";

type SongHeaderProps = {
  emoji?: string;
  title: string;
  children?: React.ReactNode;
};

export function SongHeader({ emoji, title, children }: SongHeaderProps) {
  return (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
          aria-label="ホームに戻る"
        >
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div className="flex items-center gap-2">
          {emoji && <span className="text-2xl">{emoji}</span>}
          <h1 className="font-bold text-xl md:text-2xl">{title}</h1>
        </div>
      </div>
      {children}
    </div>
  );
}
