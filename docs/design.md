# 設計方針

## 目的
- 要件定義とPoC計画を満たす実装を速く進めつつ将来の拡張を見据える
- テスタブルな構造を持つ

## アーキテクチャ
- Package by Featureを採用し`src/features`に機能単位で配置
- UI共通コンポーネントは`src/components`
- 状態管理やビジネスロジックは各Feature内に置きUIと分離
- WebAudioなど副作用を扱う処理は`src/lib`にまとめる
- 依存方向は、依存逆転原則(Dependency Inversion Principle) に従う

## 主要Feature
- `keyboard`
  - 鍵盤表示と押下アニメーション
  - user入力の受け付け
- `score`
  - カタカナ譜のスクロール表示とハイライト
  - `player`の再生位置と連動
- `player`
  - 音源再生管理。WebAudio API操作のみを担当
  - `song`データを受け取り再生イベントを発火
- `song`
  - 楽曲データの定義と読み込み
  - JSONからNote列を返す

## 状態管理とデータフロー
- 画面上位コンポーネントが各Featureを組み合わせてオーケストレーション
- `player`が再生中のNoteを通知し`keyboard`と`score`が現在位置を更新
- Feature間は明示的な関数注入のみで結合しContext依存を避ける
- WebAudio API利用部分は`lib/audio`のファクトリ関数から注入

## テスト
- 各Feature配下でVitestによるユニットテストを実施
- 副作用を持つ処理は関数化し引数からデータを受け取る形でテスト可能にする
- TDDを基本としRed-Green-Refactorを小さい単位で回す

## 将来拡張への備え
- Feature単位の独立性を保つことで新しい機能を追加しやすくする
- サービスワーカーや多言語化など拡張要件は既存Featureを変更せず新Featureとして追加
- 複雑化を防ぐため共有ロジックは`lib`に限り、他Featureへの直接依存は禁止

