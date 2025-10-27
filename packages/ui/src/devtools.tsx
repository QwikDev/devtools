import {
  component$,
  useStore,
  noSerialize,
  useStyles$,
  useSignal,
  useVisibleTask$,
} from '@qwik.dev/core';
import { tryCreateHotContext } from 'vite-hot-client';
import {
  HiBoltOutline,
  HiPhotoOutline,
  HiMegaphoneMini,
  HiCubeOutline,

  HiCodeBracketSolid
} from '@qwikest/icons/heroicons';
import { BsDiagram3 } from '@qwikest/icons/bootstrap';
import { LuFolderTree } from '@qwikest/icons/lucide';
import {
  createClientRpc,
  getViteClientRpc,
  setViteClientContext,
  type RoutesInfo,
  RouteType,
} from '@devtools/kit';
import globalCss from './global.css?inline';
import { Tab } from './components/Tab/Tab';
import { TabContent } from './components/TabContent/TabContent';
import { Overview } from './features/Overview/Overview';
import { State } from './types/state';
import { Assets } from './features/Assets/Assets';
import { Routes } from './features/Routes/Routes';
import { TabTitle } from './components/TabTitle/TabTitle';
import { RenderTree } from './features/RenderTree/RenderTree';
import { DevtoolsButton } from './components/DevtoolsButton/DevtoolsButton';
import { DevtoolsContainer } from './components/DevtoolsContainer/DevtoolsContainer';
import { DevtoolsPanel } from './components/DevtoolsPanel/DevtoolsPanel';
import { Packages } from './features/Packages/Packages';
import { Inspect } from './features/inspect/Inspect';
import { QwikThemeToggle } from './components/ThemeToggle/QwikThemeToggle';
import { ThemeScript as QwikThemeScript } from './components/ThemeToggle/theme-script';
import { CodeBreack } from './features/CodeBreack/CodeBreack';
function getClientRpcFunctions() {
  return {
    healthCheck: () => true,
  };
}

export const QwikDevtools = component$(() => {
  useStyles$(globalCss);
  const state = useStore<State>({
    isOpen: useSignal(false),
    activeTab: 'overview',
    npmPackages: [],
    assets: [],
    components: [],
    routes: undefined,
    allDependencies: [],
    isLoadingDependencies: false,
  });

  const clientReady = useSignal(false);

  useVisibleTask$(async () => {
    const hot = await tryCreateHotContext(undefined, ['/']);
    if (!hot) {
      throw new Error('Vite Hot Context not connected');
    }

    setViteClientContext(hot);
    createClientRpc(getClientRpcFunctions());
    clientReady.value = true;
  });

  useVisibleTask$(async ({ track }) => {
    track(() => clientReady.value);
    if (!clientReady.value) return;
    const rpc = getViteClientRpc();
    try {
      const assets = await rpc.getAssetsFromPublicDir();
      state.assets = assets;
    } catch (error) {
      console.error('Failed to load assets:', error);
    }
  });

  useVisibleTask$(async ({ track }) => {
    track(() => clientReady.value);
    if (!clientReady.value) return;
    const rpc = getViteClientRpc();
    try {
      const components = await rpc.getComponents();
      state.components = components;
    } catch (error) {
      console.error('Failed to load components:', error);
    }
  });

  useVisibleTask$(async ({ track }) => {
    track(() => clientReady.value);
    if (!clientReady.value) return;
    const rpc = getViteClientRpc();
    try {
      const routes = await rpc.getRoutes();
      const children: RoutesInfo[] = routes?.children || [];
      const directories: RoutesInfo[] = children.filter(
        (child) => child.type === 'directory',
      );

      const values: RoutesInfo[] = [
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

      state.routes = noSerialize(values);
    } catch (error) {
      console.error('Failed to load routes:', error);
    }
  });

  useVisibleTask$(async ({ track }) => {
    track(() => clientReady.value);
    if (!clientReady.value) return;
    const rpc = getViteClientRpc();
    try {
      const qwikPackages = await rpc.getQwikPackages();
      state.npmPackages = qwikPackages;
    } catch (error) {
      console.error('Failed to load Qwik packages:', error);
    }
  });

  useVisibleTask$(async ({ track }) => {
    track(() => clientReady.value);
    if (!clientReady.value) return;
    const rpc = getViteClientRpc();
    state.isLoadingDependencies = true;
    try {
      const allDeps = await rpc.getAllDependencies();
      state.allDependencies = allDeps;
    } catch (error) {
      console.error('Failed to load all dependencies:', error);
    } finally {
      state.isLoadingDependencies = false;
    }
  });

  return (
    <>
      <QwikThemeScript />
      <DevtoolsContainer>
        <DevtoolsButton state={state} />

        {state.isOpen.value && (
          <DevtoolsPanel state={state}>
            <div class="bg-background/95 flex flex-col gap-2 border-r border-border p-3">
              <Tab state={state} id="overview" title="Overview">
                <HiBoltOutline class="h-5 w-5" />
              </Tab>
              <Tab state={state} id="packages" title="Packages">
                <HiCubeOutline class="h-5 w-5" />
              </Tab>
              <Tab state={state} id="renderTree" title="renderTree">
                <BsDiagram3 class="h-5 w-5" />
              </Tab>
              <Tab state={state} id="routes" title="Routes">
                <LuFolderTree class="h-5 w-5" />
              </Tab>
              <Tab state={state} id="assets" title="Assets">
                <HiPhotoOutline class="h-5 w-5" />
              </Tab>
              <Tab state={state} id="inspect" title="inspect">
                <HiMegaphoneMini class="h-5 w-5" />
              </Tab>
              <Tab state={state} id="codeBreack" title="codeBreack">
                < HiCodeBracketSolid class="h-5 w-5" />
              </Tab>
              <div class="mt-auto">
                <QwikThemeToggle />
              </div>
            </div>

            <div class="custom-scrollbar flex-1 overflow-y-auto p-4">
              {state.activeTab === 'overview' && (
                <TabContent>
                  <div class="flex items-center gap-3" q:slot="title">
                    <img
                      width={32}
                      height={32}
                      src="https://qwik.dev/logos/qwik-logo.svg"
                      alt="Qwik Logo"
                      class="h-8 w-8"
                    />
                    <h1 class="text-2xl font-semibold">Qwik DevTools</h1>
                  </div>
                  <Overview state={state} q:slot="content" />
                </TabContent>
              )}
              {state.activeTab === 'assets' && (
                <TabContent>
                  <TabTitle title="Public Assets" q:slot="title" />
                  <div class="flex gap-4 text-sm text-muted-foreground">
                    <span>
                      Total Size:{' '}
                      {(
                        state.assets?.reduce(
                          (acc, asset) => acc + asset.size,
                          0,
                        ) / 1024
                      ).toFixed(2)}{' '}
                      KB
                    </span>
                    <span>Count: {state.assets?.length || 0}</span>
                  </div>

                  <Assets state={state} q:slot="content" />
                </TabContent>
              )}
              {state.activeTab === 'packages' && (
                <TabContent>
                  <TabTitle title="Project Dependencies" q:slot="title" />
                  <Packages state={state} q:slot="content" />
                </TabContent>
              )}
              {state.activeTab === 'routes' && (
                <TabContent>
                  <TabTitle title="Application Routes" q:slot="title" />
                  <Routes state={state} q:slot="content" />
                </TabContent>
              )}
              {state.activeTab === 'inspect' && (
                <TabContent>
                  <Inspect q:slot="content" />
                </TabContent>
              )}
              {state.activeTab === 'renderTree' && (
                <TabContent>
                  <TabTitle title="render Tree" q:slot="title" />
                  <RenderTree q:slot="content" />
                </TabContent>
              )}
              {state.activeTab === 'codeBreack' && (
                <TabContent>
                  <TabTitle title="codeBreack" q:slot="title" />
                  <CodeBreack q:slot="content" />
                </TabContent>
              )}
            </div>
          </DevtoolsPanel>
        )}
      </DevtoolsContainer>
    </>
  );
});
