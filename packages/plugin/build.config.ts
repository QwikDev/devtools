import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: ['./src/index.ts'],
  externals: ['vite','vite-plugin-inspect'],
  declaration: true,
  clean: true,
  failOnWarn: false,
  rollup: {
    inlineDependencies: true,
    emitCJS: true,
  },
});
