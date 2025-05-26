"use client";

import { useInstallPrompt } from "@/components/use-install-prompt";
import { useAudioEngine } from "@/lib/audio/audio-engine-context";
import { DownloadIcon, Music } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isInstallable, handleInstallClick } = useInstallPrompt();
  const { engineType, setEngineType } = useAudioEngine();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        id="user-menu-button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
        aria-label="ユーザーメニュー"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 min-w-50 rounded-md bg-white py-1 shadow-lg"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
        >
          <button
            type="button"
            onClick={() => {
              setEngineType(engineType === "piano" ? "sample" : "piano");
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-3 px-4 py-2 text-foreground text-sm hover:bg-accent"
            role="menuitem"
          >
            <Music size={16} />
            音源: {engineType === "piano" ? "ピアノ" : "シンプル"}
          </button>

          {isInstallable && (
            <button
              type="button"
              onClick={() => {
                handleInstallClick();
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-2 text-foreground text-sm hover:bg-accent"
              role="menuitem"
            >
              <DownloadIcon size={16} />
              アプリをインストール
            </button>
          )}
        </div>
      )}
    </div>
  );
}
