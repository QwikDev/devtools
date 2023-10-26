import { qwikVite } from '@builder.io/qwik/optimizer';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/apps/browser-extension',
  build: {
    outDir: '../../dist/apps/browser-extension',
    emptyOutDir: true,
  },
  plugins: [
    qwikVite({
      csr: true,
    }),
    tsconfigPaths({ root: '../../' }),
  ],
});
