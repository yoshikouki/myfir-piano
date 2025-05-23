import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

vi.mock("motion/react", () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, prop) => {
        if (typeof prop === "string") {
          return React.forwardRef<any, any>((props, ref) => {
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
