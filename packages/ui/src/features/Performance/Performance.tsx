import { component$, useComputed$, useSignal, useTask$, $, isBrowser } from '@qwik.dev/core';
import type { QwikPerfStoreRemembered } from '@devtools/kit';
import { computeEventRows, computePerfViewModel } from './computePerfViewModel';

function formatMs(ms: number): string {
  if (!Number.isFinite(ms)) return '-';
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`;
  if (ms >= 10) return `${ms.toFixed(0)}ms`;
  return `${ms.toFixed(2)}ms`;
}

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
    return vm.value.components.find((c) => c.componentName === name) || null;
  });

  const onSelect = $((name: string) => {
    selectedComponent.value = name;
  });

  const clearSelect = $(() => {
    selectedComponent.value = null;
  });

  return (
    <div class="h-full w-full flex-1 overflow-hidden">
      {!perf.value?.ssr?.length && !perf.value?.csr?.length ? (
        <div class="border-border bg-card-item-bg flex h-full items-center justify-center rounded-xl border p-8">
          <div class="text-muted-foreground text-center text-sm">
            No performance data found.
            <div class="mt-1 text-xs">
              Ensure instrumentation is enabled and interact with the app, then reopen this tab.
            </div>
          </div>
        </div>
      ) : (
        <div class="flex h-full min-h-0 flex-col gap-4">
          {/* Overview cards */}
          <div class="grid grid-cols-1 gap-5 md:grid-cols-4">
            <div class="border-border bg-card-item-bg hover:bg-card-item-hover-bg flex items-center gap-4 rounded-xl border p-5 transition-all duration-200">
              <div class="flex-1">
                <div class="text-muted-foreground text-xs font-medium">TOTAL RENDER TIME</div>
                <div class="mt-1 text-3xl font-semibold">{formatMs(vm.value.overview.totalRenderTime)}</div>
              </div>
            </div>

            <div class="border-border bg-card-item-bg hover:bg-card-item-hover-bg flex items-center gap-4 rounded-xl border p-5 transition-all duration-200">
              <div class="flex-1">
                <div class="text-muted-foreground text-xs font-medium">SLOWEST COMPONENT</div>
                <div class="mt-1 text-lg font-semibold">
                  {vm.value.overview.slowestComponent?.componentName || '-'}
                </div>
                <div class="text-muted-foreground mt-1 text-xs">
                  {vm.value.overview.slowestComponent
                    ? `${formatMs(vm.value.overview.slowestComponent.avgTime)} avg`
                    : '-'}
                </div>
              </div>
            </div>

            <div class="border-border bg-card-item-bg hover:bg-card-item-hover-bg flex items-center gap-4 rounded-xl border p-5 transition-all duration-200">
              <div class="flex-1">
                <div class="text-muted-foreground text-xs font-medium">AVG TIME</div>
                <div class="mt-1 text-3xl font-semibold">{formatMs(vm.value.overview.avgTime)}</div>
              </div>
            </div>

            <div class="border-border bg-card-item-bg hover:bg-card-item-hover-bg flex items-center gap-4 rounded-xl border p-5 transition-all duration-200">
              <div class="flex-1">
                <div class="text-muted-foreground text-xs font-medium">TOTAL CALLS</div>
                <div class="mt-1 text-3xl font-semibold">{vm.value.overview.totalCalls}</div>
              </div>
            </div>
          </div>

          {/* Main split */}
          <div class="border-border bg-background flex min-h-0 flex-1 overflow-hidden rounded-md border">
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
                {vm.value.components.map((c) => {
                  const selected = selectedComponent.value === c.componentName;
                  return (
                    <button
                      key={c.componentName}
                      onClick$={() => onSelect(c.componentName)}
                      class={[
                        'border-border bg-card-item-bg hover:bg-card-item-hover-bg w-full rounded-xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5',
                        selected ? 'ring-primary-active ring-2' : '',
                      ].join(' ')}
                    >
                      <div class="flex items-start justify-between gap-4">
                        <div class="min-w-0 flex-1">
                          <div class="truncate text-base font-semibold">{c.componentName}</div>
                          <div class="text-muted-foreground mt-1 text-xs">
                            Avg: {formatMs(c.avgTime)}
                          </div>
                        </div>
                        <div class="shrink-0 text-right">
                          <div class="text-primary text-lg font-semibold">{formatMs(c.totalTime)}</div>
                          <div class="text-muted-foreground text-xs">
                            SSR: {typeof c.ssr?.ssrCount === 'number' ? c.ssr.ssrCount : '-'}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div class="border-border border-l" />

            <div class="flex w-[420px] min-w-[320px] flex-col overflow-hidden">
              {selectedVm.value ? (
                <>
                  <div class="border-border flex items-center justify-between border-b p-4">
                    <div class="min-w-0">
                      <div class="truncate text-base font-semibold">
                        {selectedVm.value.componentName} Hook Details
                      </div>
                      <div class="text-muted-foreground mt-1 text-xs">
                        Total: {formatMs(selectedVm.value.totalTime)} • {selectedVm.value.calls} calls
                      </div>
                    </div>
                    <button
                      aria-label="close"
                      onClick$={clearSelect}
                      class="text-muted-foreground hover:text-foreground rounded p-2 transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <div class="min-h-0 flex-1 overflow-y-auto p-4">
                    <div class="border-border bg-card-item-bg rounded-lg border">
                      <div class="border-border grid grid-cols-3 border-b px-3 py-2 text-xs font-medium">
                        <div class="text-muted-foreground">HOOK NAME</div>
                        <div class="text-muted-foreground text-right">TIME</div>
                        <div class="text-muted-foreground text-right">CALLS</div>
                      </div>
                      <div class="divide-border divide-y">
                        {computeEventRows(selectedVm.value.csrItems).map((row) => (
                          <div key={row.eventName} class="grid grid-cols-3 px-3 py-2 text-sm">
                            <div class="truncate">{row.eventName}</div>
                            <div class="text-right">{formatMs(row.time)}</div>
                            <div class="text-right">{row.calls}</div>
                          </div>
                        ))}
                        {!selectedVm.value.csrItems.length && (
                          <div class="text-muted-foreground px-3 py-4 text-center text-sm">
                            No CSR records for this component.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
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
      )}
    </div>
  );
});
