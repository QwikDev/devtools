import { ResolvedConfig, type Plugin } from 'vite';
import { getServerFunctions } from './rpc';
import { createServerRpc, setViteServerContext } from '@devtools/kit';

export function qwikDevtools(): Plugin {
  let _config: ResolvedConfig;
  return {
    name: 'vite-plugin-qwik-devtools',
    apply: 'serve',
    configResolved(viteConfig) {
      _config = viteConfig;
    },
    transform: {
      order: 'pre',
      handler(code, id) {
        const isDev = _config.env.DEV;

        // Only transform the root component file
        if (id.endsWith('root.tsx')) {
          // const importPath = '@qwik.dev/devtools/ui';
          const importPath = '@devtools/ui';
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
      },
    },
    configureServer(server) {
      setViteServerContext(server);

      const rpcFunctions = getServerFunctions({ server, config: _config });

      createServerRpc(rpcFunctions);
    },
  };
}
