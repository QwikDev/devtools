import type { DocumentHead } from '@qwik.dev/router';
import { component$, useSignal } from '@qwik.dev/core';
import Button from '~/components/Button/Button';

export default component$(() => {
  const testValue = useSignal('111');
  return (
    <>
      <div>About</div>
      <Button
        testValue={testValue}
        data-testid="button"
        class="bg-red-500"
      />
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

