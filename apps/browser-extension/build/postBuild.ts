import { cpSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const manifestData = {
  manifest_version: 3,
  permissions: ['activeTab', 'tabs', 'scripting'],
  version: '1.0',
  name: 'Qwik DevTools',
  short_name: 'Qwik DevTools',
  description: 'Qwik DevTools',
  icons: {
    19: './icons/qwik-logo-19.png',
  },
  action: {
    default_icon: {
      19: './icons/qwik-logo-disabled-19.png',
    },
    default_popup: './popups/disabled.html',
  },
  devtools_page: 'devtools.html',
  host_permissions: ['http://*/*', 'https://*/*'],
  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: ['content-script.js'],
      run_at: 'document_start',
    },
  ],
  background: {
    service_worker: 'background.js',
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
  'browser-extension'
);

writeFileSync(
  path.join(outputPath, 'manifest.json'),
  JSON.stringify(manifestData, null, 2)
);
cpSync(path.join(__dirname, 'assets'), outputPath, { recursive: true });
