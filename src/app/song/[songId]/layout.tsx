import { Header } from "@/components/header";
import { type SongId, loadSong } from "@/features/songs/songs";
import type { Metadata } from "next";

type Props = {
  params: { songId: string };
  children: React.ReactNode;
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

export default async function SongLayout({ params, children }: Props) {
  let songTitle: string | undefined;
  let songEmoji: string | undefined;

  try {
    const song = await loadSong(params.songId as SongId);
    songTitle = song.meta.titleJp;
    songEmoji = song.meta.emoji;
  } catch {
    // エラーの場合は何も表示しない
  }

  return (
    <>
      <Header songTitle={songTitle} songEmoji={songEmoji} />
      <main className="pt-16">{children}</main>
    </>
  );
}
