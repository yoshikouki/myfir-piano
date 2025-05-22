import { SongList } from "@/features/songs/song-list";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SongList />
    </div>
  );
}
