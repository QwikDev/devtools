import { component$ } from '@builder.io/qwik';

export const BrowserExtension = component$(() => {
  return (
    <div class="flex h-[400px] min-w-[300px] flex-col items-center justify-center">
      <h1 class="text-3xl font-bold">Qwik Chrome Extension</h1>
      <button>example!!</button>
    </div>
  );
});
