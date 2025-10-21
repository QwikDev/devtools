import { ResolvedConfig, type Plugin } from 'vite';
import { getServerFunctions } from './rpc';
import { createServerRpc, setViteServerContext, VIRTUAL_QWIK_DEVTOOLS_KEY, INNER_USE_HOOK } from '@devtools/kit';
import VueInspector from 'vite-plugin-inspect'
import useCollectHooksSource from './utils/useCollectHooks'
import { parseQwikCode } from './parse/parse';
import { startPreloading } from './npm/index';


export function qwikDevtools(): Plugin[] {
  let _config: ResolvedConfig;
  const qwikData = new Map<string, any>();
  let preloadStarted = false;
  const qwikDevtoolsPlugin: Plugin = {
    name: 'vite-plugin-qwik-devtools',
    apply: 'serve',
    resolveId(id) {
      // Normalize to a stable, absolute-like id so Qwik can generate runtime chunks
      const clean = id.split('?')[0].split('#')[0];
      if (
        clean === VIRTUAL_QWIK_DEVTOOLS_KEY ||
        clean === `/${VIRTUAL_QWIK_DEVTOOLS_KEY}` ||
        clean === `\u0000${VIRTUAL_QWIK_DEVTOOLS_KEY}` ||
        clean === `/@id/${VIRTUAL_QWIK_DEVTOOLS_KEY}`
      ) {
        return `/${VIRTUAL_QWIK_DEVTOOLS_KEY}`;
      }
    },
    load(id) {
      if (
        id === `/${VIRTUAL_QWIK_DEVTOOLS_KEY}` ||
        id === VIRTUAL_QWIK_DEVTOOLS_KEY ||
        id === `\u0000${VIRTUAL_QWIK_DEVTOOLS_KEY}` ||
        id === `/@id/${VIRTUAL_QWIK_DEVTOOLS_KEY}`
      ) {
        return {
          code: useCollectHooksSource,
          map: { mappings: '' },
        };
      }
    },
    configResolved(viteConfig) {
      _config = viteConfig;
      
      // Start preloading as early as possible, right after config is resolved
      if (!preloadStarted) {
        preloadStarted = true;
        startPreloading({ config: _config }).catch((err) => {
          console.error('[Qwik DevTools] Failed to start preloading:', err);
        });
      }
    }, 
    transform: {
      order: 'pre',
      handler(code, id) {
        const mode = process.env.MODE;
        // Ensure virtual import is present at the very top once when a component$ is present
        if (id.endsWith('.tsx') && code.includes('component$')) {
          if (!code.includes(VIRTUAL_QWIK_DEVTOOLS_KEY)) {
           
            const importLine = `import { ${INNER_USE_HOOK} } from '${VIRTUAL_QWIK_DEVTOOLS_KEY}';\n`
            code = importLine + code
          }else {
            console.log('importing virtual qwik devtools', VIRTUAL_QWIK_DEVTOOLS_KEY, code);
          }
          code = parseQwikCode(code, {path: id})
        }
        // Only transform the root component file
        if (id.endsWith('root.tsx')) {
          const importPath =
            mode === 'dev' ? '@devtools/ui' : '@qwik.dev/devtools/ui';
          // Check if QwikDevtools import already exists
          if (!code.includes(importPath)) {
            // Add import for QwikDevtools using the correct package name
            code = `import { QwikDevtools } from '${importPath}';\n${code}`;
          }

          // Find the closing body tag and append QwikDevtools at the end of body
          const match = code.match(/<body[^>]*>([\s\S]*?)<\/body>/);
          if (match) {
            const bodyContent = match[1];
            const newBodyContent = `${bodyContent}\n        <QwikDevtools />`;
            code = code.replace(bodyContent, newBodyContent);
          }

          return {
            code,
            map: null,
          };
        }

       return {
          code,
          map: { mappings: '' },
        };
      },
    },
    configureServer(server) {
      setViteServerContext(server as any);

      const rpcFunctions = getServerFunctions({ server, config: _config, qwikData });

      createServerRpc(rpcFunctions);
      
      // Preloading should have already started in configResolved
    },
  }
  return [
    qwikDevtoolsPlugin,
    VueInspector(), // Add the VueInspector plugin instance
  ];
}
