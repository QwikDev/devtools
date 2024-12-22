import { component$, useSignal, useVisibleTask$ } from '@qwik.dev/core';
import { tryCreateHotContext } from 'vite-hot-client';
import {
  createClientRpc,
  getViteClientRpc,
  setViteClientContext,
} from '@qwik/devtools-kit';

function getClientRpcFunctions() {
  return {
    healthCheck: () => true,
  };
}

export const QwikDevtools = component$(() => {
  const isOpen = useSignal(false);
  const activeTab = useSignal('overview');
  const qwikPackages = useSignal<[string, string][]>([]);
  const isDevEnv = useSignal<boolean>(true);
  const assets = useSignal<Record<string, string>[]>([]);
  const routes = useSignal<Record<string, any>[]>([
    {
      relativePath: '',
      name: 'index',
      type: 'directory',
      children: null,
    },
  ]);
  const panelRef = useSignal<HTMLDivElement>();
  const location = useSignal<string>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ cleanup, track }) => {
    const hot = await tryCreateHotContext(undefined, ['/']);

    if (!hot) {
      throw new Error('Vite Hot Context not connected');
    }

    setViteClientContext(hot);
    createClientRpc(getClientRpcFunctions());

    track(() => {
      if (isOpen.value) {
        const rpc = getViteClientRpc();
        rpc.getAssetsFromPublicDir().then((data) => {
          assets.value = data;
        });
        rpc.getRoutes().then((data) => {
          routes.value = [
            ...routes.value,
            ...data.children.filter((child) => child.type === 'directory'),
          ];
        });

        rpc.getQwikPackages().then((data) => {
          qwikPackages.value = data;
        });
      }
    });

    // Add keyboard shortcut to toggle devtools
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '`' && e.metaKey) {
        isOpen.value = !isOpen.value;
      }
      // Add Escape key to close
      if (e.key === 'Escape' && isOpen.value) {
        isOpen.value = false;
      }
    };

    // Handle click outside
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen.value &&
        panelRef.value &&
        !panelRef.value.contains(e.target as Node)
      ) {
        isOpen.value = false;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('mousedown', handleClickOutside);

    cleanup(() => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('mousedown', handleClickOutside);
    });
  });

  return (
    <div
      class={{
        'devtools-container': true,
        'devtools-open': isOpen.value,
      }}
    >
      <div
        class="devtools-toggle"
        onClick$={() => (isOpen.value = !isOpen.value)}
      >
        <span class="devtools-logo">⚡️</span>
      </div>

      {isOpen.value && (
        <div ref={panelRef} class="devtools-panel">
          <div class="devtools-header">
            <div class="devtools-tabs">
              <button
                class={{ 'tab-active': activeTab.value === 'overview' }}
                onClick$={() => (activeTab.value = 'overview')}
              >
                Overview
              </button>
              <button
                class={{ 'tab-active': activeTab.value === 'components' }}
                onClick$={() => (activeTab.value = 'components')}
              >
                Components
              </button>
              <button
                class={{ 'tab-active': activeTab.value === 'routes' }}
                onClick$={() => (activeTab.value = 'routes')}
              >
                Routes
              </button>
              <button
                class={{ 'tab-active': activeTab.value === 'state' }}
                onClick$={() => (activeTab.value = 'state')}
              >
                State
              </button>
              <button
                class={{ 'tab-active': activeTab.value === 'assets' }}
                onClick$={() => (activeTab.value = 'assets')}
              >
                Assets
              </button>
            </div>
          </div>

          <div class="devtools-content">
            {activeTab.value === 'overview' && (
              <div class="tab-content">
                <h3>Qwik Application Overview</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">Environment</span>
                    {isDevEnv.value && (
                      <span class="info-value">Development</span>
                    )}
                  </div>
                  <div class="info-item">
                    <div class="info-grid">
                      {qwikPackages.value.map(([name, version]) => {
                        if (name.includes('core')) {
                          return (
                            <div key={name}>
                              <span class="info-label">Qwik Version</span>
                              <span class="info-value">{version}</span>
                            </div>
                          );
                        }

                        if (name.includes('router')) {
                          return (
                            <div key={name}>
                              <span class="info-label">
                                Qwik Router Version
                              </span>
                              <span class="info-value">{version}</span>
                            </div>
                          );
                        }

                        return (
                          <div key={name}>
                            <span class="info-label">{name}</span>
                            <span class="info-value">{version}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab.value === 'assets' && (
              <div class="tab-content">
                <h3>Public Assets</h3>
                <div class="assets-grid">
                  {assets.value?.map((asset) => (
                    <div class="info-item" key={asset.filePath}>
                      <div class="asset-header">
                        <span class="info-label">{asset.path}</span>
                        <span class="asset-size">
                          {(asset.size / 1024).toFixed(2)} KB
                        </span>
                      </div>
                      {asset.path.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i) ? (
                        <div class="asset-preview">
                          <img
                            width={176}
                            height={176}
                            src={asset.publicPath}
                            alt={asset.path}
                          />
                        </div>
                      ) : (
                        <span class="asset-path">{asset.path}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab.value === 'routes' && (
              <div class="tab-content">
                <h3>Application Routes</h3>
                <div class="routes-table">
                  <div class="table-header">
                    <div class="col-route">Route Path</div>
                    <div class="col-route">Name</div>
                    <div class="col-route">Middleware</div>
                    <div class="col-route">Layout</div>
                  </div>
                  {routes.value?.map((route, i) => {
                    const layout =
                      route.relativePath !== '' &&
                      route.type === 'directory' &&
                      route.children.find((child) =>
                        child.name.startsWith('layout'),
                      );
                    return (
                      <div class="table-row" key={route.relativePath}>
                        <div class="col-route">
                          <span
                            class={
                              location.value ===
                              (route.relativePath === '/'
                                ? '/'
                                : `${route.relativePath}/`)
                                ? 'active-route'
                                : ''
                            }
                          >
                            /{route.relativePath}
                          </span>
                        </div>
                        <div class="col-route">{route.name}</div>
                        <div class="col-route">-</div>
                        <div class="col-route">
                          <span class={layout && i > 0 ? 'custom-layout' : ''}>
                            {layout && i > 0
                              ? `${route.relativePath}/layout`
                              : 'default'}
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

      <style>
        {`
          .devtools-container {
            position: fixed;
            bottom: 0;
            right: 0;
            z-index: 9999;
            font-family: system-ui, -apple-system, sans-serif;
          }

          .devtools-toggle {
            position: fixed;
            bottom: 16px;
            right: 16px;
            width: 44px;
            height: 44px;
            background: #18181b;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s ease;
          }

          .devtools-toggle:hover {
            transform: scale(1.05);
          }

          .devtools-logo {
            font-size: 20px;
          }

          .devtools-panel {
            position: fixed;
            bottom: 0;
            right: 0;
            width: 100%;
            height: 50vh;
            background: #18181b;
            border-top: 1px solid #27272a;
            color: #fff;
            box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
          }

          @media (min-width: 640px) {
            .devtools-panel {
              width: 80%;
              right: 0;
            }
          }

          .devtools-header {
            padding: 12px;
            border-bottom: 1px solid #27272a;
          }

          .devtools-tabs {
            display: flex;
            gap: 8px;
          }

          .devtools-tabs button {
            padding: 6px 12px;
            background: transparent;
            border: none;
            color: #a1a1aa;
            cursor: pointer;
            border-radius: 6px;
            transition: all 0.2s ease;
          }

          .devtools-tabs button:hover {
            background: #27272a;
            color: #fff;
          }

          .devtools-tabs button.tab-active {
            background: #3b82f6;
            color: white;
          }

          .devtools-content {
            padding: 16px;
            height: calc(100% - 60px);
            overflow-y: auto;
          }

          .tab-content h3 {
            margin: 0 0 16px 0;
            font-size: 18px;
            font-weight: 600;
          }

          .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 16px;
          }

          .info-item {
            background: #27272a;
            padding: 12px;
            border-radius: 8px;
          }

          .info-label {
            display: block;
            color: #a1a1aa;
            font-size: 12px;
            margin-bottom: 4px;
          }

          .info-value {
            font-size: 14px;
            font-weight: 500;
          }

          /* Asset specific styles */
          .assets-grid .info-item {
            background: transparent;
            padding: 0;
            height: 100%;
            display: flex;
            flex-direction: column;
          }

          .assets-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 16px;
          }

          .asset-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            background: #27272a;
            border-radius: 8px 8px 0 0;
          }

          .asset-size {
            font-size: 12px;
            color: #a1a1aa;
          }

          .asset-path {
            font-size: 12px;
            color: #71717a;
            word-break: break-all;
            padding: 12px;
            background: #27272a;
            min-height: 200px;
            display: flex;
            align-items: center;
            border-radius: 0 0 8px 8px;
          }

          .asset-preview {
            margin-top: 0;
            border-radius: 0 0 8px 8px;
            overflow: hidden;
            background: #27272a;
            padding: 12px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 200px;
          }

          .asset-preview img {
            max-width: 100%;
            max-height: 176px;
            object-fit: contain;
          }

          /* Routes table styles */
          .routes-table {
            background: #18181b;
            border-radius: 8px;
            overflow: hidden;
          }

          .table-header {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1fr;
            padding: 12px 16px;
            background: #27272a;
            font-weight: 500;
            border-bottom: 1px solid #3f3f46;
          }

          .table-row {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1fr;
            padding: 12px 16px;
            border-bottom: 1px solid #27272a;
            align-items: center;
          }

          .table-row:hover {
            background: #27272a;
          }

          .active-route {
            background: #22c55e20;
            color: #22c55e;
            padding: 4px 8px;
            border-radius: 4px;
          }

          .col-route {
            font-family: monospace;
          }

          .custom-layout {
            color: #3b82f6;
          }
        `}
      </style>
    </div>
  );
});
