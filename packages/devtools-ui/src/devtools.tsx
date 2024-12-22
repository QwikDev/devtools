import { component$, useSignal, useVisibleTask$ } from '@qwik.dev/core';
import { tryCreateHotContext } from 'vite-hot-client';
import {
  HiBoltOutline,
  HiCubeOutline,
  HiPhotoOutline,
} from '@qwikest/icons/heroicons';
import { LuFolderTree } from '@qwikest/icons/lucide';
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
        class={{
          'devtools-toggle': true,
          'is-open': isOpen.value,
        }}
        onClick$={() => (isOpen.value = !isOpen.value)}
      >
        <img
          width={20}
          height={20}
          src="https://qwik.dev/logos/qwik-logo.svg"
          alt="Qwik Logo"
          class="toggle-icon"
        />
      </div>

      {isOpen.value && (
        <div ref={panelRef} class="devtools-panel">
          <div class="devtools-tabs">
            <button
              class={{ 'tab-active': activeTab.value === 'overview' }}
              onClick$={() => (activeTab.value = 'overview')}
              title="Overview"
            >
              <HiBoltOutline width={20} height={20} />
            </button>
            <button
              class={{ 'tab-active': activeTab.value === 'components' }}
              onClick$={() => (activeTab.value = 'components')}
              title="Components"
            >
              <HiCubeOutline width={20} height={20} />
            </button>
            <button
              class={{ 'tab-active': activeTab.value === 'routes' }}
              onClick$={() => (activeTab.value = 'routes')}
              title="Routes"
            >
              <LuFolderTree width={20} height={20} />
            </button>
            <button
              class={{ 'tab-active': activeTab.value === 'state' }}
              onClick$={() => (activeTab.value = 'state')}
              title="State"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7zm0 2a5 5 0 0 0-5 5c0 2.05 1.23 3.81 3 4.58V16h4v-2.42c1.77-.77 3-2.53 3-4.58a5 5 0 0 0-5-5z"
                  fill="currentColor"
                />
                <path d="M8 20v1h8v-1H8z" fill="currentColor" />
              </svg>
            </button>
            <button
              class={{ 'tab-active': activeTab.value === 'assets' }}
              onClick$={() => (activeTab.value = 'assets')}
              title="Assets"
            >
              <HiPhotoOutline width={20} height={20} />
            </button>
          </div>
          <div class="devtools-content">
            {activeTab.value === 'overview' && (
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
                    {qwikPackages.value.find(([name]) =>
                      name.includes('core'),
                    )?.[1] || '0.0.0'}
                  </div>
                </div>
                <div class="metrics-grid">
                  <div class="metric-card">
                    <div class="metric-icon">
                      <LuFolderTree class="icon" />
                    </div>
                    <div class="metric-content">
                      <div class="metric-value">{routes.value.length}</div>
                      <div class="metric-label">pages</div>
                    </div>
                  </div>

                  <div class="metric-card">
                    <div class="metric-icon">
                      <HiCubeOutline class="icon" />
                    </div>
                    <div class="metric-content">
                      <div class="metric-value">{assets.value.length}</div>
                      <div class="metric-label">components</div>
                    </div>
                  </div>

                  <div class="metric-card">
                    <div class="metric-icon">
                      <HiPhotoOutline class="icon" />
                    </div>
                    <div class="metric-content">
                      <div class="metric-value">{assets.value.length || 0}</div>
                      <div class="metric-label">assets</div>
                    </div>
                  </div>
                </div>

                <div class="packages-section">
                  <h3>Installed Packages</h3>
                  <div class="packages-grid">
                    {qwikPackages.value.map(([name, version]) => (
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
            {activeTab.value === 'assets' && (
              <div class="tab-content assets">
                <div class="header-section">
                  <h3>Public Assets</h3>
                  <div class="assets-stats">
                    <span class="stat-item">
                      Total Size:{' '}
                      {(
                        assets.value?.reduce(
                          (acc, asset) => acc + asset.size,
                          0,
                        ) / 1024
                      ).toFixed(2)}{' '}
                      KB
                    </span>
                    <span class="stat-item">
                      Count: {assets.value?.length || 0}
                    </span>
                  </div>
                </div>
                <div class="assets-grid">
                  {assets.value?.map((asset) => {
                    const isImage = asset.path.match(
                      /\.(jpg|jpeg|png|gif|svg|webp)$/i,
                    );
                    const fileExt = asset.path.split('.').pop()?.toUpperCase();

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
                            {asset.path.split('/').pop()}
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
            {activeTab.value === 'components' && (
              <div class="tab-content">
                <h3>Components</h3>
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
            width: 36px;
            height: 36px;
            background: #18181b;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15),
                      inset 0 1px 1px rgba(255, 255, 255, 0.1);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            transform-origin: center;
            overflow: hidden;
            backdrop-filter: blur(8px);
            animation: glow 2s ease-in-out infinite;
          }

          @keyframes glow {
            0% {
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15),
                        inset 0 1px 1px rgba(255, 255, 255, 0.1);
            }
            50% {
              box-shadow: 0 4px 12px rgba(0, 220, 130, 0.35),
                        inset 0 1px 1px rgba(255, 255, 255, 0.1),
                        0 0 25px rgba(0, 220, 130, 0.25);
              border-color: rgba(0, 220, 130, 0.5);
            }
            100% {
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15),
                        inset 0 1px 1px rgba(255, 255, 255, 0.1);
            }
          }

          .devtools-toggle:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 16px rgba(0, 220, 130, 0.4),
                      inset 0 1px 1px rgba(255, 255, 255, 0.15),
                      0 0 30px rgba(0, 220, 130, 0.3);
            border-color: rgba(0, 220, 130, 0.6);
            background: #1c1c1f;
            animation: none;
          }

          .devtools-toggle:active {
            transform: scale(0.98);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15),
                      inset 0 1px 1px rgba(255, 255, 255, 0.1);
            animation: none;
          }

          .devtools-toggle.is-open {
            transform: rotate(90deg);
            background: #1c1c1f;
            animation: none;
            border-color: rgba(0, 220, 130, 0.5);
            box-shadow: 0 4px 12px rgba(0, 220, 130, 0.35),
                      inset 0 1px 1px rgba(255, 255, 255, 0.1),
                      0 0 25px rgba(0, 220, 130, 0.25);
          }

          .devtools-toggle.is-open:hover {
            transform: rotate(90deg) scale(1.05);
            box-shadow: 0 6px 16px rgba(0, 220, 130, 0.4),
                      inset 0 1px 1px rgba(255, 255, 255, 0.15),
                      0 0 30px rgba(0, 220, 130, 0.3);
          }

          .devtools-panel {
            position: fixed;
            bottom: 0;
            right: 0;
            width: 100%;
            height: 50vh;
            background: #18181b;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            color: #fff;
            box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.15);
            display: flex;
            transform: translateY(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(16px);
          }

          .devtools-open .devtools-panel {
            transform: translateY(0);
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
            flex-direction: column;
            gap: 8px;
            padding: 12px;
            border-right: 1px solid #27272a;
            background: #1c1c1f;
          }

          .devtools-tabs button {
            padding: 4px;
            background: transparent;
            border: none;
            color: #a1a1aa;
            cursor: pointer;
            border-radius: 6px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
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
            height: 100%;
            overflow-y: auto;
            flex: 1;
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
          .assets-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 1.25rem;
            margin-top: 1.5rem;
            padding: 0.5rem;
          }

          .asset-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            overflow: hidden;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .asset-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            border-color: rgba(255, 255, 255, 0.15);
          }

          .asset-preview {
            height: 120px;
            background: rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }

          .asset-preview img {
            width: 70%;
            height: 70%;
            object-fit: contain;
            padding: 0.5rem;
          }

          .file-preview {
            height: 120px;
            background: rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }

          .file-ext {
            font-size: 1.5rem;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.7);
            text-transform: uppercase;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }

          .asset-info {
            padding: 0.75rem;
            background: rgba(0, 0, 0, 0.2);
          }

          .asset-path {
            color: #fff;
            font-size: 0.875rem;
            font-weight: 500;
            margin-bottom: 0.5rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .asset-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 0.5rem;
          }

          .asset-size {
            color: #94a3b8;
            font-size: 0.75rem;
          }

          .asset-type {
            color: #94a3b8;
            font-size: 0.75rem;
            padding: 0.25rem 0.5rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            letter-spacing: 0.025em;
          }

          .tab-content.overview {
            padding: 1.5rem;
          }

          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.25rem;
            margin-bottom: 2rem;
          }

          .metric-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 1.25rem;
            display: flex;
            align-items: center;
            gap: 1.25rem;
            transition: all 0.2s ease;
          }

          .metric-card:hover {
            background: rgba(255, 255, 255, 0.05);
            transform: translateY(-1px);
          }

          .metric-icon {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 0.875rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
          }

          .metric-card:hover .metric-icon {
            background: rgba(255, 255, 255, 0.08);
          }

          .icon {
            width: 1.5rem;
            height: 1.5rem;
            color: #10b981;
          }

          .metric-content {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }

          .metric-value {
            font-size: 1.75rem;
            font-weight: 600;
            color: #fff;
            line-height: 1.2;
          }

          .metric-label {
            color: #94a3b8;
            font-size: 0.875rem;
            font-weight: 500;
            letter-spacing: 0.01em;
          }

          .performance-section {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 1.25rem;
          }

          .performance-section h3 {
            margin: 0 0 1.25rem 0;
            font-size: 1rem;
            font-weight: 600;
            color: #fff;
            letter-spacing: 0.01em;
          }

          .performance-metrics {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .perf-item {
            display: flex;
            justify-content: space-between;
            color: #94a3b8;
            font-size: 0.875rem;
            padding: 0.5rem 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .perf-item:last-child {
            border-bottom: none;
          }

          .perf-value {
            color: #fff;
            font-weight: 500;
          }

          .header-section {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 2rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .title-container {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .qwik-logo {
            width: 2rem;
            height: 2rem;
          }

          .title-container h1 {
            font-size: 1.5rem;
            font-weight: 600;
            color: #fff;
            margin: 0;
          }

          .version {
            font-size: 0.875rem;
            color: #94a3b8;
            font-weight: 500;
            padding: 0.25rem 0.75rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 9999px;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }

          .packages-section {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 1.25rem;
            margin-bottom: 1.25rem;
          }

          .packages-section h3 {
            margin: 0 0 1.25rem 0;
            font-size: 1rem;
            font-weight: 600;
            color: #fff;
            letter-spacing: 0.01em;
          }

          .packages-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 0.75rem;
          }

          .package-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem 1rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            transition: all 0.2s ease;
          }

          .package-item:hover {
            background: rgba(255, 255, 255, 0.08);
          }

          .package-name {
            color: #fff;
            font-size: 0.875rem;
            font-weight: 500;
          }

          .package-version {
            color: #94a3b8;
            font-size: 0.75rem;
            font-weight: 500;
            padding: 0.25rem 0.5rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 9999px;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }

          .tab-content.assets {
            padding: 1.5rem;
          }

          .assets-stats {
            display: flex;
            gap: 1rem;
          }

          .stat-item {
            color: #94a3b8;
            font-size: 0.875rem;
            padding: 0.25rem 0.75rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 9999px;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }

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

          .toggle-icon {
            width: 20px;
            height: 20px;
            transition: all 0.3s ease;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
            opacity: 0.9;
          }

          .devtools-toggle:hover .toggle-icon {
            transform: scale(1.1);
            filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.3));
            opacity: 1;
          }
        `}
      </style>
    </div>
  );
});
