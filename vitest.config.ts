import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ['**/tests/**/*.test.ts'],
    environment: 'node',
    typecheck: {
      tsconfig: new URL('./tsconfig.test.json', import.meta.url).pathname,
    },
  },
  resolve: {
    alias: {
      core: new URL('./libs/core', import.meta.url).pathname,
      formatting: resolve(__dirname, './libs/formatting'),
    },
  },
});
