"use client";

import { AnimatePresence, motion } from "motion/react";
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

  return (
    <AnimatePresence>
      {shouldRender && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-secondary/90 via-accent/90 to-primary/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          role="alert"
          aria-live="assertive"
        >
          <div className="space-y-10 text-center">
            <motion.p
              className="mb-4 font-bold text-8xl text-primary-foreground"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              かんせい
            </motion.p>
            <div className="flex justify-center gap-2">
              {[0.0, 0.1, 0.2, 0.3, 0.4].map((delay) => (
                <motion.div
                  key={`bounce-dot-${delay}`}
                  className="h-12 w-12 rounded-full bg-primary-foreground/80"
                  initial={{ y: 0 }}
                  animate={{
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Number.POSITIVE_INFINITY,
                    delay,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
