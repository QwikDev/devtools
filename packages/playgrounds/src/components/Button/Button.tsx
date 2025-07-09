import { component$, useStore,useSignal, useTask$ } from '@qwik.dev/core';

export default component$(() => {
  const store = useStore({
    count: 0,
  });
  const signal = useSignal('111');
  useTask$(({ track }) => {
    track(() => store.count);
    signal.value = '222'
  })
  return <button onClick$={() => {
    store.count++;
  }}>Click me {store.count}{signal.value}</button>;
});
