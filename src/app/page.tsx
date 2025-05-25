import { HeaderContainer } from "@/components/header-container";
import { SongList } from "@/features/songs/song-list";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <HeaderContainer>
        <Link
          href="/"
          className="font-bold text-gray-800 text-xl transition-colors hover:text-gray-600"
        >
          まいふぁーピアノ
        </Link>
      </HeaderContainer>
      <main className="min-h-screen bg-background pt-16">
        <SongList />
      </main>
    </>
  );
}
