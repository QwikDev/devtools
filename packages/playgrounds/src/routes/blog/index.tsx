import type { DocumentHead } from '@qwik.dev/router';
import { component$ } from '@qwik.dev/core';

export default component$(() => {
  return (
    <>
      <div>Blog</div>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Welcome to Qwik',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
};
