# Testing Best Practices for myfir-piano

## 概要

myfir-pianoプロジェクトにおけるテスト実装の標準ガイドです。このガイドラインに従うことで、保守性が高く信頼性のあるテストコードを作成できます。

## 基本方針

- **TDD (Test-Driven Development)**: Red-Green-Refactorサイクルを厳守し、テストが仕様書となる開発
- **境界の明確化**: 外部依存との境界を明確にし、依存性逆転の原則に従った設計
- **依存性注入**: 外部依存を注入可能な設計でテスタビリティを確保
- **ユーザー視点**: 実装詳細ではなくユーザーの体験をテスト
- **アクセシビリティ**: アクセシビリティ属性を活用したクエリを優先
- **型安全性**: any型を使わず、厳密な型付けでテストの品質を担保

## 技術スタック

| 要素 | ツール | 用途 |
|------|--------|------|
| テストランナー | Vitest | 高速なテスト実行とHMR |
| DOM テスティング | @testing-library/react | ユーザー視点のコンポーネントテスト |
| アサーション | @testing-library/jest-dom | DOM要素の直感的なアサーション |
| モック | Vitest vi | 依存関係のモック化 |

## ファイル構成規則

```
src/
├── features/
│   ├── keyboard/
│   │   ├── components/
│   │   │   ├── key.tsx
│   │   │   ├── key.test.tsx          # コンポーネントテスト
│   │   │   ├── keyboard.tsx
│   │   │   └── keyboard.test.tsx
│   │   └── pitches.ts
│   └── player/
│       ├── play-controller.ts
│       └── play-controller.test.ts   # ロジックテスト
```

**命名規則:**
- Reactコンポーネント: `*.test.tsx`
- TypeScriptモジュール: `*.test.ts`
- テストファイルは実装ファイルと同じディレクトリに配置

## テスト構造の標準パターン

### 1. 基本構造: describe/it

```typescript
describe("ComponentName", () => {
  it("期待される動作を日本語で記述", () => {
    // Given: テストデータとモックの準備
    const mockProps = { value: "test" };
    
    // When: テスト対象の実行
    render(<ComponentName {...mockProps} />);
    
    // Then: 期待結果の検証
    expect(screen.getByText("test")).toBeInTheDocument();
  });
});
```

### 2. セットアップ/クリーンアップ

```typescript
describe("UserMenu", () => {
  const mockUseInstallPrompt = vi.fn();
  
  beforeEach(() => {
    // 各テスト前の共通セットアップ
    mockUseInstallPrompt.mockReturnValue({
      isInstallable: false,
      handleInstallClick: vi.fn(),
    });
  });

  afterEach(() => {
    // モックのクリア（必要に応じて）
    vi.clearAllMocks();
  });
});
```

### 3. テスト説明の書き方

**✅ 良い例:**
```typescript
it("ユーザーがボタンをクリックするとモーダルが開く", () => {});
it("不正な音程が入力されたときエラーメッセージを表示", () => {});
it("音符の長さに応じてノート幅が調整される", () => {});
```

**❌ 避けるべき例:**
```typescript
it("works correctly", () => {});
it("test button", () => {});
it("should work", () => {});
```

## Reactコンポーネントテストのガイドライン

### 要素検索の優先順位

Testing Libraryのクエリ優先順位に従い、ユーザーがどのように要素を認識するかを基準にします：

| 優先度 | クエリ | 使用場面 | 例 |
|--------|--------|----------|-----|
| 🟢 **高** | `getByRole` | ARIA role属性のある要素 | `screen.getByRole("button", { name: "送信" })` |
| 🟢 **高** | `getByLabelText` | フォーム要素とラベル | `screen.getByLabelText("ユーザー名")` |
| 🟡 **中** | `getByText` | 表示テキストが明確 | `screen.getByText("ログイン")` |
| 🟡 **中** | `getByDisplayValue` | フォームの現在値 | `screen.getByDisplayValue("初期値")` |
| 🔴 **低** | `getByTestId` | 他の手段がない場合のみ | `screen.getByTestId("complex-component")` |

**❌ 避けるべきクエリ:**
```typescript
// CSSセレクターによる検索は実装詳細に依存
container.querySelector(".btn-primary");
container.getElementsByClassName("menu-item");
```

### 実用的なクエリ例

```typescript
// ✅ ピアノキーのテスト
it("Cキーが正しく表示される", () => {
  render(<Key pitch="C4" />);
  const key = screen.getByRole("button");
  expect(key).toHaveAttribute("data-pitch", "C4");
});

// ✅ メニューの開閉テスト
it("メニューボタンクリックでメニューが開く", () => {
  render(<UserMenu />);
  fireEvent.click(screen.getByLabelText("ユーザーメニュー"));
  expect(screen.getByRole("menu")).toBeInTheDocument();
});
```

### インタラクションとイベント処理

```typescript
import { fireEvent } from "@testing-library/react";

// ✅ クリックイベントのテスト
it("ピアノキーを押すと正しい音程で再生される", () => {
  const handlePress = vi.fn();
  render(<Key pitch="C4" onPress={handlePress} />);
  
  const key = screen.getByRole("button");
  fireEvent.pointerDown(key);
  
  expect(handlePress).toHaveBeenCalledTimes(1);
  expect(handlePress).toHaveBeenCalledWith("C4");
});

// ✅ フォーカス状態のテスト
it("キーボード操作でフォーカスが移動する", () => {
  render(<Keyboard />);
  const firstKey = screen.getAllByRole("button")[0];
  
  firstKey.focus();
  expect(firstKey).toHaveFocus();
});
```

### 非同期処理とタイミング

```typescript
import { waitFor } from "@testing-library/react";

// ✅ 非同期状態変更のテスト
it("メニュー外クリックで非同期にメニューが閉じる", async () => {
  render(<UserMenu />);
  
  // メニューを開く
  fireEvent.click(screen.getByLabelText("ユーザーメニュー"));
  expect(screen.getByRole("menu")).toBeInTheDocument();
  
  // 外部をクリック
  fireEvent.mouseDown(document.body);
  
  // 非同期でメニューが閉じることを確認
  await waitFor(() => {
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
```

## モック戦略とパターン

### モックの種類と使い分け

| モックタイプ | 用途 | 実装方法 |
|-------------|------|----------|
| **ファンクションモック** | 関数呼び出しの検証 | `vi.fn()` |
| **モジュールモック** | 外部ライブラリの置き換え | `vi.mock()` |
| **パーシャルモック** | 一部機能のみモック | `vi.mocked()` |

### 実装パターン

```typescript
// ✅ Hooksのモック
const mockUseInstallPrompt = vi.fn();
vi.mock("@/components/use-install-prompt", () => ({
  useInstallPrompt: () => mockUseInstallPrompt(),
}));

describe("UserMenu", () => {
  beforeEach(() => {
    // 各テストで一貫した初期状態
    mockUseInstallPrompt.mockReturnValue({
      isInstallable: false,
      handleInstallClick: vi.fn(),
    });
  });
});

// ✅ 依存性注入によるモック
it("オーディオエンジンが正しく呼ばれる", async () => {
  const mockEngine = {
    load: vi.fn().mockResolvedValue(undefined),
    playNoteWithDuration: vi.fn(),
    playNote: vi.fn(),
    stopNote: vi.fn(),
  };
  
  const controller = new PlayController(mockEngine);
  await controller.load(testSong);
  controller.press("C4");
  
  expect(mockEngine.playNoteWithDuration).toHaveBeenCalledWith("C4", 1, 1, 100);
});
```

## 高度なテストパターン

### 条件付きレンダリングとプロップ変更

```typescript
it("インストール可能状態によって表示が切り替わる", () => {
  // 初期状態: インストール不可
  const { rerender } = render(<UserMenu />);
  fireEvent.click(screen.getByLabelText("ユーザーメニュー"));
  expect(screen.queryByText("アプリをインストール")).not.toBeInTheDocument();
  
  // 状態変更: インストール可能
  mockUseInstallPrompt.mockReturnValue({
    isInstallable: true,
    handleInstallClick: vi.fn(),
  });
  
  rerender(<UserMenu />);
  fireEvent.click(screen.getByLabelText("ユーザーメニュー"));
  expect(screen.getByText("アプリをインストール")).toBeInTheDocument();
});
```

### 動的スタイリングとCSS

```typescript
it("音符の長さに応じて幅が動的に調整される", () => {
  const testSong: Song = {
    meta: { title: "Test" },
    notes: [
      { pitch: "C4", duration: 1 },    // 基本幅: 60px
      { pitch: "D4", duration: 2 },    // 2倍幅: 120px
      { pitch: "E4", duration: 0.5 },  // 最小幅: 60px
    ],
  };
  
  const { container } = render(<ScrollScore song={testSong} />);
  const noteContainers = container.querySelectorAll(
    "div.relative.inline-block[style*='width']"
  );
  
  expect(noteContainers[0]).toHaveStyle({ width: "60px" });
  expect(noteContainers[1]).toHaveStyle({ width: "120px" });
  expect(noteContainers[2]).toHaveStyle({ width: "60px" });
});
```

### カスタム属性とARIA

```typescript
it("ハイライト状態がアクセシビリティ属性に反映される", () => {
  const { rerender } = render(<Key pitch="C4" highlighted={false} />);
  const key = screen.getByRole("button");
  
  // 初期状態
  expect(key).toHaveAttribute("data-pitch", "C4");
  expect(key).toHaveAttribute("aria-pressed", "false");
  
  // ハイライト状態
  rerender(<Key pitch="C4" highlighted={true} />);
  expect(key).toHaveAttribute("aria-pressed", "true");
});
```

## TDD実践ガイド

### Red-Green-Refactorサイクル

```typescript
// 1. RED: 失敗するテストを先に書く
it("新しい楽曲を再生できる", () => {
  const controller = new PlayController(mockEngine);
  const song = createTestSong();
  
  // この時点でloadメソッドは存在しない
  expect(() => controller.load(song)).not.toThrow();
  expect(controller.getCurrentSong()).toBe(song);
});

// 2. GREEN: 最小限の実装でテストを通す
class PlayController {
  private currentSong?: Song;
  
  load(song: Song): void {
    this.currentSong = song;
  }
  
  getCurrentSong(): Song | undefined {
    return this.currentSong;
  }
}

// 3. REFACTOR: 設計を改善
class PlayController {
  private currentSong?: Song;
  
  constructor(
    private readonly engine: AudioEngine,
    private readonly validator: SongValidator = defaultValidator
  ) {}
  
  load(song: Song): void {
    this.validator.validate(song);
    this.currentSong = song;
    this.engine.prepare(song);
  }
}
```

### テストファーストの実践例

```typescript
// ❌ 実装先行の問題例
// 実装を書いてからテストを書くと、実装詳細に依存したテストになりがち
class AudioPlayer {
  private cache = new Map();
  play(pitch: string) {
    if (this.cache.has(pitch)) {
      // キャッシュから再生
    }
  }
}

// ✅ テストファーストの良い例
describe("AudioPlayer", () => {
  it("同じ音を連続して再生してもクラッシュしない", () => {
    const player = new AudioPlayer(mockEngine);
    expect(() => {
      player.play("C4");
      player.play("C4");
    }).not.toThrow();
  });
  
  it("異なる音程を同時に再生できる", () => {
    const player = new AudioPlayer(mockEngine);
    player.play("C4");
    player.play("E4");
    expect(mockEngine.playNote).toHaveBeenCalledTimes(2);
  });
});
```

## 設計原則とベストプラクティス

### 1. 境界の明確化と依存性逆転の原則

外部システムとの境界を明確にし、ビジネスロジックが外部依存に左右されない設計を実現します。

```typescript
// ✅ 境界を明確にしたアーキテクチャ

// Domain層: ビジネスロジックの抽象化
interface AudioEngine {
  load(song: Song): Promise<void>;
  playNote(pitch: string, duration: number): void;
  stopNote(pitch: string): void;
}

interface StorageService {
  saveSong(song: Song): Promise<void>;
  loadSong(id: string): Promise<Song>;
}

// Application層: ユースケースの実装
class PlayController {
  constructor(
    private readonly engine: AudioEngine,
    private readonly storage: StorageService
  ) {}
  
  async loadAndPlay(songId: string): Promise<void> {
    const song = await this.storage.loadSong(songId);
    await this.engine.load(song);
    this.playSong(song);
  }
}

// Infrastructure層: 具体的な実装
class ToneJsAudioEngine implements AudioEngine {
  async load(song: Song): Promise<void> {
    // Tone.js固有の実装
  }
}

class LocalStorageService implements StorageService {
  async saveSong(song: Song): Promise<void> {
    // LocalStorage固有の実装
  }
}

// テストでの活用
it("楽曲の読み込みと再生が連携する", async () => {
  const mockEngine = createMockAudioEngine();
  const mockStorage = createMockStorageService();
  mockStorage.loadSong.mockResolvedValue(testSong);
  
  const controller = new PlayController(mockEngine, mockStorage);
  await controller.loadAndPlay("song-1");
  
  expect(mockStorage.loadSong).toHaveBeenCalledWith("song-1");
  expect(mockEngine.load).toHaveBeenCalledWith(testSong);
});
```

### 2. コンポーネントの境界設計

```typescript
// ✅ Reactコンポーネントでの境界設計
interface PianoKeyboardProps {
  // 外部依存はインターフェースで抽象化
  audioEngine?: AudioEngine;
  storageService?: StorageService;
  
  // UIイベントは純粋な関数として外部に公開
  onKeyPress?: (pitch: string) => void;
  onSongLoad?: (song: Song) => void;
}

export function PianoKeyboard({
  audioEngine = defaultAudioEngine,
  storageService = defaultStorageService,
  onKeyPress,
  onSongLoad
}: PianoKeyboardProps) {
  // コンポーネントは外部依存の具体的な実装を知らない
  const handleKeyPress = (pitch: string) => {
    audioEngine.playNote(pitch, 1);
    onKeyPress?.(pitch);
  };
  
  return <Keyboard onPress={handleKeyPress} />;
}

// テストでの境界の活用
it("キー押下時に音が再生される", () => {
  const mockEngine = createMockAudioEngine();
  const handleKeyPress = vi.fn();
  
  render(
    <PianoKeyboard 
      audioEngine={mockEngine}
      onKeyPress={handleKeyPress}
    />
  );
  
  fireEvent.click(screen.getByRole("button", { name: "ド" }));
  
  expect(mockEngine.playNote).toHaveBeenCalledWith("C4", 1);
  expect(handleKeyPress).toHaveBeenCalledWith("C4");
});
```

### 3. 依存性注入によるテスタビリティの向上

外部依存を注入可能にすることで、テストにおける制御性と分離性を確保します。

```typescript
// ❌ 避けるべき: 直接依存
class AudioPlayer {
  play(pitch: string) {
    // Tone.jsに直接依存 = テストが困難
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease(pitch, "8n");
  }
}

// ✅ 推奨: 依存性注入
interface AudioEngine {
  playNote(pitch: string, duration: number): void;
  playNoteWithDuration(pitch: string, duration: number, tempo: number, velocity: number): void;
}

class PlayController {
  constructor(private engine: AudioEngine) {}
  
  press(pitch: string): void {
    this.engine.playNote(pitch, 1);
  }
}

// テストでの活用
it("正しい音程で再生される", () => {
  const mockEngine: AudioEngine = {
    playNote: vi.fn(),
    playNoteWithDuration: vi.fn(),
  };
  
  const controller = new PlayController(mockEngine);
  controller.press("C4");
  
  expect(mockEngine.playNote).toHaveBeenCalledWith("C4", 1);
});
```

**Reactコンポーネントでの適用:**
```typescript
interface PianoProps {
  audioEngine?: AudioEngine;
  onKeyPress?: (pitch: string) => void;
}

export function Piano({ 
  audioEngine = defaultAudioEngine,
  onKeyPress 
}: PianoProps) {
  const handleKeyPress = (pitch: string) => {
    audioEngine.playNote(pitch, 1);
    onKeyPress?.(pitch);
  };
  
  return <Keyboard onPress={handleKeyPress} />;
}
```

### 4. テスト分離の原則

```typescript
describe("PlayController", () => {
  let mockEngine: AudioEngine;
  let controller: PlayController;
  
  beforeEach(() => {
    // 各テストで独立した状態を確保
    mockEngine = {
      load: vi.fn().mockResolvedValue(undefined),
      playNote: vi.fn(),
      playNoteWithDuration: vi.fn(),
      stopNote: vi.fn(),
    };
    controller = new PlayController(mockEngine);
  });
  
  // 各テストは他のテストの状態に影響されない
});
```

### 5. ユーザー中心のテスト思考

```typescript
// ✅ ユーザー視点: 実際の使用体験をテスト
it("ピアノキーをクリックすると音が再生される", () => {
  render(<Piano />);
  fireEvent.click(screen.getByRole("button", { name: "ド" }));
  expect(screen.getByRole("button", { name: "ド" })).toHaveAttribute("aria-pressed", "true");
});

// ❌ 実装詳細: 内部状態への過度な依存
it("stateが正しく更新される", () => {
  // 内部stateの詳細をテストしている
  expect(component.state.isPressed).toBe(true);
});
```

### 6. 段階的なテスト戦略

```typescript
describe("Keyboard コンポーネント", () => {
  // レベル1: 基本的なレンダリング
  it("キーボードが表示される", () => {
    render(<Keyboard />);
    expect(screen.getAllByRole("button").length).toBeGreaterThan(0);
  });
  
  // レベル2: インタラクション
  it("キーをクリックすると反応する", () => {
    const handlePress = vi.fn();
    render(<Keyboard onPress={handlePress} />);
    fireEvent.pointerDown(screen.getAllByRole("button")[0]);
    expect(handlePress).toHaveBeenCalled();
  });
  
  // レベル3: 複雑な状態変化
  it("指定されたキーがハイライトされる", () => {
    render(<Keyboard highlightedPitch="C4" />);
    const c4Key = screen.getByRole("button", { pressed: true });
    expect(c4Key).toHaveAttribute("data-pitch", "C4");
  });
});
```

### 7. エラーハンドリングとエッジケース

```typescript
describe("エッジケースの処理", () => {
  it("空の楽曲データでもクラッシュしない", () => {
    const emptySong: Song = { meta: { title: "" }, notes: [] };
    expect(() => render(<ScrollScore song={emptySong} />)).not.toThrow();
  });
  
  it("不正な音程値を適切に処理する", () => {
    const handlePress = vi.fn();
    render(<Key pitch="INVALID" onPress={handlePress} />);
    // コンポーネントがクラッシュせず、適切にフォールバックすることを確認
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
```

## 環境設定とツール

### アニメーションライブラリのモック設定

```typescript
// vitest.setup.ts - プロジェクト全体で適用
vi.mock("motion/react", () => ({
  motion: new Proxy({}, {
    get: (_target, prop) => {
      if (typeof prop === "string") {
        return React.forwardRef<HTMLElement, MotionProps>((props, ref) => {
          const { animate, transition, layoutId, whileHover, whileTap, initial, exit, ...domProps } = props;
          return React.createElement(prop, { ...domProps, ref });
        });
      }
      return undefined;
    },
  }),
}));
```

## 実行コマンドリファレンス

| コマンド | 用途 | 使用例 |
|----------|------|--------|
| `pnpm run test` | 全テスト実行 | CI/CDや完全チェック |
| `pnpm run test:watch` | ウォッチモード | 開発中の継続的テスト |
| `pnpm run test -- <path>` | 特定ファイル | `pnpm run test -- src/features/keyboard/` |
| `pnpm run test -- -t "<pattern>"` | パターンマッチ | `pnpm run test -- -t "ユーザーメニュー"` |

**開発ワークフロー例:**
```bash
# 機能開発中は特定のテストファイルをウォッチ
pnpm run test:watch -- src/features/keyboard/components/key.test.tsx

# 実装完了後は関連する全テストを実行
pnpm run test -- src/features/keyboard/

# 最終確認で全テストを実行
pnpm run test
```

## プロジェクト固有の制約と規則

### 🚫 禁止事項

| 項目 | 理由 | 代替手段 |
|------|------|----------|
| `try-catch` の使用 | エラーハンドリングはテストフレームワークに委譲 | `expect().toThrow()` |
| `any` 型の使用 | 型安全性の維持 | 適切な型定義またはジェネリクス |
| 過度なモック | テストの信頼性低下 | 境界でのみモックを使用し、内部は実装を使用 |
| 実装詳細のテスト | リファクタリング耐性の低下 | ユーザー体験ベースのテスト |
| テスト後の実装 | TDDの利点を失う | Red-Green-Refactorサイクルの徹底 |

### ✅ 推奨パターン

1. **TDDの徹底**: テストファーストで仕様を明確化
2. **境界の意識**: 外部依存との境界を常に意識した設計
3. **テストは仕様書**: コメント不要で意図が伝わる明確な記述
4. **迅速なフィードバック**: 各テストは1秒以内で完了
5. **独立性**: テスト間で状態を共有しない
6. **段階的検証**: 基本機能 → インタラクション → エッジケース

## パフォーマンス最適化

```typescript
// ✅ 効率的なテストデータ作成
const createTestSong = (noteCount = 3): Song => ({
  meta: { title: "Test Song" },
  notes: Array.from({ length: noteCount }, (_, i) => ({
    pitch: `C${4 + (i % 2)}` as const,
    duration: 1,
  })),
});

// ✅ 共通セットアップの分離
const setupKeyboardTest = (props: Partial<KeyboardProps> = {}) => {
  const defaultProps = { onPress: vi.fn() };
  return render(<Keyboard {...defaultProps} {...props} />);
};

// ✅ 必要最小限のDOM操作
it("キーの数が正しい", () => {
  setupKeyboardTest();
  expect(screen.getAllByRole("button")).toHaveLength(PITCHES.length);
});
```

---

**このガイドラインに従うことで、保守性が高く、将来の変更に強いテストスイートを構築できます。**