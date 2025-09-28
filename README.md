<div align="center">
	<h1>Pokemon Explorer (React + TypeScript + Vite)</h1>
	<p>A performant, test-covered demo application showcasing clean architecture, RTK Query data fetching, infinite scrolling, and component-driven development using the public <a href="https://pokeapi.co/">PokeAPI</a>.</p>
	<img src="public/vite.svg" alt="Vite" width="60" />
</div>

---

## 1. Overview

Pokemon Explorer lets users browse Pokémon with an infinite scrolling list and view detailed stats for each Pokémon. It demonstrates:

- Modern React (v19) with TypeScript
- State & data management using Redux Toolkit + RTK Query
- Clean separation of concerns (constants, utils, services, hooks, components)
- Performance-minded infinite scroll pattern (manual load more for accessibility & control)
- Friendly UX (loading states, retry handling, graceful empty states, detail view styling)
- Unit & component testing with Vitest + Testing Library
- Consistent code style via ESLint + Prettier

## 2. Tech Stack

| Layer        | Tools                                                |
| ------------ | ---------------------------------------------------- |
| Framework    | React 19 + TypeScript                                |
| Build / Dev  | Vite 7                                               |
| State / Data | Redux Toolkit, RTK Query                             |
| Routing      | React Router v7                                      |
| Testing      | Vitest, @testing-library/react, jsdom                |
| Styling      | Plain CSS modules by folder (scoped via file naming) |
| Quality      | ESLint (flat config), Prettier                       |

## 3. Key Features

- Infinite scrolling (explicit "Load More" button) with duplication guard
- Caching & revalidation tuned with sensible TTLs to avoid over-fetching
- Responsive layout and accessible semantics
- Pokemon detail view with type colors & stat color thresholds
- Error boundaries + retryable error message component
- Lightweight abstraction for API config + environment overrides

## 4. Project Structure

```
src/
	components/         # UI building blocks (feature + shared)
		pokemon/
			PokemonList/    # List, card, styles & tests
			PokemonDetail/  # Detail view & tests
		shared/           # Reusable primitives (ErrorBoundary, Spinner, Layout, etc.)
	constants/          # App-wide constants (api base, cache times, colors)
	hooks/              # Custom React hooks (e.g., infinite scroll logic)
	routes/             # AppRouter & route definitions
	services/           # RTK Query API slice(s)
	store/              # Redux store configuration
	test/               # Test utilities, mocks, setup
	types/              # TypeScript domain types
	utils/              # Pure utility/helper functions
main.tsx              # App bootstrap
App.tsx               # Top-level composition
```

## 5. Data Flow & Architecture

1. User loads list view → `PokemonList` invokes `useInfiniteScrollPokemon()`
2. Hook uses RTK Query endpoint `getPokemonList` with pagination (offset + limit)
3. Response transformed to include `id` extracted from API URL
4. Accumulated list stored locally in hook state to avoid redundant global state
5. Clicking a Pokémon navigates to detail route → `getPokemonById` query
6. RTK Query caching strategies reduce network chatter (custom TTLs in `CACHE_TIMES`)

### Caching Strategy

| Cache Aspect          | Setting | Reason                          |
| --------------------- | ------- | ------------------------------- |
| List data             | 15 min  | Rarely changes; efficient reuse |
| Detail data           | 30 min  | Highly static stats             |
| Unused data retention | 5 min   | Memory friendliness             |
| Refetch threshold     | 60s     | Freshness when user re-enters   |

## 6. State Management

Only server cache + derived UI state are stored. No overuse of global Redux slices. RTK Query slice (`pokemonApi`) handles:

- Network status flags (isLoading, isError)
- Response caching / dedupe
- Automatic re-fetch based on staleness thresholds

Local UI state (like accumulated paginated list) resides inside hooks/components for clarity and isolation.

## 7. Custom Hooks

### `useInfiniteScrollPokemon`

Encapsulates pagination logic, accumulation, and loading state differentiation.

Returns:

```
{
	pokemonList: PokemonListDisplayItem[]
	isLoading: boolean        // initial load
	isLoadingMore: boolean    // subsequent page load
	isError: boolean
	hasMore: boolean
	loadMore: () => void
	refetch: () => void       // resets pagination
	totalLoaded: number
}
```

## 8. Components (Selected)

| Component        | Purpose                                |
| ---------------- | -------------------------------------- |
| `PokemonList`    | Paginated grid + load more UX          |
| `PokemonCard`    | Visual summary card with sprite & name |
| `PokemonDetail`  | Detailed stats, types, colors          |
| `LazyImage`      | Optimized image loading experience     |
| `LoadingSpinner` | Accessible loading indicator           |
| `ErrorMessage`   | Reusable error display with retry      |
| `ErrorBoundary`  | Catches unexpected render errors       |
| `Layout`         | Provides consistent page skeleton      |

## 9. Type System

Domain types live in `src/types/` and are re-exported via index barrels for clean imports. Transform steps ensure outward-facing types are minimal (e.g. adding explicit `id`).

## 10. Environment Configuration

Environment variables (Vite-convention):

| Variable        | Example                     | Purpose               |
| --------------- | --------------------------- | --------------------- |
| `VITE_API_BASE` | `https://pokeapi.co/api/v2` | Override API base URL |

Create a `.env.local` to override defaults locally (not committed).

## 11. Scripts

| Script                     | Description                         |
| -------------------------- | ----------------------------------- |
| `pnpm dev` / `npm run dev` | Start dev server with hot reloading |
| `pnpm build`               | Type-check + production build       |
| `pnpm preview`             | Preview built app                   |
| `pnpm test`                | Run test suite (Vitest)             |
| `pnpm test:ui`             | Launch Vitest UI mode               |
| `pnpm test:coverage`       | Generate coverage report            |
| `pnpm lint`                | Run ESLint                          |
| `pnpm lint:fix`            | Auto-fix lint issues                |
| `pnpm format`              | Format all files with Prettier      |
| `pnpm format:check`        | Check formatting                    |

Adjust `pnpm` to `npm` or `yarn` depending on your tooling

## 12. Getting Started

### Prerequisites

- Node.js 20.19+ (recommended LTS)
- Package manager: pnpm / npm / yarn

### Installation

```bash
pnpm install
# or: npm install
```

### Run Dev Server

```bash
pnpm dev
```

Visit: http://localhost:5173 (default Vite port)

### Build & Preview

```bash
pnpm build
pnpm preview
```

## 13. Testing

Libraries: Vitest + Testing Library + jsdom.

Test files are colocated: `*.test.tsx` / `*.test.ts`.

Run:

```bash
pnpm test
```

Coverage:

```bash
pnpm test:coverage
```

Vitest UI:

```bash
pnpm test:ui
```

### Test Utilities

`src/test/` includes:

- `mockData.ts`: Sample Pokémon payloads
- `setup.ts`: Global test setup (jest-dom matchers, etc.)
- `testUtils.ts`: Custom render helpers

## 14. Linting & Formatting

- ESLint (flat config) with React, hooks, Prettier integration
- Formatting enforced via Prettier config `.prettierrc.json`

Check:

```bash
pnpm lint
pnpm format:check
```

Auto-fix & format:

```bash
pnpm lint:fix
pnpm format
```

## 15. Performance Considerations

- Manual load-more approach avoids scroll listener overhead
- Duplicate guard in hook prevents repeated IDs
- RTK Query TTL reduces API churn
- Stateless functional components & derived rendering

## 16. Error Handling Strategy

| Mechanism       | Purpose                     |
| --------------- | --------------------------- |
| `ErrorBoundary` | Catches render-time crashes |
| `ErrorMessage`  | User-facing retry flow      |
