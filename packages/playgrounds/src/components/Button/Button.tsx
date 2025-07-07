import { component$, useStore,useSignal } from '@qwik.dev/core';

export default component$(() => {
  const store = useStore({
    count: 0,
  });
  const signal = useSignal('111');
  return <button>Click me {store.count}{signal.value}</button>;
});
