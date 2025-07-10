import { component$, useStore,useSignal, useTask$, useComputed$, $ } from '@qwik.dev/core';
import { _getDomContainer, useVisibleTask$ } from '@qwik.dev/core/internal';
import type { QRL } from '@qwik.dev/core';

interface ButtonProps {
  class?: string;
  onClick$?: QRL<() => void>;
}

export default component$<ButtonProps>(({ class: className = '', onClick$ }) => {
  const store = useStore({
    count: 0,
  });
  const signal = useSignal('111');
  useTask$(({ track }) => {
    track(() => store.count);
    signal.value = '33333'
  })

  useVisibleTask$(({ track }) => {
    track(() => store.count);
    signal.value = '2227'
  })
  const qwikContainer = useComputed$(() => {
    try {
      const htmlElement = document.documentElement;
      return _getDomContainer(htmlElement);
    } catch (error) {
      console.error(error);
      return null;
    }
  });

  const handleClick = $(async () => {
    store.count++;
    console.log('Button clicked! Count:', store.count);
    
    // 调用用户传递的自定义点击事件
    if (onClick$) {
      await onClick$();
    }
  });

  return <button 
    class={className}
    onClick$={handleClick}
  >
    Click me {store.count}{signal.value}{qwikContainer?.value?.qManifestHash}
  </button>;
});
