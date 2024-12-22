import { ViteDevServer, ResolvedConfig } from 'vite';

export interface ServerContext {
  server: ViteDevServer;
  config: ResolvedConfig;
}

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
