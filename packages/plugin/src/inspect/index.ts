import fs from 'node:fs/promises'
import { parseQwikCode } from "../parse/parse";
import { ServerContext } from "../types";

export function getModulesContent(ctx: ServerContext) {
  let isAddRoot = (pathId: string) => pathId.includes(ctx.config.root) || pathId.includes('/@fs') ? pathId : `${ctx.config.root}${pathId}`
  return {
    getModulesByPathIds: async (pathIds: string | string[]) => {
      let pathIdsList: string[] = [];


      if (!pathIds || pathIds.length === 0) {
        return []
      }

      if (Array.isArray(pathIds)) {
        pathIdsList = pathIds
      } else {
        pathIdsList = [pathIds]
      }
      const modules = await Promise.all(pathIdsList.map(async (pathId) => {
        try {
          const modules = await ctx.server.transformRequest(isAddRoot(pathId));
          return {
            pathId,
            modules
          };
        } catch (error) {
          console.log(`Failed to transform request for ${pathId}:`, error);
          return {
            pathId,
            modules: null,
            error: error instanceof Error ? error.message : String(error)
          };
        }
      }));

      if (modules.length > 0) {
        return modules;
      }
      return [];
    },
    parseQwikCode: async (pathId: string) => {
      try {
        const id = isAddRoot(pathId)
        const resolved = await ctx.server.pluginContainer.resolveId(id)
        const rid = resolved?.id ?? id
        const mod = ctx.server.moduleGraph.getModuleById(rid)

        // Prefer original file content if this maps to a real file
        if (mod?.file) {
          const raw = await fs.readFile(mod.file, 'utf-8')
          return parseQwikCode(raw)
        }

        // For virtual modules, try the loader output (pre-transform)
        const loaded = await ctx.server.pluginContainer.load(rid)
        if (typeof loaded === 'string') {
          return parseQwikCode(loaded)
        }
        if (loaded && typeof (loaded as any).code === 'string') {
          return parseQwikCode((loaded as any).code as string)
        }

        // Fallback: transformed code (may differ from original)
        const transformed = await ctx.server.transformRequest(rid)
        return parseQwikCode(transformed?.code ?? '')
      } catch (error) {
        console.error(`Failed to parse qwik code for ${pathId}:`, error);
        return []
      }

    }
  };
}