import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: ['src/index'],
  externals: ['vite', 'path', 'fs'],
  clean: true,
  declaration: 'compatible',
  failOnWarn: false,
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
});
