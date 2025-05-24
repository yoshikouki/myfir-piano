import "@testing-library/jest-dom";
import React from "react";
import { vi } from "vitest";

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
