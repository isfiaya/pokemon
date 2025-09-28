/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
        'src/**/index.ts',
        'src/**/index.tsx',
        'src/types/**',
        'src/main.tsx',
        'src/App.tsx',
        'src/store',
        'src/routes',
        'src/services',
        'src/components/shared/ErrorBoundary/ErrorBoundary.tsx',
        'src/components/shared/Layout/Layout.tsx',
      ],
      thresholds: {
        global: {
          branches: 60,
          functions: 60,
          lines: 60,
          statements: 60,
        },
      },
    },
  },
});
