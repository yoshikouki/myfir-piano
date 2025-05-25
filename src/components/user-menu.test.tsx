import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UserMenu } from "./user-menu";

const mockUseInstallPrompt = vi.fn();

vi.mock("@/components/use-install-prompt", () => ({
  useInstallPrompt: () => mockUseInstallPrompt(),
}));

describe("UserMenu", () => {
  beforeEach(() => {
    mockUseInstallPrompt.mockReturnValue({
      isInstallable: false,
      handleInstallClick: vi.fn(),
    });
  });

  it("メニューボタンが表示される", () => {
    render(<UserMenu />);
    expect(screen.getByLabelText("ユーザーメニュー")).toBeInTheDocument();
  });

  it("クリックでメニューが開く", () => {
    render(<UserMenu />);
    const button = screen.getByLabelText("ユーザーメニュー");

    fireEvent.click(button);

    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("メニュー外クリックでメニューが閉じる", async () => {
    render(<UserMenu />);
    const button = screen.getByLabelText("ユーザーメニュー");

    fireEvent.click(button);
    expect(screen.getByRole("menu")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("インストール可能な場合、インストールボタンが表示される", () => {
    mockUseInstallPrompt.mockReturnValue({
      isInstallable: true,
      handleInstallClick: vi.fn(),
    });

    render(<UserMenu />);
    const button = screen.getByLabelText("ユーザーメニュー");

    fireEvent.click(button);

    expect(screen.getByText("アプリをインストール")).toBeInTheDocument();
  });

  it("インストールボタンクリックでhandleInstallClickが呼ばれる", () => {
    const handleInstallClick = vi.fn();
    mockUseInstallPrompt.mockReturnValue({
      isInstallable: true,
      handleInstallClick,
    });

    render(<UserMenu />);
    const button = screen.getByLabelText("ユーザーメニュー");

    fireEvent.click(button);
    fireEvent.click(screen.getByText("アプリをインストール"));

    expect(handleInstallClick).toHaveBeenCalled();
  });

  it("インストールボタンクリックでメニューが閉じる", async () => {
    mockUseInstallPrompt.mockReturnValue({
      isInstallable: true,
      handleInstallClick: vi.fn(),
    });

    render(<UserMenu />);
    const button = screen.getByLabelText("ユーザーメニュー");

    fireEvent.click(button);
    fireEvent.click(screen.getByText("アプリをインストール"));

    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });
});
