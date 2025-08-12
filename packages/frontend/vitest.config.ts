import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
  test: {
    css: true,
    environment: 'jsdom',
    exclude: [...configDefaults.exclude],
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
});
