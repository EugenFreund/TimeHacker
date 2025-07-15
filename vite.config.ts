import { defineConfig } from 'vite';

export default defineConfig({
  // Base configuration
  root: '.',
  publicDir: 'public',

  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },

  // Development server
  server: {
    port: 3000,
    open: true,
    host: true,
  },

  // Preview server
  preview: {
    port: 4173,
    open: true,
  },
});
