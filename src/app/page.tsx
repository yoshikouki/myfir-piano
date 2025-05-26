import { HeaderContainer } from "@/components/header-container";
import { UserMenu } from "@/components/user-menu";
import { SongList } from "@/features/songs/song-list";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <HeaderContainer>
        <div className="flex w-full items-center justify-between">
          <Link
            href="/"
            className="font-bold text-gray-800 text-xl transition-colors hover:text-gray-600"
          >
            まいふぁーピアノ
          </Link>
          <UserMenu />
        </div>
      </HeaderContainer>
      <main className="min-h-screen bg-background pt-16">
        <SongList />
      </main>
    </>
  );
}
