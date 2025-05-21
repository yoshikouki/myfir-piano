import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Keyboard } from "./keyboard";

describe("Keyboard", () => {
  it("calls onPress with pitch", () => {
    const spy = vi.fn();
    render(<Keyboard onPress={spy} />);
    fireEvent.pointerDown(screen.getAllByText("ド")[0]);
    expect(spy).toHaveBeenCalledWith("C3");
  });
});
