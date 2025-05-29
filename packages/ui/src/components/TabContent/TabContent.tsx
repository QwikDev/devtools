import { component$, Slot } from "@qwik.dev/core";

export const TabContent = component$(() => {
  return (
    <div class="flex h-full w-full flex-col space-y-6">
      <div class="flex items-center justify-between border-b border-border pb-4">
        <Slot name="title" />
      </div>

      <Slot name="content" />
    </div>
  );
});
