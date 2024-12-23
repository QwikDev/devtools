import SuperJSON from 'superjson';
import { ClientFunctions, ServerFunctions } from './types';
import { createBirpc } from 'birpc';
import { DEVTOOLS_VITE_MESSAGING_EVENT } from './constants';
import { getViteClientContext, setViteClientRpc } from './context';

export function createClientRpc(functions: ClientFunctions) {
  const client = getViteClientContext();

  const rpc = createBirpc<ServerFunctions, ClientFunctions>(functions, {
    post: (data) =>
      client.send(DEVTOOLS_VITE_MESSAGING_EVENT, SuperJSON.stringify(data)),
    on: (fn) =>
      client.on(DEVTOOLS_VITE_MESSAGING_EVENT, (data) => {
        fn(SuperJSON.parse(data));
      }),
    timeout: 120_000,
  });

  setViteClientRpc(rpc);
}
