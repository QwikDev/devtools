import { execSync } from 'child_process';
import { join } from 'path';
import { cpSync, mkdirSync, rmSync } from 'fs';

const ROOT = process.cwd();
const DEVTOOLS_PATH = join(ROOT, 'packages/ui');
const PLUGIN_PATH = join(ROOT, 'packages/plugin');
const DIST_PATH = join(ROOT, 'dist/ui');

// Clean previous builds
console.log('Cleaning previous builds...');
rmSync('dist', { recursive: true, force: true });

// Ensure dist directory exists
mkdirSync(DIST_PATH, { recursive: true });

// Build devtools ui
console.log('Building devtools...');
execSync('pnpm build', {
  cwd: DEVTOOLS_PATH,
  stdio: 'inherit',
});

// Copy lib and lib-types to dist
console.log('Copying files to dist...');
cpSync(join(DEVTOOLS_PATH, 'lib'), join(DIST_PATH), {
  recursive: true,
});
cpSync(join(DEVTOOLS_PATH, 'lib-types'), join(DIST_PATH, 'lib-types'), {
  recursive: true,
});

// Build plugin
console.log('Building plugin...');
execSync('pnpm build', {
  cwd: PLUGIN_PATH,
  stdio: 'inherit',
});

console.log('Devtools build complete!');
