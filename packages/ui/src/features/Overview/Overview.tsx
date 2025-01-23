import { component$ } from "@qwik.dev/core";
import { HiCubeOutline, HiPhotoOutline } from "@qwikest/icons/heroicons";
import { LuFolderTree } from "@qwikest/icons/lucide";
import { State } from "../../types/state";

interface OverviewProps {
  state: State;
}

export const Overview = component$(({ state }: OverviewProps) => {
  return (
    <>
      <div class="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div class="flex items-center gap-5 rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/[0.05]">
          <div class="rounded-lg border border-white/10 bg-white/5 p-3.5">
            <LuFolderTree class="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <div class="text-3xl font-semibold">{state.routes?.length}</div>
            <div class="text-sm text-zinc-400">pages</div>
          </div>
        </div>

        <div class="flex items-center gap-5 rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/[0.05]">
          <div class="rounded-lg border border-white/10 bg-white/5 p-3.5">
            <HiCubeOutline class="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <div class="text-3xl font-semibold">{state.components.length}</div>
            <div class="text-sm text-zinc-400">components</div>
          </div>
        </div>

        <div class="flex items-center gap-5 rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/[0.05]">
          <div class="rounded-lg border border-white/10 bg-white/5 p-3.5">
            <HiPhotoOutline class="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <div class="text-3xl font-semibold">{state.assets.length || 0}</div>
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
                {version}
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
    </>
  );
});
