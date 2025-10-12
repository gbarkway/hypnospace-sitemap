import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
  base: '/',
  optimizeDeps: { 
    include: ['cytoscape', 'cytoscape-fcose'], 
  },
  plugins: [
    react(),
  ],
  server: {
    port: 3002, // Compat with default settings (will switch to .env reading later)
  },
});

