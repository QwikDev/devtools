import { ServerContext } from '../types';
import fsp from 'node:fs/promises';
import { NpmInfo } from '@devtools/kit';

export function getNpmFunctions({ config }: ServerContext) {
  return {
    async getQwikPackages(): Promise<NpmInfo> {
      const pathToPackageJson = config.configFileDependencies.find(
        (file: string) => file.endsWith('package.json'),
      );
      if (!pathToPackageJson) return [];

      try {
        const pkgJson = await fsp.readFile(pathToPackageJson, 'utf-8');
        const pkg = JSON.parse(pkgJson);
        return Object.entries<string>(pkg.devDependencies).filter(([key]) =>
          /@qwik/i.test(key),
        );
      } catch (error) {
        return [];
      }
    },
  };
}
