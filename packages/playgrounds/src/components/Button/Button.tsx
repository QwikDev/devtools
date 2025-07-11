import { 
  component$, 
  useStore,
  useSignal, 
  useTask$, 
  useComputed$, 
  $,
  useContext,
  useContextProvider,
  useId,
  useOnDocument,
  useOnWindow,
  useResource$,
  useStyles$,
  useStylesScoped$,
  createContextId,
  Resource
} from '@qwik.dev/core';
import { _getDomContainer, isServer, useVisibleTask$ } from '@qwik.dev/core/internal';
import type { QRL } from '@qwik.dev/core';

// 创建上下文
const ButtonContext = createContextId<{ theme: string; size: string }>('button-context');

interface ButtonProps {
  class?: string;
  onClick$?: QRL<() => void>;
}

export default component$<ButtonProps>(({ class: className = '', onClick$ }) => {
  // 已有的hooks
  const store = useStore({
    count: 0,
  });
  const signal = useSignal('111');
  
  // useTask$ - 已有
  useTask$(({ track }) => {
    track(() => store.count);
    signal.value = '33333'
  })

  // useVisibleTask$ - 已有
  useVisibleTask$(({ track }) => {
    track(() => store.count);
    signal.value = '2227'
  })

  // useComputed$ - 已有
  const qwikContainer = useComputed$(() => {
    try {
      if(isServer){
        return null
      }
      const htmlElement = document.documentElement;
      return _getDomContainer(htmlElement);
    } catch (error) {
      console.error(error);
      return null;
    }
  });

  // 新增的hooks示例

  // 模拟异步计算（useAsyncComputed$不存在，用useComputed$模拟）
  const asyncComputedValue = useComputed$(() => {
    return `Async computed: ${store.count}`;
  });

  // useContext & useContextProvider
  useContextProvider(ButtonContext, {
    theme: 'primary',
    size: 'large'
  });
  const context = useContext(ButtonContext);

  // useId
  const buttonId = useId();

  // useOnDocument
  useOnDocument('keydown', $(() => {
    console.log('Document keydown event');
  }));

  // useOnWindow
  useOnWindow('resize', $(() => {
    console.log('Window resized');
  }));

  // useResource$
  const resourceData = useResource$(async ({ track }) => {
    track(() => store.count);
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      message: `Resource data for count: ${store.count}`,
      timestamp: Date.now()
    };
  });

  // useStyles$
  useStyles$(`
    .custom-button {
      background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .custom-button:hover {
      transform: scale(1.05);
    }
  `);

  // useStylesScoped$
  useStylesScoped$(`
    .scoped-button {
      background: linear-gradient(45deg, #667eea, #764ba2);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 3px;
      cursor: pointer;
    }
  `);

  const handleClick = $(async () => {
    store.count++;
    console.log('Button clicked! Count:', store.count);
    
    // 调用用户传递的自定义点击事件
    if (onClick$) {
      await onClick$();
    }
  });

  return (
    <div>
      <button 
        id={buttonId}
        class={`${className} custom-button scoped-button`}
        onClick$={handleClick}
      >
        Click me {store.count}{signal.value}{qwikContainer?.value?.qManifestHash}
      </button>
      
      {/* 显示各种hooks的结果 */}
      <div style="margin-top: 10px; font-size: 12px; color: #666;">
        <div>Async Computed: {asyncComputedValue.value}</div>
        <div>Context: {context?.theme} - {context?.size}</div>
        <div>Button ID: {buttonId}</div>
        <Resource
          value={resourceData}
          onPending={() => <div>Loading resource...</div>}
          onResolved={(data) => <div>Resource: {data.message}</div>}
          onRejected={(error) => <div>Error: {error.message}</div>}
        />
        <div>Count: {store.count}, Signal: {signal.value}</div>
      </div>
    </div>
  );
});
