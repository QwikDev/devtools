import { component$ } from '@qwik.dev/core';
import type { AssetInfo } from '@devtools/kit';
import { TabContent } from '../components/TabContent/TabContent';
import { TabTitle } from '../components/TabTitle/TabTitle';
import { Assets } from '../features/Assets/Assets';
import { BuildAnalysis } from '../features/BuildAnalysis/BuildAnalysis';
import { CodeBreak } from '../features/CodeBreak/CodeBreak';
import { Inspect } from '../features/Inspect/Inspect';
import { Overview } from '../features/Overview/Overview';
import { Packages } from '../features/Packages/Packages';
import { Performance } from '../features/Performance/Performance';
import { Preloads } from '../features/Preloads/Preloads';
import { RenderTree } from '../features/RenderTree/RenderTree';
import { Routes } from '../features/Routes/Routes';
import type { DevtoolsState } from './state';

interface DevtoolsContentProps {
  state: DevtoolsState;
}

function formatAssetSummary(assets: AssetInfo[]) {
  const totalSizeInKb =
    assets.reduce((totalSize, asset) => totalSize + asset.size, 0) / 1024;

  return {
    count: assets.length,
    totalSizeInKb: totalSizeInKb.toFixed(2),
  };
}

export const DevtoolsContent = component$<DevtoolsContentProps>(({ state }) => {
  const assetSummary = formatAssetSummary(state.assets);

  switch (state.activeTab) {
    case 'overview':
      return (
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
      );
    case 'assets':
      return (
        <TabContent>
          <TabTitle title="Public Assets" q:slot="title" />
          <div class="text-muted-foreground flex gap-4 text-sm">
            <span>Total Size: {assetSummary.totalSizeInKb} KB</span>
            <span>Count: {assetSummary.count}</span>
          </div>
          <Assets state={state} q:slot="content" />
        </TabContent>
      );
    case 'packages':
      return (
        <TabContent>
          <TabTitle title="Project Dependencies" q:slot="title" />
          <Packages state={state} q:slot="content" />
        </TabContent>
      );
    case 'routes':
      return (
        <TabContent>
          <TabTitle title="Application Routes" q:slot="title" />
          <Routes state={state} q:slot="content" />
        </TabContent>
      );
    case 'inspect':
      return (
        <TabContent>
          <Inspect q:slot="content" />
        </TabContent>
      );
    case 'renderTree':
      return (
        <TabContent>
          <TabTitle title="Render Tree" q:slot="title" />
          <RenderTree q:slot="content" />
        </TabContent>
      );
    case 'codeBreak':
      return (
        <TabContent>
          <TabTitle title="Code Break" q:slot="title" />
          <CodeBreak q:slot="content" />
        </TabContent>
      );
    case 'performance':
      return (
        <TabContent>
          <TabTitle title="Performance" q:slot="title" />
          <Performance q:slot="content" />
        </TabContent>
      );
    case 'preloads':
      return (
        <TabContent>
          <TabTitle title="Preloads" q:slot="title" />
          <Preloads q:slot="content" />
        </TabContent>
      );
    case 'buildAnalysis':
      return (
        <TabContent>
          <TabTitle title="Build Analysis" q:slot="title" />
          <BuildAnalysis q:slot="content" />
        </TabContent>
      );
    default:
      return null;
  }
});
