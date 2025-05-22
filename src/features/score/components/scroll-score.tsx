import type { Song } from "@/lib/song.schema";

export type ScrollScoreProps = {
  song: Song;
  currentIndex?: number;
};

export function ScrollScore({ song, currentIndex }: ScrollScoreProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 text-2xl">
      {song.notes.map((n, i) => (
        <span
          key={`${i}-${n.pitch}`}
          className={i === currentIndex ? "bg-red-500 text-white" : ""}
        >
          {n.lyric ?? "-"}
        </span>
      ))}
    </div>
  );
}
