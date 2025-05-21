import type { Song } from "@/lib/song.schema";

export type ScrollScoreProps = {
  song: Song;
  currentIndex: number;
};

export function ScrollScore({ song, currentIndex }: ScrollScoreProps) {
  return (
    <div className="flex overflow-x-hidden whitespace-nowrap">
      {song.notes.map((n, i) => (
        <span key={`${i}-${n.pitch}`} className={i === currentIndex ? "text-red-600" : ""}>
          {n.lyric ?? "-"}
        </span>
      ))}
    </div>
  );
}
