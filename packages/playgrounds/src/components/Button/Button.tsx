import { component$, useStore } from '@qwik.dev/core';

export default component$(() => {
  const store = useStore({
    count: 0,
  });
  return <button>Click me {store.count}</button>;
});
