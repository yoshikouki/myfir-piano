import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { PITCHES } from "../pitches";
import { Key } from "./key";

describe("Key component", () => {
  it("renders white key with pitch label", () => {
    const whitePitch = PITCHES.find((p) => !p.includes("#"));
    if (!whitePitch) throw new Error("No white pitch found for testing");

    render(<Key pitch={whitePitch} />);
    const keyElement = screen.getByRole("button");

    expect(keyElement).toHaveAttribute("data-pitch", whitePitch);
    expect(keyElement).toHaveTextContent(/\S/);
  });

  it("renders black key without visible text", () => {
    const blackPitch = PITCHES.find((p) => p.includes("#"));
    if (!blackPitch) throw new Error("No black pitch found for testing");

    render(<Key pitch={blackPitch} />);
    const keyElement = screen.getByRole("button");

    expect(keyElement).toHaveAttribute("data-pitch", blackPitch);
    expect(keyElement).not.toHaveTextContent(/\S/);
  });

  it("applies highlighted state correctly", () => {
    const whitePitch = PITCHES.find((p) => !p.includes("#"));
    if (!whitePitch) throw new Error("No white pitch found for testing");

    const { rerender } = render(<Key pitch={whitePitch} highlighted={false} />);
    const keyElement = screen.getByRole("button");
    const initialClasses = keyElement.className;

    expect(keyElement).toHaveAttribute("data-pitch", whitePitch);
    expect(initialClasses).toContain("bg-white");

    rerender(<Key pitch={whitePitch} highlighted={true} />);
    const highlightedKeyElement = screen.getByRole("button");
    const highlightedClasses = highlightedKeyElement.className;

    expect(highlightedKeyElement).toHaveAttribute("data-pitch", whitePitch);
    expect(highlightedClasses).toContain("bg-primary");
    expect(highlightedClasses).toContain("text-white");
    expect(highlightedClasses).toContain("font-bold");
    expect(highlightedClasses).not.toContain("bg-white");
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
