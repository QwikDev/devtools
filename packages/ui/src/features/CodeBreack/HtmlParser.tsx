import { $, component$, useSignal, useVisibleTask$, useStyles$ } from '@qwik.dev/core';
import { _getDomContainer, _vnode_toString } from '@qwik.dev/core/internal';
import { createHighlighter } from 'shiki';

export const HtmlParser = component$(() => {
  useStyles$(`
    pre.shiki { overflow: auto; padding: 10px; height: 100%; }
  `);
  const inputHtml = useSignal('');
  const parsingTime = useSignal<number | null>(null);
  const htmlResult = useSignal<string>('');
  const highlightedHtml = useSignal<string>('');

  const onParseHtml$ = $(() => {
    if (!inputHtml.value.trim()) {
      parsingTime.value = null;
      htmlResult.value = '// Paste HTML on the left to parse';
      return;
    }

    const startTime = performance.now();

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(inputHtml.value, 'text/html');
      let output = '';
      try {
        const container = _getDomContainer(doc.documentElement);
        if (container) {
          output += '// Qwik Container Found:\n';
          output += `- Container Type: ${container.qContainer}\n`;
          output += `- Manifest Hash: ${container.qManifestHash}\n\n`;
          try {
            const vdomTree = _vnode_toString.call(
              container!.rootVNode as any,
              Number.MAX_SAFE_INTEGER,
              '',
              true,
              false,
              false
            );
            output += '// VNode Tree:\n' + vdomTree + '\n\n';
          } catch (vnodeErr) {
            output += '// VNode parsing error: ' + vnodeErr + '\n\n';
          }
        } else {
          output = '// No Qwik container found in the HTML';
        }
      } catch (containerErr) {
        output = '// No Qwik container found or error: ' + containerErr;
      }
      parsingTime.value = performance.now() - startTime;
      htmlResult.value = output;
      return;
    } catch (error) {
      parsingTime.value = performance.now() - startTime;
      htmlResult.value = `// Error parsing HTML: ${error instanceof Error ? error.message : 'Invalid HTML format'}\n\n// Raw input:\n${inputHtml.value}`;
      return;
    }
  });

  const shikiRef = useSignal<any>(null);
  useVisibleTask$(async ({ track }) => {
    track(() => htmlResult.value);
    if (!htmlResult.value) {
      highlightedHtml.value = '';
      return;
    }
    if (!shikiRef.value) {
      shikiRef.value = await createHighlighter({ themes: ['nord'], langs: ['html'] });
    }
    highlightedHtml.value = shikiRef.value.codeToHtml(htmlResult.value, { lang: 'html', theme: 'nord' });
  });

  return (
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div class="rounded-xl border border-border bg-card-item-bg flex h-[60vh] min-h-0 flex-col">
        <div class="flex items-center justify-between border-b border-border p-3">
          <div class="text-sm font-medium">Input HTML</div>
          {parsingTime.value !== null && (
            <span class="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
              {parsingTime.value}ms
            </span>
          )}
        </div>
        <div class="p-3 space-y-3 flex-1 min-h-0 flex-col">
          <textarea
            value={inputHtml.value}
            onInput$={(e, t) => (inputHtml.value = (t as HTMLTextAreaElement).value)}
            placeholder="Paste HTML and click to parse/format."
            class="h-full min-h-0 w-full flex-1 resize-none rounded-md border border-border bg-background p-3 font-mono text-sm"
          />
          <div class="flex items-center gap-3">
            <button
              onClick$={onParseHtml$}
              class="bg-accent hover:opacity-90 rounded-md px-3 py-1.5 text-sm text-white"
            >
              Parse HTML
            </button>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-border bg-card-item-bg overflow-hidden flex h-[60vh] min-h-0 flex-col">
        <div class="flex items-center justify-between border-b border-border p-3">
          <div class="text-sm font-medium">VNode Tree</div>
          {parsingTime.value !== null && (
            <span class="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
              {parsingTime.value}ms
            </span>
          )}
        </div>
        <div class="flex-1 min-h-0 h-full">
          <pre class="overflow-auto h-full" dangerouslySetInnerHTML={highlightedHtml.value || ''} />
        </div>
      </div>
    </div>
  );
});


