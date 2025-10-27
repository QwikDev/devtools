import { component$, Slot } from '@qwik.dev/core';

export const DevtoolsContainer = component$(() => {
  return (
    <div class="qwik-devtools">
      <div class="fixed bottom-0 right-0 z-[9999] font-sans" q:slot="content">
        <Slot />
      </div>
    </div>
  );
});
