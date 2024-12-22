import { ServerContext } from '../types';

import { scanAsync } from 'dree';

export function getRouteFunctions({ config }: ServerContext) {
  const routesDir = `${config.root}/src/routes`;
  return {
    getRoutes: async () => {
      const routes = await scanAsync(routesDir, {
        extensions: ['tsx'],
      });

      return routes;
    },
  };
}
