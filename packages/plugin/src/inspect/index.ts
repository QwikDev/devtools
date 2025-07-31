import { ServerContext } from "../types";

export function getModulesContent(ctx: ServerContext) {
  return {
    getModulesByPathIds: async (pathIds: string | string[]) => {
        let pathIdsList: string[] = [];

        let isAddRoot = (pathId: string) => pathId.includes(ctx.config.root) || pathId.includes('/@fs') ? pathId : `${ctx.config.root}${pathId}`
        if(!pathIds || pathIds.length === 0){
          return []
        }

        if(Array.isArray(pathIds)){
          pathIdsList = pathIds
        }else{
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
  };
}