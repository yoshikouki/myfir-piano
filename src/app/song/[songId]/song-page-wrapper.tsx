"use client";

import { HeaderContainer } from "@/components/header-container";
import { UserMenu } from "@/components/user-menu";
import type { Song } from "@/songs/song.schema";
import { useState } from "react";
import { PlayDemoButton } from "./play-demo-button";
import { ResetButton } from "./reset-button";
import { SongHeader } from "./song-header";
import SongPageClient from "./song-page-client";

type Props = {
  song: Song;
};

export function SongPageWrapper({ song }: Props) {
  const [resetKey, setResetKey] = useState(0);
  const [demoPlayingIndex, setDemoPlayingIndex] = useState(-1);

  const handleReset = () => {
    setResetKey((prev) => prev + 1);
    setDemoPlayingIndex(-1);
  };

  return (
    <>
      <HeaderContainer>
        <SongHeader emoji={song.meta.emoji} title={song.meta.titleJp}>
          <div className="flex items-center gap-2">
            <PlayDemoButton song={song} onIndexChange={setDemoPlayingIndex} />
            <ResetButton onReset={handleReset} />
            <UserMenu />
          </div>
        </SongHeader>
      </HeaderContainer>
      <div key={resetKey}>
        <SongPageClient song={song} demoPlayingIndex={demoPlayingIndex} />
      </div>
    </>
  );
}
