import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InstallButton } from "./install-button";

interface MockBeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

describe("InstallButton", () => {
  let mockDeferredPrompt: MockBeforeInstallPromptEvent;

  beforeEach(() => {
    const event = new Event("beforeinstallprompt");
    mockDeferredPrompt = Object.assign(event, {
      prompt: vi.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: "accepted" }),
    }) as MockBeforeInstallPromptEvent;

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("表示されない（インストール不可の場合）", () => {
    render(<InstallButton />);
    expect(screen.queryByText("アプリをインストール")).not.toBeInTheDocument();
  });

  it("beforeinstallpromptイベントが発生した場合に表示される", async () => {
    render(<InstallButton />);

    await act(async () => {
      window.dispatchEvent(mockDeferredPrompt);
    });

    expect(screen.getByText("アプリをインストール")).toBeInTheDocument();
  });

  it("インストールボタンをクリックするとプロンプトが表示される", async () => {
    render(<InstallButton />);

    await act(async () => {
      window.dispatchEvent(mockDeferredPrompt);
    });
    const button = screen.getByText("アプリをインストール");

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockDeferredPrompt.prompt).toHaveBeenCalled();
    });
  });

  it("インストールが完了したらボタンが非表示になる", async () => {
    render(<InstallButton />);

    await act(async () => {
      window.dispatchEvent(mockDeferredPrompt);
    });
    const button = screen.getByText("アプリをインストール");

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.queryByText("アプリをインストール")).not.toBeInTheDocument();
    });
  });

  it("既にスタンドアロンモードの場合は表示されない", () => {
    (window.matchMedia as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => ({
      matches: true,
      media: "(display-mode: standalone)",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<InstallButton />);
    expect(screen.queryByText("アプリをインストール")).not.toBeInTheDocument();
  });

  it("インストールがキャンセルされた場合", async () => {
    mockDeferredPrompt.userChoice = Promise.resolve({ outcome: "dismissed" });

    render(<InstallButton />);
    await act(async () => {
      window.dispatchEvent(mockDeferredPrompt);
    });

    const button = screen.getByText("アプリをインストール");

    await act(async () => {
      fireEvent.click(button);
      await mockDeferredPrompt.userChoice;
    });

    expect(screen.queryByText("アプリをインストール")).not.toBeInTheDocument();
  });
});
