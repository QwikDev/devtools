import {
  component$,
  useSignal,
  useStore,
  useVisibleTask$,
  noSerialize,
  useStyles$,
} from "@qwik.dev/core";
import { tryCreateHotContext } from "vite-hot-client";
import {
  HiBoltOutline,
  HiCubeOutline,
  HiPhotoOutline,
} from "@qwikest/icons/heroicons";
import { LuFolderTree } from "@qwikest/icons/lucide";
import {
  createClientRpc,
  getViteClientRpc,
  setViteClientContext,
  type NpmInfo,
  type RoutesInfo,
  RouteType,
} from "@devtools/kit";
import globalCss from "./global.css?inline";
import { Tab } from "./components/Tab/Tab";
import { TabContent } from "./components/TabContent/TabContent";
import { Overview } from "./features/Overview/Overview";
import { State } from "./types/state";
import { Assets } from "./features/Assets/Assets";
import { Routes } from "./features/Routes/Routes";
import { TabTitle } from "./components/TabTitle/TabTitle";

function getClientRpcFunctions() {
  return {
    healthCheck: () => true,
  };
}

export const QwikDevtools = component$(() => {
  useStyles$(globalCss);

  const state = useStore<State>({
    isOpen: false,
    activeTab: "overview",
    npmPackages: [],
    assets: [],
    routes: undefined,
  });
  const panelRef = useSignal<HTMLDivElement>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ cleanup, track }) => {
    const hot = await tryCreateHotContext(undefined, ["/"]);

    if (!hot) {
      throw new Error("Vite Hot Context not connected");
    }

    setViteClientContext(hot);
    createClientRpc(getClientRpcFunctions());

    track(() => {
      if (state.isOpen) {
        const rpc = getViteClientRpc();
        rpc.getAssetsFromPublicDir().then((data) => {
          state.assets = data;
        });
        rpc.getRoutes().then((data: RoutesInfo) => {
          const children: RoutesInfo[] = data.children || [];
          const directories: RoutesInfo[] = children.filter(
            (child) => child.type === "directory",
          );

          const values: RoutesInfo[] = [
            {
              relativePath: "",
              name: "index",
              type: RouteType.DIRECTORY,
              path: "",
              isSymbolicLink: false,
              children: undefined,
            },
            ...directories,
          ];

          state.routes = noSerialize(values);
        });

        rpc.getQwikPackages().then((data: NpmInfo) => {
          state.npmPackages = data;
        });
      }
    });

    // Add keyboard shortcut to toggle devtools
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "`" && e.metaKey) {
        state.isOpen = !state.isOpen;
      }
      // Add Escape key to close
      if (e.key === "Escape" && state.isOpen) {
        state.isOpen = false;
      }
    };

    // Handle click outside
    const handleClickOutside = (e: MouseEvent) => {
      if (
        state.isOpen &&
        panelRef.value &&
        !panelRef.value.contains(e.target as Node)
      ) {
        state.isOpen = false;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("mousedown", handleClickOutside);

    cleanup(() => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("mousedown", handleClickOutside);
    });
  });

  return (
    <div
      class={{
        "fixed bottom-0 right-0 z-[9999] font-sans": true,
      }}
    >
      <div
        class={{
          "fixed bottom-4 right-4 flex h-9 w-9 origin-center cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-zinc-900 backdrop-blur-md transition-all duration-300 ease-in-out":
            true,
          "rotate-90 border-emerald-500/50 bg-zinc-900/95 shadow-lg shadow-emerald-500/35":
            state.isOpen,
        }}
        onClick$={() => (state.isOpen = !state.isOpen)}
      >
        <img
          width={20}
          height={20}
          src="https://qwik.dev/logos/qwik-logo.svg"
          alt="Qwik Logo"
          class="h-5 w-5 opacity-90 drop-shadow-md transition-all duration-300 ease-in-out hover:scale-110 hover:opacity-100"
        />
      </div>

      {state.isOpen && (
        <div
          ref={panelRef}
          class="fixed bottom-8 right-6 flex h-[50vh] w-full translate-y-0 transform overflow-hidden rounded-lg border-2 border-white/10 bg-zinc-900 text-white backdrop-blur-lg transition-transform duration-300 ease-in-out md:w-3/5"
        >
          <div class="flex flex-col gap-2 border-r border-zinc-700 bg-zinc-900/95 p-3">
            <Tab state={state} id="overview" title="Overview">
              <HiBoltOutline class="h-5 w-5" />
            </Tab>
            <Tab state={state} id="components" title="Components">
              <HiCubeOutline class="h-5 w-5" />
            </Tab>
            <Tab state={state} id="routes" title="Routes">
              <LuFolderTree class="h-5 w-5" />
            </Tab>
            <Tab state={state} id="assets" title="Assets">
              <HiPhotoOutline class="h-5 w-5" />
            </Tab>
          </div>

          <div class="custom-scrollbar flex-1 overflow-y-auto p-4">
            {state.activeTab === "overview" && (
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
            {state.activeTab === "assets" && (
              <TabContent>
                <TabTitle title="Public Assets" q:slot="title" />
                <div class="flex gap-4 text-sm text-zinc-400">
                  <span>
                    Total Size:{" "}
                    {(
                      state.assets?.reduce(
                        (acc, asset) => acc + asset.size,
                        0,
                      ) / 1024
                    ).toFixed(2)}{" "}
                    KB
                  </span>
                  <span>Count: {state.assets?.length || 0}</span>
                </div>

                <Assets state={state} q:slot="content" />
              </TabContent>
            )}
            {state.activeTab === "components" && (
              <TabContent>
                <TabTitle title="Components" q:slot="title" />
              </TabContent>
            )}
            {state.activeTab === "routes" && (
              <TabContent>
                <TabTitle title="Application Routes" q:slot="title" />
                <Routes state={state} q:slot="content" />
              </TabContent>
            )}
          </div>
        </div>
      )}
    </div>
  );
});
