import type { Song } from "@/lib/song.schema";

export type ScrollScoreProps = {
  song: Song;
};

export function ScrollScore({ song }: ScrollScoreProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 text-2xl">
      {song.notes.map((n, i) => (
        <span key={`${i}-${n.pitch}`} cl>
          {n.lyric ?? "-"}
        </span>
      ))}
    </div>
  );
}
