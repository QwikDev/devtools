import { ServerContext } from '../types';
import fsp from 'node:fs/promises';
import { NpmInfo } from '@devtools/kit';
import { execSync } from 'child_process';
import path from 'path';
import {debug} from 'debug'

const log = debug('qwik:devtools:npm');
// In-memory cache for npm package information
interface CacheEntry {
  data: any;
  timestamp: number;
}

const packageCache = new Map<string, CacheEntry>();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes cache TTL

// Preloaded dependencies cache - loaded at server startup
let preloadedDependencies: any[] | null = null;
let isPreloading = false;
let preloadPromise: Promise<any[]> | null = null;

function getCachedPackage(name: string): any | null {
  const cached = packageCache.get(name);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  packageCache.delete(name);
  return null;
}

function setCachedPackage(name: string, data: any): void {
  packageCache.set(name, {
    data,
    timestamp: Date.now(),
  });
}

async function findNearestFileUp(startDir: string, fileName: string): Promise<string | null> {
  try {
    let currentDir = path.resolve(startDir);
    // Guard against infinite loops by capping directory ascents
    for (let i = 0; i < 100; i++) {
      const candidate = path.join(currentDir, fileName);
      const exists = await fsp
        .access(candidate)
        .then(() => true)
        .catch(() => false);
      if (exists) return candidate;

      const parent = path.dirname(currentDir);
      if (parent === currentDir) break;
      currentDir = parent;
    }
    return null;
  } catch {
    return null;
  }
}

function getProjectStartDirFromConfig(config: any): string {
  // Prefer Vite's resolved root; fallback to the directory of the config file; finally cwd
  if (config?.root) return config.root;
  if (config?.configFile) return path.dirname(config.configFile);
  return process.cwd();
}

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

// Preload dependencies function - moved to module scope
const preloadDependencies = async (config: any): Promise<any[]> => {
  if (preloadedDependencies) {
    log('[Qwik DevTools] Dependencies already preloaded');
    return preloadedDependencies;
  }

  if (isPreloading && preloadPromise) {
    log('[Qwik DevTools] Preloading already in progress...');
    return preloadPromise;
  }

  isPreloading = true;
  log('[Qwik DevTools] Starting to preload dependencies...');
  
  preloadPromise = (async () => {
    const startDir = getProjectStartDirFromConfig(config);
    const pathToPackageJson = await findNearestFileUp(startDir, 'package.json');
    
    if (!pathToPackageJson) {
      preloadedDependencies = [];
      isPreloading = false;
      log('[Qwik DevTools] No package.json found');
      return [];
    }

    try {
      const pkgJson = await fsp.readFile(pathToPackageJson, 'utf-8');
      const pkg = JSON.parse(pkgJson);
        
        const allDeps = {
          ...pkg.dependencies || {},
          ...pkg.devDependencies || {},
          ...pkg.peerDependencies || {},
        };

        const dependencies = Object.entries<string>(allDeps);
        
        // Check cache first
        const cachedPackages: any[] = [];
        const uncachedDependencies: [string, string][] = [];
        
        for (const [name, version] of dependencies) {
          const cached = getCachedPackage(name);
          if (cached) {
            cachedPackages.push({ ...cached, version });
          } else {
            uncachedDependencies.push([name, version]);
          }
        }
        
        if (uncachedDependencies.length === 0) {
          preloadedDependencies = cachedPackages;
          isPreloading = false;
          return cachedPackages;
        }
        
        // Load all dependencies - use larger batch for initial preload
        const batchSize = 100;
        const batches = [];
        for (let i = 0; i < uncachedDependencies.length; i += batchSize) {
          batches.push(uncachedDependencies.slice(i, i + batchSize));
        }

        const fetchedPackages: any[] = [];
        
        log(`[Qwik DevTools] Fetching ${uncachedDependencies.length} packages in parallel...`);
        
        const allBatchPromises = batches.map(async (batch) => {
          const batchPromises = batch.map(async ([name, version]) => {
            try {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 5000); // Longer timeout for initial load
              
              const response = await fetch(`https://registry.npmjs.org/${name}`, {
                headers: {
                  'Accept': 'application/json',
                },
                signal: controller.signal,
              });
              
              clearTimeout(timeoutId);
              
              if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
              }
              
              const packageData = await response.json();
              
              const latestVersion = packageData['dist-tags']?.latest || version;
              const versionData = packageData.versions?.[latestVersion] || packageData.versions?.[version];
              
              let repositoryUrl = versionData?.repository?.url || packageData.repository?.url;
              if (repositoryUrl) {
                repositoryUrl = repositoryUrl
                  .replace(/^git\+/, '')
                  .replace(/^ssh:\/\/git@/, 'https://')
                  .replace(/\.git$/, '');
              }

              let iconUrl = null;
              
              if (packageData.logo) {
                iconUrl = packageData.logo;
              } else if (name.startsWith('@')) {
                const scope = name.split('/')[0].substring(1);
                iconUrl = `https://avatars.githubusercontent.com/${scope}?size=64`;
              } else if (repositoryUrl?.includes('github.com')) {
                const repoMatch = repositoryUrl.match(/github\.com\/([^\/]+)/);
                if (repoMatch) {
                  iconUrl = `https://avatars.githubusercontent.com/${repoMatch[1]}?size=64`;
                }
              }

              const packageInfo = {
                name,
                version,
                description: versionData?.description || packageData.description || 'No description available',
                author: versionData?.author || packageData.author,
                homepage: versionData?.homepage || packageData.homepage,
                repository: repositoryUrl,
                npmUrl: `https://www.npmjs.com/package/${name}`,
                iconUrl,
              };
              
              setCachedPackage(name, packageInfo);
              return packageInfo;
            } catch (error) {
              const basicInfo = {
                name,
                version,
                description: 'No description available',
                npmUrl: `https://www.npmjs.com/package/${name}`,
                iconUrl: null,
              };
              
              setCachedPackage(name, basicInfo);
              return basicInfo;
            }
          });

          const batchResults = await Promise.allSettled(batchPromises);
          return batchResults
            .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
            .map(result => result.value);
        });
        
        const allBatchResults = await Promise.all(allBatchPromises);
        for (const batchResult of allBatchResults) {
          fetchedPackages.push(...batchResult);
        }

        const allPackages = [...cachedPackages, ...fetchedPackages];
        preloadedDependencies = allPackages;
        isPreloading = false;
        
        log(`[Qwik DevTools] ✓ Successfully preloaded ${allPackages.length} dependencies`);
        
        return allPackages;
      } catch (error) {
        log('[Qwik DevTools] ✗ Failed to preload dependencies:', error);
        preloadedDependencies = [];
        isPreloading = false;
        return [];
      }
    })();

    return preloadPromise;
};

// Export function to start preloading from plugin initialization
export async function startPreloading({ config }: { config: any }) {
  const startTime = Date.now();
  log('[Qwik DevTools] 🚀 Initiating dependency preload (background)...');
  
  // Start preloading in background, don't wait for it
  preloadDependencies(config).then(() => {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    log(`[Qwik DevTools] ⚡ Preload completed in ${duration}s`);
  }).catch((err) => {
    log('[Qwik DevTools] ✗ Preload failed:', err);
  });
  
  // Return immediately, don't block
  return Promise.resolve();
}

export function getNpmFunctions({ config }: ServerContext) {
  return {
    async getQwikPackages(): Promise<NpmInfo> {
      const startDir = getProjectStartDirFromConfig(config);
      const pathToPackageJson = await findNearestFileUp(startDir, 'package.json');
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

    async getAllDependencies(): Promise<any[]> {
      // Return preloaded data immediately if available
      if (preloadedDependencies) {
        log('[Qwik DevTools] Returning preloaded dependencies');
        return preloadedDependencies;
      }

      // If preloading is in progress, wait for it
      if (isPreloading && preloadPromise) {
        log('[Qwik DevTools] Waiting for preload to complete...');
        return preloadPromise;
      }

      // If preloading hasn't started (shouldn't happen), start it now
      log('[Qwik DevTools] Warning: Preload not started, starting now...');
      return preloadDependencies(config);
    },

    async installPackage(
      packageName: string,
      isDev = true,
    ): Promise<{ success: boolean; error?: string }> {
      try {
        const startDir = getProjectStartDirFromConfig(config);
        const pathToPackageJson = await findNearestFileUp(startDir, 'package.json');
        const projectRoot = pathToPackageJson ? path.dirname(pathToPackageJson) : startDir;
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
