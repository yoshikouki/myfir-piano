# 設計方針

## 目的
- 要件定義とPoC計画を満たす実装を速く進めつつ将来の拡張を見据える
- CLAUDE.mdの方針に合わせてテスタブルな構造を持つ

## アーキテクチャ
- Package by Featureを採用し`src/features`に機能単位で配置
- UI共通コンポーネントは`src/components`
- 状態管理やビジネスロジックは各Feature内に置きUIと分離
- WebAudioなど副作用を扱う処理は`src/lib`にまとめる
- 依存方向は`features -> components -> lib`の一方向

## 主要Featureの構成例
- `keyboard`
  - 鍵盤表示と押下アニメーション
- `score`
  - カタカナ譜のスクロール表示とハイライト
- `player`
  - 音源再生管理。WebAudioAPI操作のみを担当
- `song`
  - 楽曲データの定義と読み込み

## テスト
- 各Feature配下でVitestによるユニットテストを実施
- 副作用を持つ処理は関数化し、引数からデータを受け取る形でテスト可能にする
- TDDを基本としRed-Green-Refactorを小さい単位で回す

## 将来拡張への備え
- Feature単位の独立性を保つことで新しい機能を追加しやすくする
- サービスワーカーや多言語化など拡張要件は既存Featureを変更せず新Featureとして追加
- 複雑化を防ぐため共有ロジックは`lib`に限り、他Featureへの直接依存は禁止

