import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  clean: true,
  format: ['esm'],
  external: ['vite','vite-plugin-inspect'],
  dts: true,
  shims: true,
  tsconfig: './tsconfig.json',
})