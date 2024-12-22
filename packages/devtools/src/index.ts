import { ResolvedConfig, type Plugin } from 'vite';
import { getServerFunctions } from './rpc';
import { createServerRpc, setViteServerContext } from '@qwik/devtools-kit';

function QwikDevtools(): Plugin {
  let _config: ResolvedConfig;
  return {
    name: 'qwik-devtools',
    apply: 'serve',
    configResolved(viteConfig) {
      _config = viteConfig;
    },
    configureServer(server) {
      setViteServerContext(server);

      const rpcFunctions = getServerFunctions({ server, config: _config });

      createServerRpc(rpcFunctions);
    },
  };
}

export default QwikDevtools;
