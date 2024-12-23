import { ViteDevServer, ResolvedConfig } from 'vite';

export interface ServerContext {
  server: ViteDevServer;
  config: ResolvedConfig;
}
