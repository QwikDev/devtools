import { target } from './shared';
import {
  ViteClientContext,
  CLIENT_CTX,
  SERVER_CTX,
  ViteServerContext,
  SERVER_RPC,
  CLIENT_RPC,
} from './globals';
import { ServerRpc, ClientRpc } from './types';

export function getViteClientContext(): ViteClientContext {
  return target[CLIENT_CTX];
}

export function setViteClientContext(ctx: ViteClientContext) {
  target[CLIENT_CTX] = ctx;
}

export function getViteServerContext() {
  return target[SERVER_CTX];
}

export function setViteServerContext(ctx: ViteServerContext) {
  target[SERVER_CTX] = ctx;
}

export function getViteServerRpc() {
  return target[SERVER_RPC];
}

export function setViteServerRpc(rpc: ServerRpc) {
  target[SERVER_RPC] = rpc;
}

export function getViteClientRpc() {
  return target[CLIENT_RPC];
}

export function setViteClientRpc(rpc: ClientRpc) {
  target[CLIENT_RPC] = rpc;
}
