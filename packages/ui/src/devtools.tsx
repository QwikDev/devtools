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
        "devtools-container": true,
        "devtools-open": state.isOpen,
      }}
    >
      <div
        class={{
          "devtools-toggle": true,
          "is-open": state.isOpen,
        }}
        onClick$={() => (state.isOpen = !state.isOpen)}
      >
        <img
          width={20}
          height={20}
          src="https://qwik.dev/logos/qwik-logo.svg"
          alt="Qwik Logo"
          class="toggle-icon"
        />
      </div>

      {state.isOpen && (
        <div ref={panelRef} class="devtools-panel text-3xl">
          <div class="devtools-tabs">
            <Tab state={state} id="overview" title="Overview">
              <HiBoltOutline width={20} height={20} />
            </Tab>
            <Tab state={state} id="components" title="Components">
              <HiCubeOutline width={20} height={20} />
            </Tab>
            <Tab state={state} id="routes" title="Routes">
              <LuFolderTree width={20} height={20} />
            </Tab>
            <Tab state={state} id="assets" title="Assets">
              <HiPhotoOutline width={20} height={20} />
            </Tab>
          </div>
          <div class="devtools-content">
            {state.activeTab === "overview" && (
              <div class="tab-content overview">
                <div class="header-section">
                  <div class="title-container">
                    <img
                      width={32}
                      height={32}
                      src="https://qwik.dev/logos/qwik-logo.svg"
                      alt="Qwik Logo"
                      class="qwik-logo"
                    />
                    <h1>Qwik DevTools</h1>
                  </div>
                  <div class="version">
                    v
                    {state.npmPackages.find(([name]) =>
                      name.includes("core"),
                    )?.[1] || "0.0.0"}
                  </div>
                </div>
                <div class="metrics-grid">
                  <div class="metric-card">
                    <div class="metric-icon">
                      <LuFolderTree class="icon" />
                    </div>
                    <div class="metric-content">
                      <div class="metric-value">{state.routes?.length}</div>
                      <div class="metric-label">pages</div>
                    </div>
                  </div>

                  <div class="metric-card">
                    <div class="metric-icon">
                      <HiCubeOutline class="icon" />
                    </div>
                    <div class="metric-content">
                      <div class="metric-value">{state.assets.length}</div>
                      <div class="metric-label">components</div>
                    </div>
                  </div>

                  <div class="metric-card">
                    <div class="metric-icon">
                      <HiPhotoOutline class="icon" />
                    </div>
                    <div class="metric-content">
                      <div class="metric-value">{state.assets.length || 0}</div>
                      <div class="metric-label">assets</div>
                    </div>
                  </div>
                </div>

                <div class="packages-section">
                  <h3>Installed Packages</h3>
                  <div class="packages-grid">
                    {state.npmPackages.map(([name, version]) => (
                      <div key={name} class="package-item">
                        <div class="package-name">{name}</div>
                        <div class="package-version">v{version}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div class="performance-section">
                  <h3>Performance</h3>
                  <div class="performance-metrics">
                    <div class="perf-item">
                      <span>SSR to full load</span>
                      <span class="perf-value">-</span>
                    </div>
                    <div class="perf-item">
                      <span>Page load</span>
                      <span class="perf-value">-</span>
                    </div>
                    <div class="perf-item">
                      <span>Navigation</span>
                      <span class="perf-value">-</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {state.activeTab === "assets" && (
              <div class="tab-content assets">
                <div class="header-section">
                  <h3>Public Assets</h3>
                  <div class="assets-stats">
                    <span class="stat-item">
                      Total Size:{" "}
                      {(
                        state.assets?.reduce(
                          (acc, asset) => acc + asset.size,
                          0,
                        ) / 1024
                      ).toFixed(2)}{" "}
                      KB
                    </span>
                    <span class="stat-item">
                      Count: {state.assets?.length || 0}
                    </span>
                  </div>
                </div>
                <div class="assets-grid">
                  {state.assets?.map((asset) => {
                    const isImage = asset.path.match(
                      /\.(jpg|jpeg|png|gif|svg|webp)$/i,
                    );
                    const fileExt = asset.path.split(".").pop()?.toUpperCase();

                    return (
                      <div class="asset-card" key={asset.filePath}>
                        {isImage ? (
                          <div class="asset-preview">
                            <img
                              width={176}
                              height={176}
                              src={asset.publicPath}
                              alt={asset.path}
                            />
                          </div>
                        ) : (
                          <div class="file-preview">
                            <span class="file-ext">{fileExt}</span>
                          </div>
                        )}
                        <div class="asset-info">
                          <div class="asset-path" title={asset.path}>
                            {asset.path.split("/").pop()}
                          </div>
                          <div class="asset-meta">
                            <span class="asset-size">
                              {(asset.size / 1024).toFixed(2)} KB
                            </span>
                            <span class="asset-type">{fileExt}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {state.activeTab === "components" && (
              <div class="tab-content">
                <h3>Components</h3>
              </div>
            )}
            {state.activeTab === "routes" && (
              <div class="tab-content">
                <h3>Application Routes</h3>
                <div class="routes-table">
                  <div class="table-header">
                    <div class="col-route">Route Path</div>
                    <div class="col-route">Name</div>
                    <div class="col-route">Middleware</div>
                    <div class="col-route">Layout</div>
                  </div>
                  {state.routes?.map((route, i) => {
                    const children = route.children || [];
                    const layout =
                      route.relativePath !== "" &&
                      route.type === "directory" &&
                      children.find((child) => child.name.startsWith("layout"));

                    return (
                      <div class="table-row" key={route.relativePath}>
                        <div class="col-route">
                          <span
                            class={
                              (location.url.pathname === "/" &&
                                route.relativePath === "") ||
                              location.url.pathname ===
                                `/${route.relativePath}/`
                                ? "active-route"
                                : ""
                            }
                          >
                            {route.relativePath === ""
                              ? "/"
                              : `/${route.relativePath}/`}
                          </span>
                        </div>
                        <div class="col-route">{route.name}</div>
                        <div class="col-route">-</div>
                        <div class="col-route">
                          <span class={layout && i > 0 ? "custom-layout" : ""}>
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