import { HeaderContainer } from "@/components/header-container";
import { loadSong } from "@/features/songs/songs";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SongPageClient from "./song-page-client";

type Props = {
  params: Promise<{ songId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { songId } = await params;
  const song = await loadSong(songId);

  if (!song) {
    return {
      title: "曲が見つかりません | まいふぁーピアノ",
    };
  }

  return {
    title: `${song.meta.titleJp} | まいふぁーピアノ`,
  };
}

export default async function SongPage({ params }: Props) {
  const { songId } = await params;
  const song = await loadSong(songId);

  if (!song) {
    notFound();
  }

  return (
    <>
      <HeaderContainer>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
            aria-label="ホームに戻る"
          >
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <div className="flex items-center gap-2">
            {song.meta.emoji && <span className="text-2xl">{song.meta.emoji}</span>}
            <h1 className="font-bold text-xl md:text-2xl">{song.meta.titleJp}</h1>
          </div>
        </div>
      </HeaderContainer>
      <SongPageClient song={song} />
    </>
  );
}
