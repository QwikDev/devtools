import { Component } from '@devtools/kit';
import { resolve, relative, join } from 'node:path/posix';
import { ServerContext } from '../types';

export const getComponentsFunctions = ({ config }: ServerContext) => {
  const getComponents = async (): Promise<Component[]> => {
    const components: Component[] = [];

    const dir = resolve(config.root);
    const baseURL = config.base;

    return Promise.resolve(components);
  };

  return {
    getComponents,
  };
};
