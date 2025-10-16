/// <reference types="vitest" />
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
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
  }),
);
