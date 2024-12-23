import { ViteDevServer } from 'vite';
import { ClientRpc, ServerRpc } from './types';

interface EventEmitter {
  on: (name: string, handler: (data: any) => void) => void;
  send: (name: string, ...args: any[]) => void;
}

export interface ViteClientContext extends EventEmitter {}
export type ViteServerContext = ViteDevServer;

export const CLIENT_CTX = '__qwik_client_ctx__';
export const SERVER_CTX = '__qwik_server_ctx__';
export const SERVER_RPC = '__qwik_server_rpc__';
export const CLIENT_RPC = '__qwik_client_rpc__';

declare global {
  var __qwik_client_ctx__: ViteClientContext;
  var __qwik_server_ctx__: ViteServerContext;
  var __qwik_server_rpc__: ServerRpc;
  var __qwik_client_rpc__: ClientRpc;
}
