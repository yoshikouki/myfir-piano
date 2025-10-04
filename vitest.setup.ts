import "@testing-library/jest-dom";
import React from "react";
import { vi } from "vitest";

declare global {
  var mockPolySynth: {
    set: ReturnType<typeof vi.fn>;
    triggerAttackRelease: ReturnType<typeof vi.fn>;
    triggerRelease: ReturnType<typeof vi.fn>;
    toDestination: ReturnType<typeof vi.fn>;
    chain: ReturnType<typeof vi.fn>;
  };
}

type MotionProps = {
  animate?: unknown;
  transition?: unknown;
  layoutId?: string;
  whileHover?: unknown;
  whileTap?: unknown;
  initial?: unknown;
  exit?: unknown;
  [key: string]: unknown;
};

vi.mock("motion/react", () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, prop) => {
        if (typeof prop === "string") {
          return React.forwardRef<HTMLElement, MotionProps>((props, ref) => {
            const {
              animate,
              transition,
              layoutId,
              whileHover,
              whileTap,
              initial,
              exit,
              ...domProps
            } = props;
            return React.createElement(prop, { ...domProps, ref });
          });
        }
        return undefined;
      },
    },
  ),
}));

vi.mock("@/lib/audio/piano-audio-engine", () => ({
  PianoAudioEngine: vi.fn().mockImplementation(() => ({
    load: vi.fn().mockResolvedValue(undefined),
    playNote: vi.fn(),
    playNoteWithDuration: vi.fn(),
    stopNote: vi.fn(),
  })),
}));

global.mockPolySynth = {
  set: vi.fn(),
  triggerAttackRelease: vi.fn(),
  triggerRelease: vi.fn(),
  toDestination: vi.fn().mockReturnThis(),
  chain: vi.fn().mockReturnThis(),
};

const mockReverb = {};
const mockChorus = {};
const mockEQ3 = {};

vi.mock("tone", () => ({
  PolySynth: vi.fn().mockReturnValue(global.mockPolySynth),
  Synth: vi.fn(),
  Reverb: vi.fn().mockReturnValue(mockReverb),
  Chorus: vi.fn().mockReturnValue(mockChorus),
  EQ3: vi.fn().mockReturnValue(mockEQ3),
  Destination: {},
  Volume: vi.fn().mockImplementation(() => ({
    toDestination: vi.fn().mockReturnThis(),
  })),
  start: vi.fn().mockResolvedValue(undefined),
  getDestination: vi.fn().mockReturnValue({
    volume: { value: 0 },
  }),
}));
