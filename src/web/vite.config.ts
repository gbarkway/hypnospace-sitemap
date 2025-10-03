import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
  base: '/',
  plugins: [
    react(),
    // Include node polyfills as we are migrating from Webpack
    nodePolyfills({
      include: ['process'],
      globals: { global: true, process: true},
    })
  ],
  server: {
    port: 3002, // Compat with default settings (will switch to .env reading later)
  },
});

