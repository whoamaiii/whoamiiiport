import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./tests/setup.ts'],
      include: ['tests/**/*.{test,spec}.ts', 'tests/**/*.{test,spec}.tsx'],
      exclude: ['tests/e2e/**'],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify — file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      // Split vendor chunks for better caching. Rollup 5 (Vite 8) only accepts
      // the function form, so each vendor's transitive packages are listed.
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) {
              return 'vendor-react';
            }
            if (/node_modules\/(motion|framer-motion|motion-dom|motion-utils)\//.test(id)) {
              return 'vendor-motion';
            }
            return undefined;
          },
        },
      },
      // Inline small assets (< 8KB) to reduce HTTP requests
      assetsInlineLimit: 8192,
      // Target modern browsers for smaller output
      target: 'es2022',
      // Enable CSS code splitting
      cssCodeSplit: true,
    },
  };
});
