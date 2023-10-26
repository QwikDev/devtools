import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const manifestData = {
  manifest_version: 3,
  permissions: ['activeTab', 'tabs'],
  version: '1.0',
  name: 'qwik-project-name',
  short_name: 'Welcome to Qwik',
  description: 'A Qwik project app.',
  action: {
    default_popup: 'index.html',
  },
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'dist',
  'apps',
  'browser-extension',
  'manifest.json'
);

writeFileSync(outputPath, JSON.stringify(manifestData, null, 2));
