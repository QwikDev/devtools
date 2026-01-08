import { type Plugin } from 'vite';
import VueInspector from 'vite-plugin-inspect';
import { devtoolsPlugin } from './devtools';
import { statisticsPlugin } from './statistics';

// Re-export individual plugins
export { devtoolsPlugin } from './devtools';

/**
 * Main entry: combines all devtools plugins
 */
export function qwikDevtools(): Plugin[] {
  return [
    devtoolsPlugin(),
    { ...VueInspector(), apply: 'serve' },
    statisticsPlugin(),
    // Add more plugins here as needed
  ];
}
