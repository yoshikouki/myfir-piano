import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { Key } from "./key";
import { PITCHES } from "../pitches";

describe("Key component", () => {
  it("renders white keys with only vertical borders", () => {
    const whitePitch = PITCHES.find(p => !p.includes("#"));
    if (!whitePitch) throw new Error("No white pitch found for testing");

    render(<Key pitch={whitePitch} />);
    const keyElement = screen.getByRole("button");

    // Check for presence of side borders
    expect(keyElement).toHaveClass("border-x");
    expect(keyElement).toHaveClass("border-black");

    // Check for absence of top, bottom, or general border class (unless border-x implies border)
    // Given cn behavior and Tailwind, 'border-x' should not automatically imply 'border'
    // and should not have top/bottom specific classes.
    expect(keyElement).not.toHaveClass("border-t");
    expect(keyElement).not.toHaveClass("border-b");
    expect(keyElement).not.toHaveClass("border-y");

    // A key with only `border-x` should not have the generic `border` class.
    // However, this depends on how `cn` resolves conflicts if `border-black` is somehow tied to `border`.
    // The most straightforward reading is that `border-x` and `border` are distinct.
    // If `border-black` requires `border`, this test might be too strict.
    // For now, let's assume `border-x` is exclusive of `border`.
    // The black key class explicitly adds `border`, so this distinction is important.
    const classList = keyElement.className.split(" ");
    expect(classList).not.toContain("border"); // Check that the single word "border" is not a class
  });

  it("renders black keys with all borders", () => {
    const blackPitch = PITCHES.find(p => p.includes("#"));
    if (!blackPitch) throw new Error("No black pitch found for testing");

    render(<Key pitch={blackPitch} />);
    const keyElement = screen.getByRole("button");

    // Black keys should have the full border due to the conditional class
    // "... border border-black" which should override/merge with "border-x border-black"
    expect(keyElement).toHaveClass("border");
    expect(keyElement).toHaveClass("border-black");

    // It might also have border-x from the base class, which is fine as long as 'border' takes precedence visually.
    // We don't need to assert the absence of border-x, -t, -b, -y if 'border' is present.
  });

  it("calls onPress when a key is pressed", () => {
    const mockOnPress = vi.fn();
    const testPitch = PITCHES[0];
    render(<Key pitch={testPitch} onPress={mockOnPress} />);
    const keyElement = screen.getByRole("button");

    // Simulate a pointer down event
    keyElement.dispatchEvent(new Event("pointerdown", { bubbles: true }));

    expect(mockOnPress).toHaveBeenCalledTimes(1);
    expect(mockOnPress).toHaveBeenCalledWith(testPitch);
  });
});
