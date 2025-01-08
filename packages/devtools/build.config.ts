import { defineBuildConfig } from 'unbuild';

<<<<<<< HEAD
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
=======
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
>>>>>>> main
