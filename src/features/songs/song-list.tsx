"use client";

import { loadAllSongs } from "@/features/songs/songs";
import type { Song } from "@/songs/song.schema";
import Link from "next/link";
import { useEffect, useState } from "react";

export function SongList() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSongs = async () => {
      try {
        const allSongs = await loadAllSongs();
        setSongs(allSongs);
      } catch (error) {
        console.error("Failed to load songs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSongs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-gray-500">きょくを よみこみちゅう...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="mb-6 text-center font-bold text-2xl">きょくリスト</h1>
      <div className="space-y-3">
        {songs.map((song) => (
          <Link
            key={song.meta.id}
            href={`/song/${song.meta.id}`}
            className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{song.meta.emoji}</span>
              <div>
                <div className="font-medium text-lg">{song.meta.titleJp}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
