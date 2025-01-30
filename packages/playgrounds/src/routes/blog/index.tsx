import type { DocumentHead } from '@qwik.dev/router';
import { component$ } from '@qwik.dev/core';
import Text from '../../components/Text/Text';
export default component$(() => {
  return (
    <>
      <Text />
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
