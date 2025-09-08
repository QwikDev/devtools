import { ResolvedConfig, type Plugin } from 'vite';
import { getServerFunctions } from './rpc';
import { createServerRpc, setViteServerContext, VIRTUAL_QWIK_DEVTOOLS_KEY, INNER_USE_HOOK } from '@devtools/kit';
import _traverse from '@babel/traverse';
import _generate from '@babel/generator';
import VueInspector from 'vite-plugin-inspect'
import useCollectHooksSource from './utils/useCollectHooks'
import { parseQwikCode } from './parse/parse';


export function qwikDevtools(): Plugin[] {
  let _config: ResolvedConfig;
  const qwikData = new Map<string, any>();
  const qwikDevtoolsPlugin: Plugin = {
    name: 'vite-plugin-qwik-devtools',
    apply: 'serve',
    resolveId(id) {
      if (id === VIRTUAL_QWIK_DEVTOOLS_KEY) {
        return id;
      }
    },
    load(id) {
      if (id === VIRTUAL_QWIK_DEVTOOLS_KEY) {
        return useCollectHooksSource;
      }
    },
    configResolved(viteConfig) {
      _config = viteConfig;
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

          // Find the closing body tag and inject the QwikDevtools component before it
          const match = code.match(/<body[^>]*>([\s\S]*?)<\/body>/);
          if (match) {
            const bodyContent = match[1];
            const newBodyContent = bodyContent.replace(
              /{!isDev && <ServiceWorkerRegister \/>}/,
              `{!isDev && <ServiceWorkerRegister />}\n        {isDev && <QwikDevtools />}`,
            );
            code = code.replace(bodyContent, newBodyContent);
          }

          return {
            code,
            map: null,
          };
        }

       return {
          code,
          map: null,
        };
      },
    },
    configureServer(server) {
      setViteServerContext(server as any);

      const rpcFunctions = getServerFunctions({ server, config: _config, qwikData });

      createServerRpc(rpcFunctions);
    },
  }
  return [
    qwikDevtoolsPlugin,
    VueInspector(), // Add the VueInspector plugin instance
  ];
}
