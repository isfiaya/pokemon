# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

## Assessment TODOs (Pending Source PDF Content)

The assessment PDF (`ReactJs_-_Task_1.pdf`) is currently outside the workspace so its text can't be parsed automatically. Once you provide (a) the raw text, (b) a pasted summary, or (c) move the PDF into the repo (e.g. `docs/assessment.pdf`), these placeholders will be replaced with concrete features and detailed requirements.

### How this section will be structured

1. High-level Features: major functional areas / user goals.
2. Detailed Requirements: acceptance criteria grouped under each feature (functional + non-functional + UX).
3. Status Checklists: progress tracking using GitHub-style checkboxes.

### Features (placeholders)

- [ ] Feature 1: <provide title>
- [ ] Feature 2: <provide title>
- [ ] Feature 3: <provide title>
- [ ] Feature 4: <provide title>

### Detailed Requirements (populate after assessment text is available)

For each feature, we'll enumerate granular requirements. Example pattern shown below; replace after content is supplied.

#### Feature 1: <title>

- [ ] R1.1 <short requirement statement>
- [ ] R1.2 <short requirement statement>

#### Feature 2: <title>

- [ ] R2.1 <short requirement statement>
- [ ] R2.2 <short requirement statement>

#### Non-Functional / Cross-Cutting

- [ ] Performance: <e.g. list, pagination, caching, etc.>
- [ ] Accessibility: <WCAG / keyboard focus / ARIA labels>
- [ ] Error Handling: <user-friendly messaging>
- [ ] Testing: <unit / integration coverage targets>

### Next Step

Please paste the textual content or move the PDF into the repository so I can convert it into a fully specified, categorized TODO list.
