import { PITCHES, type Pitch } from "../pitches";
import { Key } from "./key";

export type KeyboardProps = {
  onPress?: (pitch: Pitch) => void;
};

export function Keyboard({ onPress }: KeyboardProps) {
  return (
    <div className="relative flex">
      {PITCHES.map((p) => (
        <Key key={p} pitch={p} onPress={onPress} />
      ))}
    </div>
  );
}
