import { $, component$, useSignal, useVisibleTask$, useStyles$ } from '@qwik.dev/core';
import { _dumpState, _preprocessState } from '@qwik.dev/core/internal';
import { createHighlighter } from 'shiki';

export const StateParser = component$(() => {
  useStyles$(`
    pre.shiki { overflow: auto; padding: 10px;  height: 100%; }
  `);
  const inputState = useSignal('');
  const parsingTime = useSignal<number | null>(null);
  const stateResult = useSignal<string>('');
  const highlightedState = useSignal<string>('');

  const onParseState$ = $(() => {
    if (!inputState.value.trim()) {
      parsingTime.value = null;
      stateResult.value = '// Paste state on the left to parse';
      return;
    }

    const startTime = performance.now();

    try {
      const stateData = JSON.parse(inputState.value);
      const container = {
        $getObjectById$: (id: number | string) => id,
        element: null,
        getSyncFn: () => () => {},
        $storeProxyMap$: new WeakMap(),
        $forwardRefs$: null,
        $initialQRLsIndexes$: null,
        $scheduler$: null,
      };
      _preprocessState(stateData, container as any);
      const dumpedState = _dumpState(stateData, false, '', null).replace(/\n/, '');
      parsingTime.value = performance.now() - startTime;
      stateResult.value = dumpedState;
      return;
    } catch (error) {
      try {
        const cleanInput = inputState.value
          .replace(/<script[^>]*>/gi, '')
          .replace(/<\/script>/gi, '')
          .trim();
        if (cleanInput) {
          const stateData = JSON.parse(cleanInput);
          const container = {
            $getObjectById$: (id: number | string) => id,
            element: null,
            getSyncFn: () => () => {},
            $storeProxyMap$: new WeakMap(),
            $forwardRefs$: null,
            $initialQRLsIndexes$: null,
            $scheduler$: null,
          };
          _preprocessState(stateData, container as any);
          const dumpedState = _dumpState(stateData, false, '', null);
          parsingTime.value = performance.now() - startTime;
          stateResult.value = dumpedState;
          return;
        }
      } catch (secondError) {
        parsingTime.value = performance.now() - startTime;
        stateResult.value = `// Error parsing state: ${error instanceof Error ? error.message : 'Invalid state format'}\n\n// Raw input:\n${inputState.value}`;
        return;
      }
    }

    parsingTime.value = performance.now() - startTime;
    stateResult.value = '// Unable to parse the provided state';
  });

  const shikiRef = useSignal<any>(null);
  useVisibleTask$(async ({ track }) => {
    track(() => stateResult.value);
    if (!stateResult.value) {
      highlightedState.value = '';
      return;
    }
    if (!shikiRef.value) {
      shikiRef.value = await createHighlighter({ themes: ['nord'], langs: ['json'] });
    }
    highlightedState.value = shikiRef.value.codeToHtml(stateResult.value, { lang: 'json', theme: 'nord' });
  });

  return (
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div class="rounded-xl border border-border bg-card-item-bg flex h-[60vh] min-h-0 flex-col">
        <div class="flex items-center justify-between border-b border-border p-3">
          <div class="text-sm font-medium">Input State</div>
          {parsingTime.value !== null && (
            <span class="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
              {parsingTime.value}ms
            </span>
          )}
        </div>
        <div class="p-3 space-y-3 flex-1 min-h-0 flex-col">
          <textarea
            value={inputState.value}
            onInput$={(e, t) => (inputState.value = (t as HTMLTextAreaElement).value)}
            placeholder="Paste Qwik state and click to parse/format."
            class="h-full min-h-0 w-full flex-1 resize-none rounded-md border border-border bg-background p-3 font-mono text-sm"
          />
          <div class="flex items-center gap-3">
            <button
              onClick$={onParseState$}
              class="bg-accent hover:opacity-90 rounded-md px-3 py-1.5 text-sm text-white"
            >
              Parse State
            </button>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-border bg-card-item-bg overflow-hidden flex h-[60vh] min-h-0 flex-col">
        <div class="flex items-center justify-between border-b border-border p-3">
          <div class="text-sm font-medium">Parsed State</div>
          {parsingTime.value !== null && (
            <span class="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
              {parsingTime.value}ms
            </span>
          )}
        </div>
        <div class="flex-1 min-h-0 h-full">
          <pre class="overflow-auto h-full" dangerouslySetInnerHTML={highlightedState.value || ''} />
        </div>
      </div>
    </div>
  );
});


