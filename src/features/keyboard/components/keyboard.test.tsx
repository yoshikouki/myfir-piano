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
    // This test assumes C4 is the first key with label "ド"
    // and that PITCHES includes C4.
    fireEvent.pointerDown(screen.getAllByText("ド")[0]);
    expect(spy).toHaveBeenCalledWith("C4");
  });

  it("highlights the specified pitch", () => {
    const { rerender } = render(<Keyboard />);
    const whiteKeys = screen.getAllByRole("button");
    const c4Button = whiteKeys.find((el) => el.getAttribute("data-pitch") === "C4");

    expect(c4Button).toBeDefined();
    if (!c4Button) return;
    const initialClasses = c4Button.className;
    expect(initialClasses).toContain("bg-white");

    rerender(<Keyboard highlightedPitch="C4" />);
    const highlightedKeys = screen.getAllByRole("button");
    const highlightedC4 = highlightedKeys.find((el) => el.getAttribute("data-pitch") === "C4");

    expect(highlightedC4).toBeDefined();
    if (!highlightedC4) return;
    const highlightedClasses = highlightedC4.className;
    expect(highlightedClasses).toContain("bg-primary");
    expect(highlightedClasses).toContain("text-white");
    expect(highlightedClasses).toContain("font-bold");
    expect(highlightedClasses).not.toContain("bg-white");
  });

  it("highlights black keys correctly", () => {
    render(<Keyboard highlightedPitch="C#4" />);
    const blackKeys = screen.getAllByRole("button", { name: "" });
    const blackKey = blackKeys.find((el) => el.getAttribute("data-pitch") === "C#4");

    expect(blackKey).toBeDefined();
    if (!blackKey) return;
    const classes = blackKey.className;
    expect(classes).toContain("bg-primary");
    expect(classes).not.toContain("bg-black");
  });
});
