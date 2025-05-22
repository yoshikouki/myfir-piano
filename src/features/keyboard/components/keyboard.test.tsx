import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Keyboard } from "./keyboard";

describe("Keyboard", () => {
  it("renders correctly and displays keys", () => {
    render(<Keyboard />);
    const keys = screen.getAllByRole("button");
    expect(keys.length).toBeGreaterThan(0); // Checks that PITCHES are rendered
  });

  it("calls onPress with pitch", () => {
    const spy = vi.fn();
    render(<Keyboard onPress={spy} />);
    // This test assumes C3 is the first key with label "ド"
    // and that PITCHES includes C3.
    fireEvent.pointerDown(screen.getAllByText("ド")[0]); 
    expect(spy).toHaveBeenCalledWith("C3");
  });
});
