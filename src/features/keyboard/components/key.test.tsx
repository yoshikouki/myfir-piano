import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { PITCHES } from "../pitches";
import { Key } from "./key";

describe("Key component", () => {
  it("renders white keys with right border", () => {
    const whitePitch = PITCHES.find((p) => !p.includes("#"));
    if (!whitePitch) throw new Error("No white pitch found for testing");

    render(<Key pitch={whitePitch} />);
    const keyElement = screen.getByRole("button");

    expect(keyElement).toHaveClass("border-r");
    expect(keyElement).toHaveClass("border-black");
    expect(keyElement).toHaveClass("bg-white");

    expect(keyElement).not.toHaveClass("border-t");
    expect(keyElement).not.toHaveClass("border-b");
    expect(keyElement).not.toHaveClass("border-l");

    const classList = keyElement.className.split(" ");
    expect(classList).not.toContain("border");
  });

  it("renders black keys with proper styling", () => {
    const blackPitch = PITCHES.find((p) => p.includes("#"));
    if (!blackPitch) throw new Error("No black pitch found for testing");

    render(<Key pitch={blackPitch} />);
    const keyElement = screen.getByRole("button");

    expect(keyElement).toHaveClass("bg-black");
    expect(keyElement).toHaveClass("text-white");
    expect(keyElement).toHaveClass("border-r-0");
    expect(keyElement).toHaveClass("z-10");
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
