import { writeFile } from 'fs';

const manifestData = {
  name: 'QR Code Generator',
  version: '1.0',
  description: 'A generic QR code generator based on Qwik',
  permissions: ['activeTab', 'tabs'],
  browser_action: {
    default_popup: '.',
  },

  manifest_version: 3,
};

const outputPath = 'dist/packages/qwik-demo-app/client/manifest.json';

writeFile(outputPath, JSON.stringify(manifestData, null, 2), (err) => {
  if (err) {
    console.error('Error writing manifest.json:', err);
  } else {
    console.log('manifest.json has been created successfully!');
  }
});