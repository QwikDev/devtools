import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig([
  {
    outDir: 'lib',
    entries: ['src/plugin/index'],
    externals: ['vite', 'path', 'fs'],
    clean: true,
    failOnWarn: false,
    declaration: 'compatible',
    rollup: {
      emitCJS: true,
    },
  },
]);
