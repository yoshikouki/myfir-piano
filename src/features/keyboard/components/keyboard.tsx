import { PITCHES, type Pitch } from "../pitches";
import { Key } from "./key";

export type KeyboardProps = {
  highlightedPitch?: Pitch;
  onPress?: (pitch: Pitch) => void;
};

export function Keyboard({ highlightedPitch, onPress }: KeyboardProps) {
  const whiteKeys = PITCHES.filter((p) => !p.includes("#"));
  const blackKeys = PITCHES.filter((p) => p.includes("#"));

  return (
    <div className="relative flex w-full">
      {whiteKeys.map((p) => (
        <Key key={p} pitch={p} highlighted={p === highlightedPitch} onPress={onPress} />
      ))}
      {blackKeys.map((p, _index) => {
        const whiteKeyIndex = whiteKeys.findIndex((wp) => {
          const pitchBase = p.slice(0, -1);
          const whiteBase = wp.slice(0, -1);
          const octave = p.slice(-1);
          const whiteOctave = wp.slice(-1);

          if (pitchBase === "C#" || pitchBase === "F#") {
            return whiteBase === pitchBase.slice(0, 1) && whiteOctave === octave;
          }
          return (
            (whiteBase === "D" && pitchBase === "D#" && whiteOctave === octave) ||
            (whiteBase === "G" && pitchBase === "G#" && whiteOctave === octave) ||
            (whiteBase === "A" && pitchBase === "A#" && whiteOctave === octave)
          );
        });

        return (
          <div
            key={p}
            className="absolute z-10"
            style={{
              left: `${((whiteKeyIndex + 0.75) / whiteKeys.length) * 100}%`,
              width: `${(0.6 / whiteKeys.length) * 100}%`,
            }}
          >
            <Key pitch={p} highlighted={p === highlightedPitch} onPress={onPress} />
          </div>
        );
      })}
    </div>
  );
}
