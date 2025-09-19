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
  Resource,
  useAsyncComputed$,
  useSerializer$,
  useConstant,
  useOn,
  useServerData,
  useErrorBoundary,
} from '@qwik.dev/core';
import {
  _getDomContainer,
  isServer,
  useVisibleTask$,
} from '@qwik.dev/core/internal';
import type { QRL, Signal } from '@qwik.dev/core';
import {
  useLocation,
  useNavigate,
  Link,
  useContent,
  useDocumentHead,
} from '@qwik.dev/router';
import { useDebouncer } from './debounce';
const ButtonContext = createContextId<{ theme: string; size: string }>(
  'button-context',
);

interface ButtonProps {
  class?: string;
  onClick$?: QRL<() => void>;
  testValue: Signal<string>;
}

export default component$<ButtonProps>((props) => {
  const { class: className = '', onClick$ } = props;
  // External signal passed through props for demo purposes
  const testValueSignal = props.testValue;

  // Local reactive store used across examples
  const store = useStore({
    count: 0,
    dd: 12,
    cc: 33,
    aa: [1, 2, 3],
  });
  // Simple signal used by multiple examples
  const signal = useSignal<string>('111');
  const constantValue = useConstant(() => 'CONST');
  const serverData = useServerData<any>('demo-key');
  const errorBoundary = useErrorBoundary();
  const location = useLocation();
  const navigate = useNavigate();
  const content = useContent();
  const head = useDocumentHead();

  // Reactive task example: runs when dependencies change
  useTask$(({ track }) => {
    track(() => store.count);
    signal.value = '33333';
  });

  // Browser-only reactive task example
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => store.count);
    signal.value = '2227';
  });

  // Compute Qwik container only on the client
  const qwikContainer = useComputed$(() => {
    try {
      if (isServer) {
        return null;
      }
      const htmlElement = document.documentElement;
      return _getDomContainer(htmlElement);
    } catch (error) {
      console.error(error);
      return null;
    }
  });

  const asyncComputedValue = useAsyncComputed$(({ track }) =>
    Promise.resolve(track(signal) + 3),
  );

  // Provide and consume a simple context
  useContextProvider(ButtonContext, {
    theme: 'primary',
    size: 'large',
  });

  const context = useContext(ButtonContext);

  // Stable id example
  const buttonId = useId();

  // Event listeners on document/window/host
  useOnDocument(
    'keydown',
    $(() => {
      console.log('Document keydown event');
    }),
  );

  useOnWindow(
    'resize',
    $(() => {
      console.log('Window resized');
    }),
  );

  useOn(
    'click',
    $(() => {
      console.log('Host clicked');
    }),
  );

  // Async resource example (with pending/resolved/rejected states)
  const resourceData = useResource$(async ({ track }) => {
    track(() => store.count);
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      message: `Resource data for count: ${store.count}`,
      timestamp: Date.now(),
    };
  });

  // Custom serialization example
  const customSerialized = useSerializer$(() => ({
    deserialize: () => ({ n: store.count }),
    update: (current: { n: number }) => {
      current.n = store.count;
      return current;
    },
  }));

  // Global styles example
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

  // Scoped styles example
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

  // Debounce utility example
  const debounce = useDebouncer(
    $((value: string) => {
      signal.value = value;
    }),
    1000,
  );

  // Primary button click handler
  const handleClick = $(async () => {
    store.count++;
    console.log('Button clicked! Count:', store.count);
    debounce(String(store.count));
    if (onClick$) {
      await onClick$();
    }
  });

  // Navigation example handler
  const handleNavigateToAbout = $(() => navigate('/about'));

  return (
    <div>
      <button
        id={buttonId}
        class={`${className} custom-button scoped-button`}
        onClick$={handleClick}
      >
        Click me {store.count}
        {signal.value}
        {qwikContainer.value?.qManifestHash}
      </button>
      <button
        class={`custom-button scoped-button`}
        style="margin-left: 8px"
        onClick$={handleNavigateToAbout}
      >
        Go /about
      </button>
      <Link
        href="/blog"
        class={`scoped-button`}
        style="margin-left: 8px; padding: 8px 16px; display: inline-block; text-decoration: none;"
      >
        Go /blog
      </Link>
      {/* Info panel demonstrating various APIs */}
      <div style="margin-top: 10px; font-size: 12px; color: #666;">
        <div>Current Path: {location.url.pathname}</div>
        <div>Is Navigating: {location.isNavigating ? 'true' : 'false'}</div>
        <div>Params: {JSON.stringify(location.params)}</div>
        <div>
          Prev URL: {location.prevUrl ? location.prevUrl.pathname : '—'}
        </div>
        <div>Head Title: {head.title}</div>
        <div>Head Metas: {head.meta.length}</div>
        <div>Content Menu: {content.menu ? 'yes' : 'no'}</div>
        <div>
          Content Headings: {content.headings ? content.headings.length : 0}
        </div>
        <div>Async Computed: {asyncComputedValue.value}</div>
        <div>
          Context: {context.theme} - {context.size}
        </div>
        <div>Button ID: {buttonId}</div>
        <div>Constant: {constantValue}</div>
        {errorBoundary.error && <div>Error captured</div>}
        <div>ServerData: {serverData ? JSON.stringify(serverData) : 'N/A'}</div>
        <div>Serialized N: {customSerialized.value.n}</div>
        <Resource
          value={resourceData}
          onPending={() => <div>Loading resource...</div>}
          onResolved={(data) => <div>Resource: {data.message}</div>}
          onRejected={(error) => <div>Error: {error.message}</div>}
        />
        <div>
          Count: {store.count}, Signal: {signal.value}
        </div>
        <div>External Signal: {testValueSignal.value}</div>
      </div>
    </div>
  );
});
