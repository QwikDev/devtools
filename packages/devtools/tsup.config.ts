import { defineConfig } from 'tsup';

export default defineConfig({
  entryPoints: ['src/index.ts'],
  target: 'es2020',
  clean: true,
  format: ['esm', 'cjs'],
  external: ['vite', 'path', 'fs'],
  outExtension({ format }) {
    if (format === 'esm') {
      return {
        js: '.mjs',
        dts: '.d.ts',
      };
    } else if (format === 'cjs') {
      return {
        js: '.cjs',
        dts: '.d.cts',
      };
    }
    return {
      js: '.js',
      dts: '.d.ts',
    };
  },
  dts: true,
  shims: true,
});
