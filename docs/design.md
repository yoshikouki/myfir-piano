# 設計

## ディレクトリ構成（Package‑by‑Feature）

```
src/
  app/
    layout.tsx
    page.tsx
    play/[songId]/page.tsx
    result/[songId]/page.tsx
  components/
  features/
    keyboard/
    score/
    player/
    progress/
  repositories/
    song/
      local.ts
      cms.ts
  lib/
    audio/
    i18n/
  songs/
    twinkle_twinkle.json
    kaeru.json
  scripts/
    build-songs.ts
  workers/
    sw.ts
```

## ドメインモデル

```ts
// song.schema.ts
import { z } from "zod";

export const Pitch = z.enum([
  "C3","C#3","D3","D#3","E3","F3","F#3","G3","G#3","A3","A#3","B3",
  "C4","C#4","D4","D#4","E4","F4","F#4","G4","G#4","A4","A#4","B4",
  "C5",
]);
export type Pitch = z.infer<typeof Pitch>;

export const NoteSchema = z.object({
  pitch: Pitch,
  duration: z.number(),           // 拍比 (1 = 四分音符)
  lyric: z.string().optional(),
});

export const SongSchema = z.object({
  meta: z.object({
    id: z.string(),
    titleJp: z.string(),
    titleEn: z.string().optional(),
    level: z.number().int().min(1).max(5),
    bpm: z.number(),
    timeSig: z.tuple([z.number(), z.number()]),
  }),
  notes: z.array(NoteSchema),
});
export type Song = z.infer<typeof SongSchema>;
```

## 譜面データ管理

| 項目 | 内容 |
|---|---|
| 保管場所 | `src/songs/*.json` |
| 変換フロー | `scripts/build-songs.ts` が JSON を検証し `SongSchema` に整形 |
| Repository | `SongRepository` 抽象 + `LocalSongRepo` 実装（将来 `CmsSongRepo` 追加） |

## AudioEngine & HitJudge

```ts
export interface AudioEngine {
  load(fontUrl: string): Promise<void>;
  playNote(pitch: Pitch, velocity: number): void;
  schedule(notes: ScheduledNote[]): void;
}

export interface HitJudge {
  judge(expectedAt: number, actualAt: number): "perfect" | "good" | "miss";
}
```

## PlayController

```ts
export class PlayController {
  constructor(
    private songRepo: SongRepository,
    private player: AudioEngine,
    private judge: HitJudge,
  ) {}

  async load(id: string) {
    this.song = await this.songRepo.get(id);
  }

  start() {
    // schedule notes, subscribe input, emit progress
  }
}
```

## テスト戦略

| レイヤ | テスト内容 | ツール |
|---|---|---|
| ユニット | YAML→JSON 変換／HitJudge 判定 | Vitest |
| 統合 | PlayController → AudioEngine 呼び出し順 | Vitest |
| コンポーネント | 鍵盤 UI 反映 | Playwright Component |
| E2E | 実機タッチ／遅延計測 (将来) | Playwright + BrowserStack |

## Service Worker キャッシュ戦略

| リソース | ポリシー |
|---|---|
| 譜面 JSON | CacheFirst (24h) |
| 音源 | CacheFirst (30d) |
| App Shell | StaleWhileRevalidate |

## 拡張フック

| 将来機能 | 仕込み箇所 |
|---|---|
| MIDI キーボード | `MidiOutEngine` |
| CMS 楽曲配信 | `CmsSongRepo` |
| AR Piano | `<VisionProvider>` コンテキスト |

