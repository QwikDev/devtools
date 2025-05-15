import { Link, type DocumentHead } from '@qwik.dev/router';
import { component$, useSignal } from '@qwik.dev/core';
import Button from '../components/Button/Button';
import Text from '../components/Text/Text';
export default component$(() => {
  const count = useSignal(0);

  return (
    <>
      <h1 onClick$={() => console.log(111)}>Hi 👋</h1>
      <div>
        <Text />
      </div>
      <h1 class="text-2xl font-bold">Count: {count.value}</h1>
      <div>
        <Link href="/about">About</Link>
      </div>
      <div>
        <Link href="/blog">Blog</Link>
      </div>
      <Button />
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
