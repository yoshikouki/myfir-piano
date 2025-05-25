import { type SongId, loadSong } from "@/features/songs/songs";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SongPageClient from "./song-page-client";

type Props = {
  params: { songId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const song = await loadSong(params.songId as SongId).catch(() => null);

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
  const song = await loadSong(params.songId as SongId).catch(() => null);

  if (!song) {
    notFound();
  }

  return <SongPageClient song={song} />;
}
