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
      // devServer.ws.on('qwiktools:client-connected', () => {
      // devServer.ws.on('qwiktools:client-connected', () => {
      //   getRoutes();
      //   devServer.ws.send('qwiktools:data', {
      //     assets: getPublicDirFiles(config.publicDir),
      //     qwik: getQwikPackages(config),
      //     config: config,
      //     routes: getRoutes(),
      //     isDevEnv: config.env.DEV,
      //     time: Date.now(),
      //   });
      // });
    },
  };
}

export default QwikDevtools;
