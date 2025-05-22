# 設計

## ディレクトリ構成（Package‑by‑Feature）

```
src/
  app/
    layout.tsx
    page.tsx
  features/
    keyboard/
      components/
    score/
      components/
    player/
  lib/
    audio/
    song.schema.ts
    utils.ts
  songs/
    twinkle_twinkle.json
```

## ドメインモデル

楽曲データは`song.schema.ts`で型安全性を保証しています：

- **Pitch**: C3からC5までの音高定義
- **Note**: 音高・拍比・歌詞を含む音符データ
- **Song**: メタデータ（ID、タイトル、レベル、BPM、拍子）と音符配列

## 譜面データ管理

| 項目 | 内容 |
|---|---|
| 保管場所 | `src/songs/*.json` |
| 型安全性 | `SongSchema` で型安全性を保証 |
| 読み込み | 静的インポートによる楽曲データ取得 |

## AudioEngine & HitJudge

音源再生とタイミング判定を担当：

- **AudioEngine**: Tone.jsを使用した音源の初期化と再生
- **HitJudge**: 期待タイミングと実際のタイミングから判定結果を算出

## PlayController

ゲームプレイの進行を管理：

- 楽曲データの読み込み
- 演奏進行の制御（次音符への進行、完了検知）
- AudioEngineとの連携による音再生
- UIコンポーネントとの状態同期

## テスト戦略

| レイヤ | テスト内容 | ツール |
|---|---|---|
| ユニット | PlayController ロジック／判定処理 | Vitest |
| コンポーネント | 鍵盤・譜面UI の動作確認 | Vitest + Testing Library |
| E2E | ブラウザでの統合動作 (将来) | Playwright |

## Service Worker キャッシュ戦略

| リソース | ポリシー |
|---|---|
| 譜面 JSON | CacheFirst (24h) |
| 音源 | CacheFirst (30d) |
| App Shell | StaleWhileRevalidate |

## 拡張可能性

| 将来機能 | 拡張方針 |
|---|---|
| MIDI キーボード | AudioEngine インターフェースの拡張 |
| 楽曲配信 | 静的インポートからAPI読み込みへの切り替え |
| 複数楽曲対応 | 楽曲選択UIとルーティングの追加 |

