import { component$, useSignal, useStyles$ } from '@qwik.dev/core';
import { StateParser } from './StateParser';
import { HtmlParser } from './HtmlParser';

type ParserTab = 'state' | 'html';

export const CodeBreack = component$(() => {
  useStyles$(`
  .code-output-container {
    overflow-x: auto;
    overflow-y: auto;
  }
  .code-output-container > div {
    width: fit-content;
    min-width: 100%;
  }
  .code-output-container pre[class*='language-'] {
    margin: 0;
    min-width: max-content;
  }
  `);

  const currentTab = useSignal<ParserTab>('state');


  return (
    <div class="space-y-6 h-full overflow-hidden">
      {/* Segmented Navigation */}
      <div class="flex justify-center">
        <div class="inline-flex rounded-xl border border-border bg-background p-0.5">
          <button
            onClick$={() => (currentTab.value = 'state')}
            class={{
              'px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-colors': true,
              'bg-accent text-white shadow': currentTab.value === 'state',
              'text-muted-foreground hover:bg-foreground/5': currentTab.value !== 'state',
            }}
          >
            State Parser
          </button>
          <button
            onClick$={() => (currentTab.value = 'html')}
            class={{
              'px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-colors': true,
              'bg-accent text-white shadow': currentTab.value === 'html',
              'text-muted-foreground hover:bg-foreground/5': currentTab.value !== 'html',
            }}
          >
            HTML Parser
          </button>
        </div>
      </div>

      {/* Content */}
      {currentTab.value === 'state' && <StateParser />}
      {currentTab.value === 'html' && <HtmlParser />}
    </div>
  );
});
