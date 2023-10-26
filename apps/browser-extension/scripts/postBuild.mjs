import { cpSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const manifestData = {
  manifest_version: 3,
  permissions: ['activeTab', 'tabs'],
  version: '1.0',
  name: 'Qwik DevTools',
  short_name: 'Qwik DevTools',
  description: 'Qwik DevTools',
  action: {
    default_icon: 'qwik-logo.png',
    icons: {
      16: 'qwik-logo.png',
      48: 'qwik-logo.png',
      128: 'qwik-logo.png',
    },
  },
  devtools_page: 'devtools.html',
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
  'browser-extension'
);

writeFileSync(
  path.join(outputPath, 'manifest.json'),
  JSON.stringify(manifestData, null, 2)
);
cpSync(path.join(__dirname, 'assets'), outputPath, { recursive: true });
