# PoC計画

## 目的
- [要件定義](./requirements.md) に基づき、幼児向けピアノ練習アプリの基本機能を早期に検証する。

## 実装範囲
- 必須機能 (Must) のうち PoC で検証すべき項目
  - 鍵盤表示（C3〜C5、常時カタカナ表示）
  - カタカナ譜スクロール（現在ノートのハイライト）
  - 次鍵盤ハイライトモード
  - 単音メロディ再生（Lv.1 / Lv.2 の進行ロジック）
  - AudioEngine 経由のピアノ音源再生（遅延計測を含む）
  - ピアノ音源形式 (SoundFont／分割サンプル) の比較と KPI 収集
  - オフライン時の譜面・音源キャッシュ (Service Worker)
- プリセット楽曲: **きらきら星** 1 曲のみ (YAML 定義 → JSON 変換)

## 使用技術
- Next.js(App Router)
- TypeScript
- Tailwind CSS
- WebAudio API
- motion (for animation)
- Vitest / Testing Library
- Playwright Component & E2E

## 作業タスク
1. ✅ プロジェクト初期化
   - Next.js + TypeScript + Tailwind の雛形生成
   - `src/` 以下に Package‑by‑Feature のディレクトリを作成
2. ✅ ドメインモデル & 楽曲データ
   - `song.schema.ts` を実装
   - `twinkle_twinkle.json` を `src/songs` で管理
3. ✅ 鍵盤 UI コンポーネント
   - 2 オクターブの鍵盤を実装 (div ベース)
   - タッチイベントで `playNote` を呼び出す
   - 次に弾くべき鍵盤のハイライト機能を実装
4. ✅ 譜面スクロール UI
   - カタカナ譜の表示を実装
   - 現在ノート・過去ノート・未来ノートの視覚的区別
   - 現在ノートをハイライト
5. ✅ AudioEngine PoC & 音源形式比較
   - **方式B: 分割サンプル (合成音源)** を SampleAudioEngine で実装
   - WebAudio API で各音程の合成音を生成・再生
   - 低レイテンシでの音再生を実現
6. ✅ PlayController PoC
   - Lv.1 の進行ロジック (正しい鍵盤を押すと次音へ進行)
   - 次鍵盤ハイライト・譜面ハイライトと同期
   - 完了検知・リセット機能を実装
7. テスト
   - ユニット: YAML→JSON 変換, HitJudge
   - 統合: PlayController→AudioEngine 呼び出し順
   - Component: Keyboard, ScrollScore (Playwright)
   - 手動 E2E: iPhone / Android 実機タップ, レイテンシ計測
