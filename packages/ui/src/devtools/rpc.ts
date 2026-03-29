import {
  createClientRpc,
  getViteClientRpc,
  setViteClientContext,
  type RoutesInfo,
  RouteType,
} from '@devtools/kit';
import { noSerialize } from '@qwik.dev/core';
import debug from 'debug';
import { tryCreateHotContext } from 'vite-hot-client';
import type { DevtoolsState } from './state';

const log = debug('qwik:devtools:devtools');

function getClientRpcFunctions() {
  return {
    healthCheck: () => true,
  };
}

function toDevtoolsRoutes(routes: any): RoutesInfo[] {
  const children: RoutesInfo[] = routes?.children || [];
  const directories: RoutesInfo[] = children.filter(
    (child) => child.type === RouteType.DIRECTORY,
  );

  return [
    {
      relativePath: '',
      name: 'index',
      type: RouteType.DIRECTORY,
      path: '',
      isSymbolicLink: false,
      children: undefined,
    },
    ...directories,
  ];
}

async function connectRpc() {
  const hot = await tryCreateHotContext(undefined, ['/']);
  if (!hot) {
    throw new Error('Vite Hot Context not connected');
  }

  setViteClientContext(hot);
  createClientRpc(getClientRpcFunctions());

  return getViteClientRpc();
}

export async function loadDevtoolsData(state: DevtoolsState) {
  const rpc = await connectRpc();

  const primaryDataPromise = Promise.allSettled([
    rpc.getAssetsFromPublicDir(),
    rpc.getComponents(),
    rpc.getRoutes(),
    rpc.getQwikPackages(),
  ]);

  state.isLoadingDependencies = true;
  const dependenciesPromise = rpc
    .getAllDependencies()
    .then((allDependencies) => {
      state.allDependencies = allDependencies;
    })
    .catch((error) => {
      log('Failed to load all dependencies:', error);
    })
    .finally(() => {
      state.isLoadingDependencies = false;
    });

  const [assetsResult, componentsResult, routesResult, packagesResult] =
    await primaryDataPromise;

  if (assetsResult.status === 'fulfilled') {
    state.assets = assetsResult.value;
  } else {
    log('Failed to load assets:', assetsResult.reason);
  }

  if (componentsResult.status === 'fulfilled') {
    state.components = componentsResult.value;
  } else {
    log('Failed to load components:', componentsResult.reason);
  }

  if (routesResult.status === 'fulfilled') {
    state.routes = noSerialize(toDevtoolsRoutes(routesResult.value));
  } else {
    log('Failed to load routes:', routesResult.reason);
  }

  if (packagesResult.status === 'fulfilled') {
    state.npmPackages = packagesResult.value;
  } else {
    log('Failed to load Qwik packages:', packagesResult.reason);
  }

  await dependenciesPromise;
}
