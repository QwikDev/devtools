import { AssetInfo } from './assets';
import { BirpcReturn } from 'birpc';

export interface ClientFunctions {
  healthCheck(): boolean;
}

export interface ServerFunctions {
  healthCheck(): boolean;
  getAssetsFromPublicDir: () => Promise<AssetInfo[]>;
  getRoutes: () => any;
  getQwikPackages: () => Promise<[string, string][]>;
}

export type ServerRpc = BirpcReturn<ClientFunctions, ServerFunctions>;
export type ClientRpc = BirpcReturn<ServerFunctions, ClientFunctions>;
