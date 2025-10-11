/// <reference types="vitest" />
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
  test: {
    clearMocks: true,
    css: true,
    environment: 'jsdom',
    exclude: [...configDefaults.exclude],
    globals: true,
    mockReset: true,
    restoreMocks: true,
    setupFiles: ['./vitest.setup.ts'],
  },
});
