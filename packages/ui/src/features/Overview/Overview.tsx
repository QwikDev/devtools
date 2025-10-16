import { $, component$, sync$ } from '@qwik.dev/core';
import { HiCubeOutline, HiPhotoOutline } from '@qwikest/icons/heroicons';
import { LuFolderTree } from '@qwikest/icons/lucide';
import { State, TabName } from '../../types/state';

interface OverviewProps {
  state: State;
}

export const Overview = component$(({ state }: OverviewProps) => {
  const pageJump = $((pageName: TabName) => {
    state.activeTab = pageName;
  });
  const stopPropagation = sync$((e: MouseEvent) => {
    e.preventDefault();
  });
  return (
    <>
      <div class="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div
          onClick$={[$(() => pageJump('routes')), stopPropagation]}
           class="flex cursor-pointer items-center gap-5 rounded-xl border border-border bg-card-item-bg p-5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-card-item-hover-bg"
        >
          <div class="bg-foreground/5 rounded-lg border border-border p-3.5">
            <LuFolderTree class="h-6 w-6 text-accent" />
          </div>
          <div>
            <div class="text-3xl font-semibold">{state.routes?.length}</div>
            <div class="text-sm text-muted-foreground">pages</div>
          </div>
        </div>

        <div
          onClick$={[$(() => pageJump('components')), stopPropagation]}
          class="flex cursor-pointer items-center gap-5 rounded-xl border border-border bg-card-item-bg p-5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-card-item-hover-bg"
        >
          <div class="bg-foreground/5 rounded-lg border border-border p-3.5">
            <HiCubeOutline class="h-6 w-6 text-accent" />
          </div>
          <div>
            <div class="text-3xl font-semibold">{state.components.length}</div>
            <div class="text-sm text-muted-foreground">components</div>
          </div>
        </div>

        <div
          onClick$={[$(() => pageJump('assets')), stopPropagation]}
          class="flex cursor-pointer items-center gap-5 rounded-xl border border-border bg-card-item-bg p-5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-card-item-hover-bg"
        >
          <div class="bg-foreground/5 rounded-lg border border-border p-3.5">
            <HiPhotoOutline class="h-6 w-6 text-accent" />
          </div>
          <div>
            <div class="text-3xl font-semibold">{state.assets.length || 0}</div>
            <div class="text-sm text-muted-foreground">assets</div>
          </div>
        </div>
      </div>

      <div
        onClick$={[$(() => pageJump('packages')), stopPropagation]}
        class="cursor-pointer space-y-4 rounded-xl border border-border bg-card-item-bg p-5 hover:-translate-y-0.5 hover:bg-card-item-hover-bg mt-6 md:mt-6"
      >
        <h3 class="text-lg font-semibold">Installed Packages</h3>
        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
          {state.npmPackages.map(([name, version]) => (
            <div
              key={name}
              class="bg-foreground/5 flex items-center justify-between rounded-lg p-3"
            >
              <div class="text-sm">{name}</div>
              <div class="bg-foreground/5 rounded-full border border-border px-2 py-1 text-xs text-muted-foreground">
                {version}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div class="space-y-4 rounded-xl border border-border bg-card-item-bg p-5 mt-6 md:mt-6">
        <h3 class="text-lg font-semibold">Performance</h3>
        <div class="space-y-3">
          <div class="flex justify-between border-b border-border py-2">
            <span class="text-muted-foreground">SSR to full load</span>
            <span class="font-medium">-</span>
          </div>
          <div class="flex justify-between border-b border-border py-2">
            <span class="text-muted-foreground">Page load</span>
            <span class="font-medium">-</span>
          </div>
          <div class="flex justify-between py-2">
            <span class="text-muted-foreground">Navigation</span>
            <span class="font-medium">-</span>
          </div>
        </div>
      </div>
    </>
  );
});
