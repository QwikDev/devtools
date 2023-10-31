import { defineConfig } from 'vite';

export default defineConfig({
  cacheDir: '../../../../node_modules/.vite/apps/browser-extension',
  build: {
    minify: false,
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
