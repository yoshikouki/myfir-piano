import { type SongId, loadSong } from "@/features/songs/songs";
import type { Metadata } from "next";
import SongPageClient from "./song-page-client";

type Props = {
  params: { songId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const song = await loadSong(params.songId as SongId);
    return {
      title: `${song.meta.titleJp} | まいふぁーピアノ`,
    };
  } catch {
    return {
      title: "曲が見つかりません | まいふぁーピアノ",
    };
  }
}

export default function SongPage() {
  return <SongPageClient />;
}
