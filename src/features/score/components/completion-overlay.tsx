"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface CompletionOverlayProps {
  isVisible: boolean;
}

export function CompletionOverlay({ isVisible }: CompletionOverlayProps) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-gradient-to-br from-yellow-300/90 via-orange-400/90 to-pink-500/90",
        "fade-in animate-in duration-300",
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="text-center">
        <h1 className="zoom-in-110 mb-4 animate-in font-bold text-8xl text-white duration-500">
          かんせい！
        </h1>
        <div className="flex justify-center gap-2">
          {[0.0, 0.1, 0.2, 0.3, 0.4].map((delay) => (
            <div
              key={`bounce-dot-${delay}`}
              className={cn("h-12 w-12 rounded-full bg-white/80", "animate-bounce")}
              style={{
                animationDelay: `${delay}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
