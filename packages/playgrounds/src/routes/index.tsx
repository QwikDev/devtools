import { Link, routeLoader$, type DocumentHead } from '@qwik.dev/router';
import { component$, useSignal } from '@qwik.dev/core';
import Button from '../components/Button/Button';
import Text from '../components/Text/Text';

export const useGetTime = routeLoader$(async () => {
  return { time: new Date() }
});
export default component$( () => {
  const count = useSignal(0);
  const signal = useGetTime();
  const testValue = useSignal('111');
  console.log('signal', signal)
  return (
    <>
      <h1>Hi 👋</h1>
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
      <Button testValue={testValue}  data-testid="button" class='bg-red-500' onClick$={() => {
        console.log('Button clicked! Count:', count.value);
      }}/>
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
