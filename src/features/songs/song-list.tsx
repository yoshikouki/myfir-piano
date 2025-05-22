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
        <div className="text-gray-500">楽曲を読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="mb-6 text-center font-bold text-2xl">楽曲リスト</h1>
      <div className="space-y-3">
        {songs.map((song) => (
          <Link
            key={song.meta.id}
            href={`/song/${song.meta.id}`}
            className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="font-medium text-lg">{song.meta.titleJp}</div>
            {song.meta.titleEn && (
              <div className="text-gray-600 text-sm">{song.meta.titleEn}</div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
