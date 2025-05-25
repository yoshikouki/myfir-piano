import { UserMenu } from "@/components/user-menu";
import Link from "next/link";

type HeaderProps = {
  songTitle?: string;
  songEmoji?: string;
};

export function Header({ songTitle, songEmoji }: HeaderProps) {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-gray-200 border-b bg-white/90 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="font-bold text-gray-800 text-xl transition-colors hover:text-gray-600"
          >
            まいふぁーピアノ
          </Link>
          {songTitle && (
            <div className="flex items-center gap-2">
              {songEmoji && <span className="text-2xl">{songEmoji}</span>}
              <h1 className="font-bold text-xl md:text-2xl">{songTitle}</h1>
            </div>
          )}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
