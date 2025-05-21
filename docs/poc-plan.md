# PoC計画

## 目的
- 要件定義に基づき、幼児向けピアノ練習アプリの基本機能を早期に検証する。

## 実装範囲
- 必須機能 (Must) のうち PoC で検証すべき項目
  - 鍵盤表示（C3〜C5、常時カタカナ表示）
  - カタカナ譜スクロール（現在ノートのハイライト）
  - 次鍵盤ハイライトモード
  - 単音メロディ再生（Lv.1 / Lv.2 の進行ロジック）
  - AudioEngine 経由のピアノ音源再生（遅延計測を含む）
  - オフライン時の譜面・音源キャッシュ (Service Worker)
- プリセット楽曲: **きらきら星** 1 曲のみ (YAML 定義 → JSON 変換)

## 使用技術
- Next.js(App Router)
- TypeScript
- Tailwind CSS
- WebAudio API
- Vitest / Testing Library
- Playwright Component & E2E

## 作業タスク
1. プロジェクト初期化
   - Next.js + TypeScript + Tailwind の雛形生成
   - `src/` 以下に Package‑by‑Feature のディレクトリを作成
2. ドメインモデル & 楽曲データ
   - `song.schema.ts` を実装
   - `twinkle_twinkle.yaml` を作成し `scripts/build-songs.ts` で JSON 生成・バリデーション
3. 鍵盤 UI コンポーネント
   - 2 オクターブの鍵盤を実装 (SVG または div)
   - タッチイベントで `playNote` を呼び出す
4. 譜面スクロール UI
   - カタカナ譜を左→右へスクロール表示
   - 現在ノートをハイライト
5. AudioEngine PoC
   - SoundFont を読み込み `playNote`, `schedule` を実装
   - モバイル実機でレイテンシ (<50 ms) を計測
6. PlayController PoC
   - Lv.1 / Lv.2 の進行ロジック (正しい鍵盤 or 自動テンポ)
   - 次鍵盤ハイライト・譜面ハイライトと同期
7. テスト
   - ユニット: YAML→JSON 変換, HitJudge
   - 統合: PlayController→AudioEngine 呼び出し順
   - Component: Keyboard, ScrollScore (Playwright)
   - 手動 E2E: iPhone / Android 実機タップ, レイテンシ計測
