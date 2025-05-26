import { loadSong } from "@/features/songs/songs";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SongPageWrapper } from "./song-page-wrapper";

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

  return <SongPageWrapper song={song} />;
}
