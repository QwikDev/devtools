import { Component } from '@devtools/kit';
import { ServerContext } from '../types';
import fsp from 'node:fs/promises';
import fg from 'fast-glob';

export const getComponentsFunctions = ({ config }: ServerContext) => {
  const getComponents = async (): Promise<Component[]> => {
    const components: Component[] = [];

    const filesOnSrc = await fg(`${config.root}/src/**/*.tsx`, {
      onlyFiles: true,
    });

    for (const file of filesOnSrc) {
      try {
        const component = await fsp.readFile(file, 'utf-8');
        const componentsOnSameFile = component.split('component$');

        for (const componentOnSameFile of componentsOnSameFile) {
          // Is a page component
          if (
            file.includes('/src/routes/') &&
            componentOnSameFile.includes('export default')
          )
            continue;

          const regex = /export\s+const\s+(\w+)\s*=/;
          const name = componentOnSameFile.match(regex)?.[1];

          console.log(name, file);

          if (name) {
            components.push({
              name,
              file,
            });
          }
        }
      } catch (e) {
        console.error(e);
        return components;
      }
    }

    console.log(components);
    return Promise.resolve(components);
  };

  return {
    getComponents,
  };
};
