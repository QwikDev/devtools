import { $, component$, useSignal, useStyles$ } from '@qwik.dev/core';
import { QGreetings } from './components/Tree';
import reactTreeCss from 'react-complex-tree/lib/style-modern.css?inline';
import styles from './styles.css?inline';

export interface ComponentStateStore {
  [key: string]: {
    type: 'signal' | 'store';
    value: any;
  };
}

export interface ComponentState {
  path: string;
  state: ComponentStateStore;
  type: string;
}

declare global {
  interface Window {
    __QWIK_DEVTOOLS__: {
      appState: Record<string, ComponentState>;
    };
  }
}

export const Components = component$(() => {
  useStyles$(reactTreeCss);
  useStyles$(styles);

  return (
    <div>
      <QGreetings />

      <ComponentsStore />
    </div>
  );
});

const ComponentsStore = component$(() => {
  const selectedComponent = useSignal<string | null>(null);
  const components = window.__QWIK_DEVTOOLS__.appState;
  const componentStore = Object.keys(components);

  const handleComponentSelected = $((key: string) => {
    selectedComponent.value = key;
  });

  return (
    <div>
      <select
        class="mt-2 w-1/2 rounded-md border border-border bg-transparent p-2 font-mono text-foreground"
        onChange$={(_, e) => handleComponentSelected(e.value)}
      >
        <option value="">Select component</option>
        {componentStore.map((key) => (
          <option key={key} value={key} class="p-2">
            {key}
          </option>
        ))}
      </select>

      {selectedComponent.value && (
        <ComponentStoreUpdate
          value={components[selectedComponent.value].state}
        />
      )}
    </div>
  );
});

const ComponentStoreUpdate = component$<{
  value: ComponentStateStore;
}>(({ value }) => {
  return (
    <div class="mt-2 flex w-1/2 flex-col font-mono text-foreground">
      {Object.keys(value).map((key) => {
        if (value[key].type === 'signal') {
          return (
            <div class="flex flex-col" key={key}>
              <h2 class="text-lg font-bold">Signal: {key}</h2>
              <input
                class="mt-2 rounded-md border border-border bg-transparent p-2 font-mono text-foreground"
                type={typeof value[key].value === 'string' ? 'text' : 'number'}
                bind:value={value[key].value}
              />
            </div>
          );
        }

        if (value[key].type === 'store') {
          return (
            <div class="flex flex-col" key={key}>
              <h2 class="text-lg font-bold">Store: {key}</h2>
              {Object.keys(value[key].value).map((storeKey) => (
                <div class="flex flex-col" key={storeKey}>
                  <h3 class="text-md font-bold">Key: {storeKey}</h3>
                  <input
                    class="mt-2 rounded-md border border-border bg-transparent p-2 font-mono text-foreground"
                    type={
                      typeof value[key].value[storeKey] === 'string'
                        ? 'text'
                        : 'number'
                    }
                    value={value[key].value[storeKey]}
                    onChange$={(_, e) => {
                      value[key].value[storeKey] =
                        typeof value[key].value[storeKey] === 'string'
                          ? e.value
                          : Number(e.value);
                    }}
                  />
                </div>
              ))}
            </div>
          );
        }
      })}
    </div>
  );
});
