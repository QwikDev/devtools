import { component$, useSignal } from "@qwik.dev/core";

export const ExportCom = component$(() => {
  const signal = useSignal(0);
  return <div>11{signal.value}</div>;
});


export const ExportCom2 = component$(() => {
  const signal = useSignal(1);
  return <div>11{signal.value}</div>;
});
