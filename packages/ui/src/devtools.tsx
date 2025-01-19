import {
  component$,
  useSignal,
  useStore,
  useVisibleTask$,
  noSerialize,
  NoSerialize,
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
  type AssetInfo,
  type RoutesInfo,
  RouteType,
} from "@devtools/kit";
import globalCss from "./global.css?inline";
import styles from "./devtools.css?inline";
import { useLocation } from "@qwik.dev/router";
import { Tab } from "./components/Tab/Tab";

function getClientRpcFunctions() {
  return {
    healthCheck: () => true,
  };
}

interface State {
  isOpen: boolean;
  activeTab: "overview" | "components" | "routes" | "state" | "assets";
  npmPackages: NpmInfo;
  assets: AssetInfo[];
  routes: NoSerialize<RoutesInfo[]>;
}

export const QwikDevtools = component$(() => {
  useStyles$(globalCss);
  useStyles$(styles);
  const state = useStore<State>({
    isOpen: false,
    activeTab: "overview",
    npmPackages: [],
    assets: [],
    routes: undefined,
  });
  const panelRef = useSignal<HTMLDivElement>();
  const location = useLocation();

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
          "fixed bottom-4 right-4 flex h-9 w-9 origin-center cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-zinc-900 backdrop-blur-md transition-all duration-300 ease-in-out":
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
          class="fixed bottom-0 right-0 flex h-[50vh] w-full translate-y-0 transform border-t border-white/10 bg-zinc-900 text-white shadow-lg backdrop-blur-lg transition-transform duration-300 ease-in-out md:w-3/5"
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

          <div class="flex-1 overflow-y-auto p-4">
            {state.activeTab === "overview" && (
              <div class="space-y-6">
                <div class="flex items-center justify-between border-b border-zinc-700 pb-4">
                  <div class="flex items-center gap-3">
                    <img
                      width={32}
                      height={32}
                      src="https://qwik.dev/logos/qwik-logo.svg"
                      alt="Qwik Logo"
                      class="h-8 w-8"
                    />
                    <h1 class="text-2xl font-semibold">Qwik DevTools</h1>
                  </div>
                  <div class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-400">
                    {state.npmPackages
                      .find(([name]) => name.includes("core"))?.[1]
                      .slice(1) || "0.0.0"}
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-5 md:grid-cols-3">
                  <div class="flex items-center gap-5 rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/[0.05]">
                    <div class="rounded-lg border border-white/10 bg-white/5 p-3.5">
                      <LuFolderTree class="h-6 w-6 text-emerald-500" />
                    </div>
                    <div>
                      <div class="text-3xl font-semibold">
                        {state.routes?.length}
                      </div>
                      <div class="text-sm text-zinc-400">pages</div>
                    </div>
                  </div>

                  <div class="flex items-center gap-5 rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/[0.05]">
                    <div class="rounded-lg border border-white/10 bg-white/5 p-3.5">
                      <HiCubeOutline class="h-6 w-6 text-emerald-500" />
                    </div>
                    <div>
                      <div class="text-3xl font-semibold">
                        {state.assets.length}
                      </div>
                      <div class="text-sm text-zinc-400">components</div>
                    </div>
                  </div>

                  <div class="flex items-center gap-5 rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/[0.05]">
                    <div class="rounded-lg border border-white/10 bg-white/5 p-3.5">
                      <HiPhotoOutline class="h-6 w-6 text-emerald-500" />
                    </div>
                    <div>
                      <div class="text-3xl font-semibold">
                        {state.assets.length || 0}
                      </div>
                      <div class="text-sm text-zinc-400">assets</div>
                    </div>
                  </div>
                </div>

                <div class="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <h3 class="text-lg font-semibold">Installed Packages</h3>
                  <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {state.npmPackages.map(([name, version]) => (
                      <div
                        key={name}
                        class="flex items-center justify-between rounded-lg bg-white/5 p-3"
                      >
                        <div class="text-sm">{name}</div>
                        <div class="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-zinc-400">
                          v{version}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div class="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <h3 class="text-lg font-semibold">Performance</h3>
                  <div class="space-y-3">
                    <div class="flex justify-between border-b border-white/10 py-2">
                      <span class="text-zinc-400">SSR to full load</span>
                      <span class="font-medium">-</span>
                    </div>
                    <div class="flex justify-between border-b border-white/10 py-2">
                      <span class="text-zinc-400">Page load</span>
                      <span class="font-medium">-</span>
                    </div>
                    <div class="flex justify-between py-2">
                      <span class="text-zinc-400">Navigation</span>
                      <span class="font-medium">-</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {state.activeTab === "assets" && (
              <div class="space-y-6">
                <div class="flex items-center justify-between border-b border-zinc-700 pb-6">
                  <h3 class="text-xl font-semibold">Public Assets</h3>
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
                </div>

                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {state.assets?.map((asset) => {
                    const isImage = asset.path.match(
                      /\.(jpg|jpeg|png|gif|svg|webp)$/i,
                    );
                    const fileExt = asset.path.split(".").pop()?.toUpperCase();

                    return (
                      <div
                        key={asset.filePath}
                        class="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition-all duration-200 hover:bg-white/[0.05]"
                      >
                        {isImage ? (
                          <div class="aspect-square overflow-hidden bg-black/20">
                            <img
                              width={176}
                              height={176}
                              src={asset.publicPath}
                              alt={asset.path}
                              class="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div class="flex aspect-square items-center justify-center bg-black/20">
                            <span class="font-mono text-2xl text-zinc-400">
                              {fileExt}
                            </span>
                          </div>
                        )}
                        <div class="space-y-2 p-4">
                          <div class="truncate text-sm" title={asset.path}>
                            {asset.path.split("/").pop()}
                          </div>
                          <div class="flex items-center justify-between text-xs text-zinc-400">
                            <span>{(asset.size / 1024).toFixed(2)} KB</span>
                            <span class="rounded-full bg-white/5 px-2 py-1">
                              {fileExt}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {state.activeTab === "components" && (
              <div class="space-y-6">
                <h3 class="border-b border-zinc-700 pb-6 text-xl font-semibold">
                  Components
                </h3>
                {/* Component content will go here */}
              </div>
            )}
            {state.activeTab === "routes" && (
              <div class="space-y-6">
                <h3 class="border-b border-zinc-700 pb-6 text-xl font-semibold">
                  Application Routes
                </h3>
                <div class="overflow-hidden rounded-xl border border-white/10">
                  <div class="grid grid-cols-4 gap-4 bg-white/[0.03] p-4 text-sm font-medium">
                    <div>Route Path</div>
                    <div>Name</div>
                    <div>Middleware</div>
                    <div>Layout</div>
                  </div>
                  {state.routes?.map((route, i) => {
                    const children = route.children || [];
                    const layout =
                      route.relativePath !== "" &&
                      route.type === "directory" &&
                      children.find((child) => child.name.startsWith("layout"));

                    return (
                      <div
                        key={route.relativePath}
                        class="grid grid-cols-4 gap-4 border-t border-white/10 p-4 text-sm hover:bg-white/[0.02]"
                      >
                        <div>
                          <span
                            class={{
                              "text-emerald-400":
                                (location.url.pathname === "/" &&
                                  route.relativePath === "") ||
                                location.url.pathname ===
                                  `/${route.relativePath}/`,
                            }}
                          >
                            {route.relativePath === ""
                              ? "/"
                              : `/${route.relativePath}/`}
                          </span>
                        </div>
                        <div class="text-zinc-400">{route.name}</div>
                        <div class="text-zinc-400">-</div>
                        <div>
                          <span
                            class={{
                              "text-emerald-400": layout && i > 0,
                              "text-zinc-400": !layout || i === 0,
                            }}
                          >
                            {layout && i > 0
                              ? `${route.relativePath}/layout`
                              : "default"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});
