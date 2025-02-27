import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['apps/pwa/src/**/*.test.ts'],
    environment: 'node'
  }
});