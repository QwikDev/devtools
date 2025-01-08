import SuperJSON from 'superjson';
import { ClientFunctions, ServerFunctions } from './types';
import { createBirpc } from 'birpc';
import { DEVTOOLS_VITE_MESSAGING_EVENT } from './constants';
import { setViteServerRpc, getViteServerContext } from './context';

export function createServerRpc(functions: ServerFunctions) {
  const server = getViteServerContext();

  const rpc = createBirpc<ClientFunctions, ServerFunctions>(functions, {
    post: (data) =>
      server.ws.send(DEVTOOLS_VITE_MESSAGING_EVENT, SuperJSON.stringify(data)),
    on: (fn) =>
      server.ws.on(DEVTOOLS_VITE_MESSAGING_EVENT, (data) => {
        fn(SuperJSON.parse(data));
      }),
    timeout: 120_000,
  });

  setViteServerRpc(rpc);
}
