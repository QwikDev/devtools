import { component$ } from '@builder.io/qwik';
import { QwikIcon } from './components/QwikIcon';

export const Header = component$(() => {
  return (
    <header class="p-2 flex items-center gap-x-2 bg-panel-bg b-b b-solid b-panel-border text-text">
      <div class="flex items-center gap-x-2">
        <QwikIcon width={18} height={18} />
        <div>
          <h3>Qwik Developer Tools</h3>
          <p class="text-disabled font-mono text-sm">overlay</p>
        </div>
      </div>
    </header>
  );
});
