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
    const testPitch = PITCHES[0];
    const { rerender } = render(<Key pitch={testPitch} highlighted={false} />);

    rerender(<Key pitch={testPitch} highlighted={true} />);
    const keyElement = screen.getByRole("button");

    expect(keyElement).toHaveAttribute("data-pitch", testPitch);
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
