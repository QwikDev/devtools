import { execSync } from 'child_process';
import { join } from 'path';
import { cpSync, mkdirSync, rmSync } from 'fs';

const ROOT = process.cwd();
const UI_PATH = join(ROOT, 'packages/ui');
const PLUGIN_PATH = join(ROOT, 'packages/plugin');
const DIST_PATH = join(ROOT, 'packages/devtools/dist');
const README_PATH = join(ROOT, 'README.md');

// Clean previous builds
console.log('Cleaning previous builds...');
rmSync(DIST_PATH, { recursive: true, force: true });

// Ensure dist directory exists
mkdirSync(DIST_PATH, { recursive: true });

// Build devtools ui
console.log('Building devtools...');
execSync('pnpm build', {
  cwd: UI_PATH,
  stdio: 'inherit',
});

// Copy lib and lib-types to dist
console.log('Copying files to dist...');
cpSync(join(UI_PATH, 'lib'), join(DIST_PATH, 'ui'), {
  recursive: true,
});
cpSync(join(UI_PATH, 'lib-types'), join(DIST_PATH, 'ui', 'lib-types'), {
  recursive: true,
});

// Build plugin
console.log('Building plugin...');
execSync('pnpm build', {
  cwd: PLUGIN_PATH,
  stdio: 'inherit',
});

console.log('Copying plugin files to dist...');
cpSync(join(PLUGIN_PATH, 'dist'), join(DIST_PATH, 'plugin'), {
  recursive: true,
});

// Copy README.md to dist
console.log('Copying README.md to dist...');
cpSync(README_PATH, join('packages/devtools', 'README.md'));

console.log('Devtools build complete!');
