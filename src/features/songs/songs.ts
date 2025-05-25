import type { Song } from "@/songs/song.schema";

const songFiles = {
  akatonbo: () => import("@/songs/akatonbo.json"),
  alps_ichimanjaku: () => import("@/songs/alps_ichimanjaku.json"),
  butterfly: () => import("@/songs/butterfly.json"),
  do_re_mi: () => import("@/songs/do_re_mi.json"),
  frog_chorus: () => import("@/songs/frog_chorus.json"),
  furusato: () => import("@/songs/furusato.json"),
  happy_birthday: () => import("@/songs/happy_birthday.json"),
  inu_no_omawarisan: () => import("@/songs/inu_no_omawarisan.json"),
  mary_had_a_little_lamb: () => import("@/songs/mary_had_a_little_lamb.json"),
  ookina_kuri_no_ki: () => import("@/songs/ookina_kuri_no_ki.json"),
  sakura: () => import("@/songs/sakura.json"),
  twinkle_twinkle: () => import("@/songs/twinkle_twinkle.json"),
  usagi_to_kame: () => import("@/songs/usagi_to_kame.json"),
  zou_san: () => import("@/songs/zou_san.json"),
} as const;

export type SongId = keyof typeof songFiles;

export function isSongId(value: string): value is SongId {
  return value in songFiles;
}

export async function loadSong(songId: string): Promise<Song | null> {
  if (!isSongId(songId)) {
    return null;
  }

  const songModule = await songFiles[songId]();
  return songModule.default as Song;
}

export async function loadAllSongs(): Promise<Song[]> {
  const songs = await Promise.all(
    Object.keys(songFiles).map(async (songId) => loadSong(songId)),
  );
  return songs.filter((song): song is Song => song !== null);
}

export function getSongIds(): SongId[] {
  return Object.keys(songFiles) as SongId[];
}
