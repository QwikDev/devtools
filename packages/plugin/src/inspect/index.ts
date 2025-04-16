import { ServerContext } from "../types";

export function getInspectFunctions(ctx: ServerContext) {
  return {
    getComponentInfo: async (file: string, id: string) => {
      return { file, id };
    },
  };
}