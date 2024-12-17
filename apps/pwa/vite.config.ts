import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    host: true,
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, './src'),
      '#': resolve(__dirname, '../../'),
    },
  },
});
