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
  icons: {
    16: './icons/qwik-logo.png',
    48: './icons/qwik-logo.png',
    128: './icons/qwik-logo.png',
  },
  action: {
    default_icon: {
      16: './icons/qwik-logo-disabled.png',
      48: './icons/qwik-logo-disabled.png',
      128: './icons/qwik-logo-disabled.png',
    },
    default_popup: './popups/disabled.html',
  },
  devtools_page: 'devtools.html',

  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: ['shared.js'],
      run_at: 'document_start',
    },
  ],
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
