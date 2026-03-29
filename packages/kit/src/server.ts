import { ClientFunctions, ServerFunctions } from './types';
import { DEVTOOLS_VITE_MESSAGING_EVENT } from './constants';
import { setViteServerRpc, getViteServerContext } from './context';
import { createSerializedRpc } from './rpc-core';

export function createServerRpc(functions: ServerFunctions) {
  const server = getViteServerContext();

  const rpc = createSerializedRpc<ClientFunctions, ServerFunctions>(functions, {
    post: (data) => server.ws.send(DEVTOOLS_VITE_MESSAGING_EVENT, data),
    on: (handler) =>
      server.ws.on(DEVTOOLS_VITE_MESSAGING_EVENT, (data: any) => {
        handler(data);
      }),
  });

  setViteServerRpc(rpc);
}
