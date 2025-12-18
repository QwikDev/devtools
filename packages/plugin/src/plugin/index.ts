import { type Plugin } from 'vite';
import VueInspector from 'vite-plugin-inspect';
import { devtoolsPlugin } from './devtools';
import qwikComponentProxy from './statistics';

// Re-export individual plugins
export { devtoolsPlugin } from './devtools';

/**
 * Main entry: combines all devtools plugins
 */
export function qwikDevtools(): Plugin[] {
  return [
    devtoolsPlugin(),
    VueInspector(),
    ...qwikComponentProxy(),
    // Add more plugins here as needed
  ];
}
