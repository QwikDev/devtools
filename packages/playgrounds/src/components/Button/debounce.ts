import { QRL, useSignal, $, useTask$ } from "@qwik.dev/core";

export const useDebouncer = (fn: QRL<(args: any) => void>, delay: number) => {
  const timeoutId = useSignal<number>(11);
  const timeout = useSignal<number>(11);
  useTask$(({ track }) => {
    track(() => timeout.value);
    
  })
  return $((args: any) => {
    clearTimeout(timeoutId.value);
    console.log('timeout', timeout.value);
    timeoutId.value = Number(setTimeout(() => fn(args), delay));
  });
};

// export const useDebouncer = implicit$FirstArg(useDebouncerx);