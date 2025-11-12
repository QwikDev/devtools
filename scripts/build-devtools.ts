import { execSync } from 'child_process';
import { join } from 'path';
import { cpSync, mkdirSync, rmSync } from 'fs';

const ROOT = process.cwd();
const UI_PATH = join(ROOT, 'packages/ui');
const PLUGIN_PATH = join(ROOT, 'packages/plugin');
const DIST_PATH = join(ROOT, 'packages/devtools/dist');
const README_PATH = join(ROOT, 'README.md');
import {debug} from 'debug'
const log = debug('qwik:devtools:build-devtools');

// Clean previous builds
log('Cleaning previous builds...');
rmSync(DIST_PATH, { recursive: true, force: true });

// Ensure dist directory exists
mkdirSync(DIST_PATH, { recursive: true });

// Build plugin
log('Building plugin...');
execSync('pnpm build', {
  cwd: PLUGIN_PATH,
  stdio: 'inherit',
});

// Build devtools ui
log('Building devtools...');
execSync('pnpm build', {
  cwd: UI_PATH,
  stdio: 'inherit',
});

// Copy lib and lib-types to dist
log('Copying files to dist...');
cpSync(join(UI_PATH, 'lib'), join(DIST_PATH, 'ui'), {
  recursive: true,
});
cpSync(join(UI_PATH, 'lib-types'), join(DIST_PATH, 'ui', 'lib-types'), {
  recursive: true,
});

log('Copying plugin files to dist...');
cpSync(join(PLUGIN_PATH, 'dist'), join(DIST_PATH, 'plugin'), {
  recursive: true,
});

// Copy README.md to dist
log('Copying README.md to dist...');
cpSync(README_PATH, join('packages/devtools', 'README.md'));

log('Devtools build complete!');
