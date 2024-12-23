import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: ['src/index'],
  externals: ['vite'],
  clean: true,
  declaration: 'compatible',
  failOnWarn: false,
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
});
