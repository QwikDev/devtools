import { component$, useComputed$, useSignal, useTask$, $, isBrowser } from '@qwik.dev/core';
import type { QwikPerfStoreRemembered } from '@devtools/kit';
import {
  computeEventRows,
  computePerfViewModel,
  type PerfComponentVm,
  type PerfOverviewVm,
  type PerfEventVm,
} from './computePerfViewModel';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatMs(ms: number): string {
  if (!Number.isFinite(ms)) return '-';
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`;
  if (ms >= 10) return `${ms.toFixed(0)}ms`;
  return `${ms.toFixed(2)}ms`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Single stat card shown in the overview row. */
const StatCard = component$<{ label: string; value: string; subtitle?: string }>((props) => (
  <div class="border-border bg-card-item-bg hover:bg-card-item-hover-bg flex items-center gap-4 rounded-xl border p-5 transition-all duration-200">
    <div class="flex-1">
      <div class="text-muted-foreground text-xs font-medium">{props.label}</div>
      <div class="mt-1 text-3xl font-semibold">{props.value}</div>
      {props.subtitle && (
        <div class="text-muted-foreground mt-1 text-xs">{props.subtitle}</div>
      )}
    </div>
  </div>
));

/** Top overview row of four stat cards. */
const PerformanceOverview = component$<{ overview: PerfOverviewVm }>((props) => {
  const { overview } = props;
  const slowest = overview.slowestComponent;
  return (
    <div class="grid grid-cols-1 gap-5 md:grid-cols-4">
      <StatCard label="TOTAL RENDER TIME" value={formatMs(overview.totalRenderTime)} />
      <StatCard
        label="SLOWEST COMPONENT"
        value={slowest?.componentName || '-'}
        subtitle={slowest ? `${formatMs(slowest.avgTime)} avg` : '-'}
      />
      <StatCard label="AVG TIME" value={formatMs(overview.avgTime)} />
      <StatCard label="TOTAL CALLS" value={String(overview.totalCalls)} />
    </div>
  );
});

/** A single component card in the left-hand list. */
const ComponentCard = component$<{
  component: PerfComponentVm;
  selected: boolean;
  onClick$: () => void;
}>((props) => {
  const { component: c, selected } = props;
  return (
    <button
      key={c.componentName}
      onClick$={props.onClick$}
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
});

/** Single row inside the hook-details table. */
const HookRow = component$<{ row: PerfEventVm }>((props) => (
  <div class="grid grid-cols-3 px-3 py-2 text-sm">
    <div class="truncate">{props.row.eventName}</div>
    <div class="text-right">{formatMs(props.row.time)}</div>
    <div class="text-right">{props.row.calls}</div>
  </div>
));

/** Right-hand panel showing hook-level details for a selected component. */
const HookDetailsPanel = component$<{
  component: PerfComponentVm;
  onClose$: () => void;
}>((props) => {
  const rows = computeEventRows(props.component.csrItems);
  return (
    <>
      <div class="border-glass-border flex items-center justify-between border-b p-4">
        <div class="min-w-0">
          <div class="truncate text-base font-semibold">
            {props.component.componentName} Hook Details
          </div>
          <div class="text-muted-foreground mt-1 text-xs">
            Total: {formatMs(props.component.totalTime)} • {props.component.calls} calls
          </div>
        </div>
        <button
          aria-label="close"
          onClick$={props.onClose$}
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
          <div class="divide-y divide-glass-border">
            {rows.map((row) => (
              <HookRow key={row.eventName} row={row} />
            ))}
            {rows.length === 0 && (
              <div class="text-muted-foreground px-3 py-4 text-center text-sm">
                No CSR records for this component.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
});

// ---------------------------------------------------------------------------
// Main Performance page
// ---------------------------------------------------------------------------

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

  // ── Empty-state ──
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
        {/* Overview cards */}
        <PerformanceOverview overview={vm.value.overview} />

        {/* Main split */}
        <div class="border-glass-border flex min-h-0 flex-1 overflow-hidden rounded-2xl border bg-card-item-bg">
          {/* Left: component list */}
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

          {/* Right: hook details */}
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
