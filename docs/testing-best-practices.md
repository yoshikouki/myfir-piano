# Testing Best Practices

このドキュメントは、myfir-pianoプロジェクトにおけるテストのベストプラクティスをまとめたものです。

## テスト環境

- **フレームワーク**: Vitest
- **DOM テスティング**: @testing-library/react
- **アサーションライブラリ**: @testing-library/jest-dom

## テストファイルの命名規則

- **Reactコンポーネント**: `*.test.tsx`
- **その他のテスト**: `*.test.ts`
- テストファイルは実装ファイルと同じディレクトリに配置

## 基本的なテスト構造

### describe / it パターン

```typescript
describe("ComponentName", () => {
  it("期待される動作を日本語で記述", () => {
    // テスト実装
  });
});
```

### Setup と Teardown

```typescript
describe("Component", () => {
  beforeEach(() => {
    // 各テスト前の共通セットアップ
  });

  afterEach(() => {
    // 各テスト後のクリーンアップ
  });
});
```

## Reactコンポーネントのテスト

### 基本的なレンダリングテスト

```typescript
it("コンポーネントが正しくレンダリングされる", () => {
  render(<Component />);
  expect(screen.getByRole("button")).toBeInTheDocument();
});
```

### アクセシビリティ属性によるクエリ

優先順位：
1. `getByRole` - ARIA roleベース
2. `getByLabelText` - ラベルテキスト
3. `getByText` - 表示テキスト
4. `getByTestId` - data-testid（最終手段）

```typescript
// 推奨: roleベースのクエリ
screen.getByRole("button", { name: "送信" });
screen.getByLabelText("ユーザー名");

// 避ける: 実装詳細に依存
container.querySelector(".btn-primary");
```

### ユーザーインタラクションのテスト

```typescript
import { fireEvent } from "@testing-library/react";

it("クリックイベントが正しく処理される", () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  fireEvent.click(screen.getByRole("button"));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### 非同期処理のテスト

```typescript
import { waitFor } from "@testing-library/react";

it("非同期データが表示される", async () => {
  render(<AsyncComponent />);
  
  await waitFor(() => {
    expect(screen.getByText("データ")).toBeInTheDocument();
  });
});
```

## モックの使用

### 外部モジュールのモック

```typescript
vi.mock("@/components/use-install-prompt", () => ({
  useInstallPrompt: () => mockUseInstallPrompt(),
}));
```

### モックの初期化とリセット

```typescript
beforeEach(() => {
  mockFunction.mockClear();
  mockFunction.mockReturnValue(defaultValue);
});
```

## コンポーネント特有のパターン

### 条件付きレンダリング

```typescript
it("条件に応じて要素が表示/非表示になる", () => {
  const { rerender } = render(<Component show={false} />);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  
  rerender(<Component show={true} />);
  expect(screen.getByRole("dialog")).toBeInTheDocument();
});
```

### スタイルとクラスのテスト

```typescript
it("正しいスタイルが適用される", () => {
  render(<Component variant="primary" />);
  const element = screen.getByRole("button");
  
  // クラス名のテスト
  expect(element).toHaveClass("btn-primary");
  
  // インラインスタイルのテスト
  expect(element).toHaveStyle({ width: "100px" });
});
```

### カスタム属性のテスト

```typescript
it("データ属性が正しく設定される", () => {
  render(<Key pitch="C4" highlighted={true} />);
  const key = screen.getByRole("button");
  
  expect(key).toHaveAttribute("data-pitch", "C4");
  expect(key).toHaveAttribute("aria-pressed", "true");
});
```

## ベストプラクティス

### 1. 依存性注入による外部依存の分離

外部依存（API、ファイルシステム、ブラウザAPIなど）を注入可能な設計にすることで、テスタビリティを向上させる。

```typescript
// 悪い例: 直接依存
class AudioPlayer {
  play() {
    // 直接Tone.jsを使用
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease("C4", "8n");
  }
}

// 良い例: 依存性注入
interface AudioEngine {
  playNote(pitch: string, duration: number): void;
}

class AudioPlayer {
  constructor(private engine: AudioEngine) {}
  
  play(pitch: string, duration: number) {
    this.engine.playNote(pitch, duration);
  }
}

// テストでは簡単にモック化
const mockEngine: AudioEngine = {
  playNote: vi.fn(),
};
const player = new AudioPlayer(mockEngine);
```

#### Reactコンポーネントでの依存性注入

```typescript
// コンポーネントでの依存性注入
interface Props {
  audioEngine?: AudioEngine;
}

export function Piano({ audioEngine = defaultAudioEngine }: Props) {
  // audioEngineを使用
}

// テストでモックを注入
it("音符が再生される", () => {
  const mockEngine = { playNote: vi.fn() };
  render(<Piano audioEngine={mockEngine} />);
  
  fireEvent.click(screen.getByRole("button", { name: "ド" }));
  expect(mockEngine.playNote).toHaveBeenCalledWith("C4", 1);
});
```

### 2. テストの独立性

- 各テストは他のテストに依存しない
- 共有状態を避ける
- 必要な場合はbeforeEachでリセット

### 3. 実装詳細ではなく振る舞いをテスト

```typescript
// 良い例: ユーザーの視点でテスト
expect(screen.getByText("送信完了")).toBeInTheDocument();

// 悪い例: 内部状態をテスト
expect(component.state.isSubmitted).toBe(true);
```

### 4. 明確なテスト説明

```typescript
// 良い例: 何をテストしているか明確
it("ユーザーがボタンをクリックするとモーダルが開く", () => {});

// 悪い例: 曖昧な説明
it("works correctly", () => {});
```

### 5. AAA パターン

```typescript
it("テストケース", () => {
  // Arrange: セットアップ
  const props = { value: "test" };
  
  // Act: 実行
  render(<Component {...props} />);
  
  // Assert: 検証
  expect(screen.getByText("test")).toBeInTheDocument();
});
```

### 6. エッジケースのテスト

- 空配列/null/undefined の処理
- 境界値のテスト
- エラー状態のテスト

### 7. パフォーマンスを意識したテスト

- 不要な再レンダリングを避ける
- 大量のデータを扱う場合は最小限のデータでテスト
- 複雑なセットアップは共通化

## モーションライブラリのモック

motion/react などのアニメーションライブラリは、テスト環境でモック化：

```typescript
// vitest.setup.ts で設定済み
vi.mock("motion/react", () => ({
  motion: new Proxy({}, {
    get: (_target, prop) => {
      if (typeof prop === "string") {
        return React.forwardRef((props, ref) => {
          const { animate, transition, ...domProps } = props;
          return React.createElement(prop, { ...domProps, ref });
        });
      }
    },
  }),
}));
```

## テストコマンド

```bash
# 全てのテストを実行
pnpm run test

# 特定のファイルのテストを実行
pnpm run test -- src/path/to/file.test.ts

# 特定のテストケースを実行
pnpm run test -- src/path/to/file.test.ts -t "test description"

# ウォッチモードでテスト
pnpm run test:watch
```

## 注意事項

1. **try-catchを使わない**: エラーはテストフレームワークに任せる
2. **コメントを書かない**: テストコード自体が仕様書として機能するように
3. **any型を使わない**: 型安全性を保つ
4. **過度なモックを避ける**: 必要最小限のモックに留める
5. **テストの実行時間**: 個々のテストは高速に実行されるべき