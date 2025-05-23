import { component$, Slot } from "@qwik.dev/core";

export const TabContent = component$(() => {
  return (
    <div class="space-y-6 flex-col flex h-full w-full">
      <div class="flex items-center justify-between border-b border-border pb-4">
        <Slot name="title" />
      </div>

      <Slot name="content" />
    </div>
  );
});
