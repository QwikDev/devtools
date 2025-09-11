import { BirpcReturn } from 'birpc';
import { type Dree } from 'dree';
import { VARIABLE_DECLARATION_LIST, EXPRESSION_STATEMENT_LIST } from './constants';
export { Type as RouteType } from 'dree';

export interface ClientFunctions {
  healthCheck(): boolean;
}

export interface ServerFunctions {
  healthCheck(): boolean;
  getAssetsFromPublicDir: () => Promise<AssetInfo[]>;
  getComponents: () => Promise<Component[]>;
  getRoutes: () => any;
  getQwikPackages: () => Promise<[string, string][]>;
  installPackage: (
    packageName: string,
    isDev?: boolean,
  ) => Promise<{ success: boolean; error?: string }>;
  getModulesByPathIds: (pathIds: string | string[]) => Promise<{
    pathId: string;
    modules: any;
    error?: string;
  }[]>;
  parseQwikCode: (code: string) => Promise<Omit<ParsedStructure, '__start__'>[]>;
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

export interface Component {
  name: string;
  fileName: string;
  file: string;
}

export type Category = 'variableDeclaration' | 'expressionStatement' | 'listener'
export type HookType =
  | (typeof VARIABLE_DECLARATION_LIST)[number]['hook']
  | (typeof EXPRESSION_STATEMENT_LIST)[number]['hook']
  | 'customhook'

export interface ParsedStructure {
  variableName: string
  hookType: HookType
  category: Category
  __start__?: number
  returnType: HookType
  data?: any
}

