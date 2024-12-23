import { BirpcReturn } from 'birpc';
import { Dree } from 'dree';
export { Type as RouteType } from 'dree';

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

export type AssetType =
  | 'image'
  | 'font'
  | 'video'
  | 'audio'
  | 'text'
  | 'json'
  | 'wasm'
  | 'other';

export interface AssetInfo {
  path: string;
  type: AssetType;
  publicPath: string;
  relativePath: string;
  filePath: string;
  size: number;
  mtime: number;
}

export interface ImageMeta {
  width: number;
  height: number;
  orientation?: number;
  type?: string;
  mimeType?: string;
}

export type RoutesInfo = Dree;
export type NpmInfo = [string, string][];
