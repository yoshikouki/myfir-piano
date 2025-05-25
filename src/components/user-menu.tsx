"use client";

import { useInstallPrompt } from "@/components/use-install-prompt";
import { useEffect, useRef, useState } from "react";

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isInstallable, handleInstallClick } = useInstallPrompt();

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
          className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
        >
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
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              アプリをインストール
            </button>
          )}
        </div>
      )}
    </div>
  );
}
