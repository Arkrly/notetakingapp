import { defineConfig } from 'vitest/config';
import { browserProviders } from '@vitest/browser';

export default defineConfig({
  test: {
    globals: true,
    environment: 'browser',
    browser: {
      provider: 'playwright',
      headless: true,
      channel: 'chromium',
    },
    include: ['src/**/*.spec.ts'],
    reporters: ['verbose'],
  },
});
