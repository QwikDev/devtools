import { component$, useContext } from '@builder.io/qwik';
import { DevToolContext } from '../app';

export const RightPanel = component$(() => {
  const store = useContext(DevToolContext);

  return store.selectedComponent ? (
    <div class="relative z-1 overflow-hidden">
      <div
        class="h-full grid"
        style="grid-template-columns: 100%; grid-template-rows: 3rem 1fr 0.5rem;"
      >
        <header class="relative py-4 flex items-center justify-center">
          <div class="content-empty absolute z-1 inset-x-0 top-full h-0.6px bg-panel-border"></div>
          <div class="relative z-1">
            <div
              class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
              style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
            ></div>
            <span class="flex items-center font-mono text-xl">
              <span class="tag_brackets text-component">
                {store.selectedComponent}
              </span>
            </span>
          </div>
        </header>
        <div class="custom_scrollbar relative z-0 w-full h-full overflow-auto overflow-overlay overscroll-none">
          <div class="absolute inset-0 z-1 pointer-events-none"></div>
          <div class="relative min-w-full min-h-full w-max h-max overflow-hidden">
            <div class="min-w-full w-fit p-4 p-b-14 flex flex-col gap-y-4">
              <div>
                <h2 class="text-disabled mb-1 capitalize text-lg">Props</h2>
                <ul class="text-lg">
                  {store.qwikJson.ctx[store.selectedComponent]?.props &&
                    Object.entries(
                      store.qwikJson.ctx[store.selectedComponent].props
                    ).map(([key, prop], i) => {
                      console.log(key, prop);
                      return (
                        <li
                          key={i}
                          class="relative z-1 flex flex-wrap items-start p-l-2ch font-mono leading-inspector_row pb-2"
                        >
                          <div class="flex items-center">
                            <div class='min-w-5ch mr-2ch select-none font-mono text-dom after:content-[":"] after:color-disabled'>
                              <div class="relative z-1 inline-block">
                                <div
                                  class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
                                  style="--highlight_color_var: #f59e0b; --highlight_opacity_var: 0;"
                                ></div>
                                {key}
                              </div>
                            </div>
                          </div>
                          <span class="value_element_container font-500 text-dom" style="width: 300px">
                            <div class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"></div>
                            {(prop as any).__value || ''}
                            {Object.keys(prop as any).includes('fn') ? 'foo' : ''}
                          </span>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
});
