import { component$ } from '@builder.io/qwik';

export const RightPanel = component$(() => {
  return (
    <div class="relative z-1 overflow-hidden">
      <div
        class="h-full grid"
        style="grid-template-columns: 100%; grid-template-rows: 1.75rem 1fr;"
      >
        <header class="relative p-l-4 flex items-center">
          <div class="content-empty absolute z-1 inset-x-0 top-full h-0.6px bg-panel-border"></div>
          <div class="relative z-1">
            <div
              class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
              style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
            ></div>
            <span class="flex items-center font-mono text-lg">
              <span class="tag_brackets text-component">Button</span>
            </span>
          </div>
          <div class="p-x-1 ml-auto flex items-center gap-x-1">
            <button
              title="Open component location"
              class="bg-gray-5 dark:bg-gray-4
    bg-opacity-0 dark:bg-opacity-0
    hover:bg-opacity-10 selected:hover:bg-opacity-10
    active:bg-opacity-05 active:hover:bg-opacity-05 selected:bg-opacity-05
    transition-colors text-gray-5 dark:text-gray-4
    text-opacity-85 dark:text-opacity-85
    hover:text-opacity-100 selected:text-opacity-100 w-6 h-6 rounded center-child"
            >
              <svg class="w-4 h-4">
                <use href="#sdt_icon_Code"></use>
              </svg>
            </button>
            <button
              title="Close inspector"
              class="bg-gray-5 dark:bg-gray-4
    bg-opacity-0 dark:bg-opacity-0
    hover:bg-opacity-10 selected:hover:bg-opacity-10
    active:bg-opacity-05 active:hover:bg-opacity-05 selected:bg-opacity-05
    transition-colors text-gray-5 dark:text-gray-4
    text-opacity-85 dark:text-opacity-85
    hover:text-opacity-100 selected:text-opacity-100 w-6 h-6 rounded center-child"
            >
              <svg class="w-4 h-4">
                <use href="#sdt_icon_Close"></use>
              </svg>
            </button>
          </div>
          <div
            role="group"
            class="b-l b-solid b-panel-2 h-full flex items-stretch divide-x divide-solid divide-panel-2"
          >
            <button
              title="inspector"
              class="group relative p-x-2.5 center-child gap-x-1.5 outline-unset transition text-text"
              style="--toggle-tab-color: var(--default-text-color);"
            >
              <div
                class="absolute inset-0 -z-1 transition opacity-0 group-hover:opacity-20 group-focus:opacity-20"
                style="background: radial-gradient(circle at 50% 130%, var(--toggle-tab-color), transparent 70%);"
              ></div>
              Inspector
            </button>
            <button
              title="dgraph"
              class="group relative p-x-2.5 center-child gap-x-1.5 outline-unset transition text-disabled"
              style="--toggle-tab-color: var(--default-text-color);"
            >
              <div
                class="absolute inset-0 -z-1 transition opacity-0 group-hover:opacity-20 group-focus:opacity-20"
                style="background: radial-gradient(circle at 50% 130%, var(--toggle-tab-color), transparent 70%);"
              ></div>
              Graph
            </button>
          </div>
        </header>
        <div class="custom_scrollbar relative z-0 w-full h-full overflow-auto overflow-overlay overscroll-none">
          <div class="absolute inset-0 z-1 pointer-events-none"></div>
          <div class="relative min-w-full min-h-full w-max h-max overflow-hidden">
            <div class="min-w-full w-fit p-4 p-b-14 flex flex-col gap-y-4">
              <div>
                <h2 class="text-disabled mb-1 capitalize">Props </h2>
                <ul>
                  <li class="relative z-1 flex flex-wrap items-start p-l-2ch font-mono leading-inspector_row">
                    <div class="absolute mt-.25 -inset-y-.25 -inset-x-1 b b-solid b-dom rounded opacity-30"></div>
                    <div class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity b b-solid b-highlight-border opacity-0"></div>
                    <div class="flex items-center">
                      <div class='h-inspector_row min-w-5ch mr-2ch select-none font-mono text-text-light after:content-[":"] after:color-disabled'>
                        <div class="relative z-1 inline-block">
                          <div
                            class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
                            style="--highlight_color_var: #f59e0b; --highlight_opacity_var: 0;"
                          ></div>
                          onClick
                        </div>
                      </div>
                    </div>
                    <span class="h-inspector_row font-500 font-italic">
                      f onClick()
                    </span>
                  </li>
                  <li class="relative z-1 flex flex-wrap items-start p-l-2ch font-mono leading-inspector_row opacity-60">
                    <div class="absolute mt-.25 -inset-y-.25 -inset-x-1 b b-solid b-dom rounded opacity-0"></div>
                    <div class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity b b-solid b-highlight-border opacity-0"></div>
                    <div class="flex items-center">
                      <div class='h-inspector_row min-w-5ch mr-2ch select-none font-mono text-dom after:content-[":"] after:color-disabled'>
                        <div class="relative z-1 inline-block">
                          <div
                            class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
                            style="--highlight_color_var: #f59e0b; --highlight_opacity_var: 0;"
                          ></div>
                          text
                        </div>
                      </div>
                    </div>
                    <span class="h-inspector_row font-500 color-disabled">
                      unknown
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h2 class="text-disabled mb-1 capitalize">Memos</h2>
                <ul>
                  <li class="relative z-1 flex flex-wrap items-start p-l-2ch font-mono leading-inspector_row">
                    <div class="absolute mt-.25 -inset-y-.25 -inset-x-1 b b-solid b-dom rounded opacity-0"></div>
                    <div class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity b b-solid b-highlight-border opacity-0"></div>
                    <div class="absolute z-2 top-0 right-2 h-inspector_row flex justify-end items-center transition-opacity opacity-0">
                      <button class="center-child" title="Open in Graph panel">
                        <svg class="h-4 w-4">
                          <use href="#sdt_icon_Graph"></use>
                        </svg>
                      </button>
                    </div>
                    <div class="flex items-center">
                      <div class='h-inspector_row min-w-5ch mr-2ch select-none font-mono text-dom after:content-[":"] after:color-disabled'>
                        <div class="relative z-1 inline-block">
                          <div
                            class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
                            style="--highlight_color_var: #f59e0b; --highlight_opacity_var: 0;"
                          ></div>
                          text
                        </div>
                      </div>
                    </div>
                    <span class="value_element_container h-inspector_row font-500 text-dom">
                      <div class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"></div>
                      span
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h2 class="text-disabled mb-1 capitalize">Component</h2>
                <li class="relative z-1 flex flex-wrap items-start p-l-2ch font-mono leading-inspector_row">
                  <div class="absolute mt-.25 -inset-y-.25 -inset-x-1 b b-solid b-dom rounded opacity-0"></div>
                  <div class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity b b-solid b-highlight-border opacity-0"></div>
                  <div class="flex items-center">
                    <div class='h-inspector_row min-w-5ch mr-2ch select-none font-mono text-dom after:content-[":"] after:color-disabled'>
                      <div class="relative z-1 inline-block">
                        <div
                          class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
                          style="--highlight_color_var: #f59e0b; --highlight_opacity_var: 0;"
                        ></div>
                        value
                      </div>
                    </div>
                  </div>
                  <span class="value_element_container h-inspector_row font-500 text-dom">
                    <div class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"></div>
                    button
                  </span>
                </li>
                <li class="relative z-1 flex flex-wrap items-start p-l-2ch font-mono leading-inspector_row">
                  <div class="absolute mt-.25 -inset-y-.25 -inset-x-1 b b-solid b-dom rounded opacity-0"></div>
                  <div class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity b b-solid b-highlight-border opacity-0"></div>
                  <div class="absolute z-2 top-0 right-2 h-inspector_row flex justify-end items-center transition-opacity opacity-0">
                    <button
                      class="center-child"
                      title="Open component location"
                    >
                      <svg class="h-4 w-4">
                        <use href="#sdt_icon_Code"></use>
                      </svg>
                    </button>
                  </div>
                  <div class="flex items-center">
                    <div class='h-inspector_row min-w-5ch mr-2ch select-none font-mono text-text-light after:content-[":"] after:color-disabled'>
                      <div class="relative z-1 inline-block">
                        <div
                          class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
                          style="--highlight_color_var: #f59e0b; --highlight_opacity_var: 0;"
                        ></div>
                        location
                      </div>
                    </div>
                  </div>
                  <span class="string_value h-inspector_row font-500 min-h-inspector_row h-fit max-w-fit text-green">
                    src/App.tsx
                  </span>
                </li>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
