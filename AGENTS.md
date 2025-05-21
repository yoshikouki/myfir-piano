# mifir piano

## Principles

- READ `./docs` folder for project requirements and guidelines
- Use immutable data structures
- Separate side effects
- 依存方向は、依存逆転原則(Dependency Inversion Principle) に従う
- Ensure type safety
- 開発した機能ごとに git commit すること
- `try-catch` は使用を禁止する。NEVER USE `try-catch`
- コメントを書かない。コメントがなくとも意図が分かる命名や設計が一流。NEVER WRITE `// comments`

### Test-Driven Development (TDD)

- Red-Green-Refactor cycle
- Treat tests as specifications
- Iterate in small units
- Continuous refactoring

## Build & Development Commands
```bash
pnpm run dev          # Start dev server (PORT=8888, Turbopack)
pnpm run build        # Build production version
pnpm run start        # Start production server
```

## Test Commands
```bash
pnpm run test         # Run all tests
pnpm run test -- src/path/to/file.test.ts  # Run single test file
pnpm run test -- src/path/to/file.test.ts -t "test description"  # Run specific test
```

## Lint & Format Commands
```bash
pnpm run format:unsafe  # Format
pnpm run typecheck     # Typecheck
```

## Project Structure
- **Architecture**: "Package by Feature" architecture
- **App Router** (`src/app/`): Next.js pages, layouts, and routing
- **Features** (`src/features/`): Business logic organized by feature
- **Components** (`src/components/`): Shared UI components
- **Libraries** (`src/lib/`): Shared utilities and configurations

## Package by Feature Guidelines
- Feature directories in `src/features/` should be self-contained
- Feature-specific components in `features/[feature]/components/`
- Shared components in `src/components/`
- Business logic should be separate from UI components
- Avoid cross-feature dependencies

## File Naming & Organization
- **File Naming**: kebab-case for all files (e.g., `login-button.tsx`)
- **React Components**: component file, test file, component-specific utilities
- **Path Aliases**: `@/*` maps to `src/*`
- **Imports**: Group by 1) external deps, 2) shared modules, 3) feature imports

## Code Style
- **Formatting**: 2 spaces, 96 char line width, double quotes
- **TypeScript**: Strict typing, explicit return types
- **Functions**: JSDoc comments for public functions
- **Naming**: camelCase for variables/functions, descriptive names
- **Tests**: Use describe/it blocks, test edge cases
- **Error Handling**: Early returns, explicit error messages
- **Imports**: Organized by Biome, named exports preferred, direct imports only
- **Barrel Files**: NEVER use index.ts for re-exporting - import directly from source files
- **Dead Code**: Promptly remove unused functions, files, and tests

## Testing & Verification
- Tests should be co-located with the code they test
- Always verify code changes at http://localhost:8888 using Playwright MCP browser
- Use Claude's MCP browser feature to interact with the application visually
- Manual testing can be skipped if automated tests exist
- Run tests with `pnpm run test`
