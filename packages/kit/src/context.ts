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

type GlobalTarget = Record<string, unknown>;
const t = target as unknown as GlobalTarget;

export function getViteClientContext(): ViteClientContext {
  return t[CLIENT_CTX] as ViteClientContext;
}

export function setViteClientContext(ctx: ViteClientContext) {
  t[CLIENT_CTX] = ctx;
}

export function getViteServerContext() {
  return t[SERVER_CTX] as ViteServerContext;
}

export function setViteServerContext(ctx: ViteServerContext) {
  t[SERVER_CTX] = ctx;
}

export function getViteServerRpc() {
  return t[SERVER_RPC] as ServerRpc;
}

export function setViteServerRpc(rpc: ServerRpc) {
  t[SERVER_RPC] = rpc;
}

export function getViteClientRpc() {
  return t[CLIENT_RPC] as ClientRpc;
}

export function setViteClientRpc(rpc: ClientRpc) {
  t[CLIENT_RPC] = rpc;
}
