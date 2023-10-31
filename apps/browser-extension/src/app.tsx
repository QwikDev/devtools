import { component$, useStyles$ } from '@builder.io/qwik';
import styles from './app.css?inline';
import { QwikIcon } from './components/QwikIcon';
import { Header } from './components/Header';
import { LeftPanel } from './components/LeftPanel';
import { RightPanel } from './components/RightPanel';

export const App = component$(() => {
  useStyles$(styles);
  return (
    <div class="devtools-root">
      <div
        class="h-full w-full overflow-hidden grid text-base font-sans bg-panel-bg text-text"
        style="grid-template-rows: 2.5rem 1fr;"
      >
        <Header />
        <div class="overflow-hidden">
          <div
            class="grid grid-auto-flow-col h-full w-full"
            style="grid-template-columns: minmax(8rem, 50%) 1px minmax(8rem, 1fr);"
          >
            <LeftPanel />
            <div class="relative bg-panel-border">
              <div class="absolute z-9999 select-none cursor-row-resize sm:cursor-col-resize -inset-y-3px inset-x-0 sm:inset-y-0 sm:-inset-x-3px bg-panel-border transition opacity-0"></div>
            </div>
            <RightPanel />
          </div>
        </div>
      </div>
    </div>
  );
});
