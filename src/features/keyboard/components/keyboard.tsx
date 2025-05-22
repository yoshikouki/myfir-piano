import { PITCHES, type Pitch } from "../pitches";
import { Key } from "./key";

export type KeyboardProps = {
  highlightedPitch?: Pitch;
  onPress?: (pitch: Pitch) => void;
};

export function Keyboard({ highlightedPitch, onPress }: KeyboardProps) {
  return (
    <div className="relative flex">
      {PITCHES.map((p) => (
        <Key key={p} pitch={p} highlighted={p === highlightedPitch} onPress={onPress} />
      ))}
    </div>
  );
}
