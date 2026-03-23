import { component$ } from '@qwik.dev/core';
import { inspectorLink } from './constant';
import { setupIframeThemeSync } from './iframe-theme';

export const Inspect = component$(() => {
  return (
    <div class="h-full w-full flex-1 overflow-hidden rounded-2xl border border-glass-border bg-card-item-bg">
      <iframe
        src={`${location.href}${inspectorLink}`}
        width={'100%'}
        height={'100%'}
        id="inspect_qwik"
        class="rounded-xl w-full h-full"
        onLoad$={(_, el) => {
          try {
            setupIframeThemeSync(el);
          } catch (err) {
            console.error('Failed to inject theme into inspect iframe:', err);
          }
        }}
      ></iframe>
    </div>
  );
});
