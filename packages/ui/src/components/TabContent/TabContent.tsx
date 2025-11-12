import { component$, Slot } from '@qwik.dev/core';

export const TabContent = component$(() => {
  return (
    <div class="flex h-full w-full flex-col space-y-6">
      <div class="border-border flex items-center justify-between border-b pb-4">
        <Slot name="title" />
      </div>

      <div class="flex-1 overflow-y-auto pb-6">
        <Slot name="content" />
      </div>
    </div>
  );
});
