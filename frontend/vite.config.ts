import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      'react/jsx-runtime': '/src/stubs/react-jsx-runtime.ts',
    },
  },
  optimizeDeps: {
    exclude: ['framer-motion'],
  },
  test: {
    globals: true,
    browser: {
      enabled: true,
      provider: 'playwright',
      headless: true,
    },
  },
});