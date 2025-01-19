import { ServerContext } from '../types';
import fsp from 'node:fs/promises';
import { NpmInfo } from '@devtools/kit';
import { execSync } from 'child_process';
import path from 'path';

export async function detectPackageManager(
  projectRoot: string,
): Promise<'npm' | 'pnpm' | 'yarn'> {
  try {
    if (
      await fsp
        .access(path.join(projectRoot, 'pnpm-lock.yaml'))
        .then(() => true)
        .catch(() => false)
    ) {
      return 'pnpm';
    }
    if (
      await fsp
        .access(path.join(projectRoot, 'yarn.lock'))
        .then(() => true)
        .catch(() => false)
    ) {
      return 'yarn';
    }
    if (
      await fsp
        .access(path.join(projectRoot, 'package-lock.json'))
        .then(() => true)
        .catch(() => false)
    ) {
      return 'npm';
    }
    return 'pnpm'; // default to pnpm if no lockfile found
  } catch {
    return 'pnpm';
  }
}

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

    async installPackage(
      packageName: string,
      isDev = true,
    ): Promise<{ success: boolean; error?: string }> {
      try {
        const projectRoot = path.dirname(config.configFileDependencies[0]);
        const pm = await detectPackageManager(projectRoot);
        const devFlag = isDev ? (pm === 'npm' ? '--save-dev' : '-D') : '';

        const command = {
          npm: `npm install ${devFlag} ${packageName}`,
          pnpm: `pnpm add ${devFlag} ${packageName}`,
          yarn: `yarn add ${devFlag} ${packageName}`,
        }[pm];

        execSync(command, {
          cwd: projectRoot,
          stdio: 'pipe',
        });

        return { success: true };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : 'Unknown error occurred',
        };
      }
    },
  };
}
