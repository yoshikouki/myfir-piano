"use client";

import { type ReactNode, createContext, useContext, useState } from "react";
import type { AudioEngineType } from "./audio-engine-factory";

type AudioEngineContextType = {
  engineType: AudioEngineType;
  setEngineType: (type: AudioEngineType) => void;
};

const AudioEngineContext = createContext<AudioEngineContextType | undefined>(undefined);

export function AudioEngineProvider({ children }: { children: ReactNode }) {
  const [engineType, setEngineType] = useState<AudioEngineType>("piano");

  return (
    <AudioEngineContext.Provider value={{ engineType, setEngineType }}>
      {children}
    </AudioEngineContext.Provider>
  );
}

export function useAudioEngine() {
  const context = useContext(AudioEngineContext);
  if (!context) {
    throw new Error("useAudioEngine must be used within AudioEngineProvider");
  }
  return context;
}
