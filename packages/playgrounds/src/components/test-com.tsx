import { component$, useSignal } from "@qwik.dev/core";

export default component$(() => {
  const signal = useSignal(1);
  return <div>11{signal.value}</div>;
});
