import { component$ } from '@builder.io/qwik';
import { QwikIcon } from './QwikIcon';

export const Header = component$(() => {
  return (
    <header class="p-2 flex items-center gap-x-2 bg-panel-bg b-b b-solid b-panel-border text-text">
      <div class="flex items-center gap-x-2">
        <QwikIcon width={20} height={20} />
        <div class="text-xl">Qwik Developer Tools</div>
      </div>
    </header>
  );
});
