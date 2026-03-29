import {
  $,
  component$,
  isBrowser,
  useComputed$,
  useSignal,
  useTask$,
} from '@qwik.dev/core';
import type { QwikPerfStoreRemembered } from '@devtools/kit';
import {
  computePerfViewModel,
} from './computePerfViewModel';
import { ComponentCard } from './components/ComponentCard';
import { HookDetailsPanel } from './components/HookDetailsPanel';
import { PerformanceOverview } from './components/PerformanceOverview';

export const Performance = component$(() => {
  const perf = useSignal<QwikPerfStoreRemembered | null>(null);
  const selectedComponent = useSignal<string | null>(null);

  useTask$(() => {
    if (!isBrowser) return;
    perf.value = window.__QWIK_PERF__ || { ssr: [], csr: [] };
  });

  const vm = useComputed$(() => computePerfViewModel(perf.value));

  const selectedVm = useComputed$(() => {
    const name = selectedComponent.value;
    if (!name) return null;
    return vm.value.components.find((c) => c.componentName === name) ?? null;
  });

  const onSelect = $((name: string) => {
    selectedComponent.value = name;
  });

  const clearSelect = $(() => {
    selectedComponent.value = null;
  });

  const hasData = perf.value?.ssr?.length || perf.value?.csr?.length;

  if (!hasData) {
    return (
      <div class="h-full w-full flex-1 overflow-hidden">
        <div class="border-border bg-card-item-bg flex h-full items-center justify-center rounded-xl border p-8">
          <div class="text-muted-foreground text-center text-sm">
            No performance data found.
            <div class="mt-1 text-xs">
              Ensure instrumentation is enabled and interact with the app, then reopen this tab.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main layout ──
  return (
    <div class="h-full w-full flex-1 overflow-hidden">
      <div class="flex h-full min-h-0 flex-col gap-4">
        <PerformanceOverview overview={vm.value.overview} />

        <div class="border-glass-border flex min-h-0 flex-1 overflow-hidden rounded-2xl border bg-card-item-bg">
          <div class="min-h-0 flex-1 overflow-y-auto p-4">
            <div class="mb-3 flex items-center justify-between">
              <div>
                <div class="text-lg font-semibold">Components</div>
                <div class="text-muted-foreground text-xs">
                  CSR only • {vm.value.components.length} total
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              {vm.value.components.map((c) => (
                <ComponentCard
                  key={c.componentName}
                  component={c}
                  selected={selectedComponent.value === c.componentName}
                  onClick$={() => onSelect(c.componentName)}
                />
              ))}
            </div>
          </div>

          <div class="border-l border-glass-border" />

          <div class="flex w-[420px] min-w-[320px] flex-col overflow-hidden">
            {selectedVm.value ? (
              <HookDetailsPanel component={selectedVm.value} onClose$={clearSelect} />
            ) : (
              <div class="flex h-full items-center justify-center p-8">
                <div class="text-muted-foreground text-center text-sm">
                  Select a component to view hook details.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
