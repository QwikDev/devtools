import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: ['./src/index.ts'],
  externals: ['vite'],
  declaration: true,
  clean: true,
  failOnWarn: false,
  rollup: {
    output: {
      dir: '../../dist/plugin',
    },
    inlineDependencies: true,
    emitCJS: true,
  },
});