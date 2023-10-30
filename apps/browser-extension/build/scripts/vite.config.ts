import { defineConfig } from 'vite';

export default defineConfig({
  cacheDir: '../../../../node_modules/.vite/apps/browser-extension',
  build: {
    outDir: '../../../../dist/apps/browser-extension',
    rollupOptions: {
      input: {
        background: 'background.ts',
        'content-script': 'content-script.ts',
        devtools: 'devtools.ts',
      },
      output: { entryFileNames: `[name].js` },
    },
  },
});
