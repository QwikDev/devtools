import { ServerContext } from "../types";

export function getModulesContent(ctx: ServerContext) {
  return {
    getModulesById: async (id: string | string[]) => {
        let pathIds: string[] = [];
        
        const modules = await Promise.all(pathIds.map(async (pathId) => {
          try {
            const modules = await ctx.server.transformRequest(`${ctx.config.root}${pathId}`);
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
        return null;  
    },
  };
}