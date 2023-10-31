import { component$, useStylesScoped$ } from '@builder.io/qwik';
import styles from './app.css?inline';
import { QwikIcon } from './components/QwikIcon';

export const App = component$(() => {
  useStylesScoped$(styles);
  return (
    <div class="devtools-root">
      <div
        class="h-full w-full overflow-hidden grid text-base font-sans bg-panel-bg text-text"
        style="grid-template-rows: 2.5rem 1fr;"
      >
        <header class="p-2 flex items-center gap-x-2 bg-panel-bg b-b b-solid b-panel-border text-text">
          <div class="flex items-center gap-x-2">
            <QwikIcon width={18} height={18} />
            <div>
              <h3>Qwik Developer Tools</h3>
              <p class="text-disabled font-mono text-sm">overlay</p>
            </div>
          </div>
        </header>
        <div class="overflow-hidden">
          <div
            class="grid grid-auto-flow-col h-full w-full"
            style="grid-template-columns: minmax(8rem, 50%) 1px minmax(8rem, 1fr);"
          >
            <div class="relative z-1 overflow-hidden">
              <div
                class="relative h-full w-full overflow-hidden grid"
                style="grid-template-columns: 100%; grid-template-rows: 1.75rem 1fr 1.125rem;"
              >
                <div class="relative flex items-stretch">
                  <div class="content-empty absolute z-1 inset-x-0 top-full h-0.6px bg-panel-border"></div>
                  <button
                    class="shrink-0 w-7 h-7 toggle-button"
                    aria-selected="false"
                  >
                    <svg class="w-4 h-4">
                      <use href="#sdt_icon_Select"></use>
                    </svg>
                  </button>
                  <form
                    class="bg-gray-5 dark:bg-gray-4
    bg-opacity-0 dark:bg-opacity-0
    hover:bg-opacity-10 selected:hover:bg-opacity-10
    active:bg-opacity-05 active:hover:bg-opacity-05 selected:bg-opacity-05
    transition-colors group b-x b-solid b-panel-2 grow relative overflow-hidden"
                  >
                    <input
                      class="w-full text-lg p-x-6 transition-padding leading-9 placeholder:text-disabled group-focus-within:p-l-2"
                      type="text"
                      placeholder="Search"
                      style="height: 1.75rem;"
                    />
                    <div class="edge-container-base absolute inset-y-1 center-child pointer-events-none left-0 p-l-1.5 transition-transform group-focus-within:-translate-x-full">
                      <svg class="w-3.5 h-3.5 color-disabled">
                        <use href="#sdt_icon_Search"></use>
                      </svg>
                    </div>
                  </form>
                  <div class="ml-auto h-full">
                    <div
                      role="group"
                      class="h-full flex items-stretch divide-x divide-solid divide-panel-2"
                    >
                      <button
                        title="components"
                        class="group group relative p-x-2.5 center-child gap-x-1.5 outline-unset transition text-text"
                        style="--toggle-tab-color: var(--component-color);"
                      >
                        <div
                          class="absolute inset-0 -z-1 transition opacity-0 group-hover:opacity-20 group-focus:opacity-20"
                          style="background: radial-gradient(circle at 50% 130%, var(--toggle-tab-color), transparent 70%);"
                        ></div>
                        <div
                          class="w-2 h-2 rounded-full border border-solid opacity-60 transition-opacity group-hover:opacity-100 group-focus:opacity-100 group-[[aria-selected=true]]:opacity-100"
                          style="border-color: var(--toggle-tab-color);"
                        ></div>
                        Components
                      </button>
                      <button
                        title="owners"
                        class="group group relative p-x-2.5 center-child gap-x-1.5 outline-unset transition text-disabled"
                        style="--toggle-tab-color: var(--default-text-color);"
                      >
                        <div
                          class="absolute inset-0 -z-1 transition opacity-0 group-hover:opacity-20 group-focus:opacity-20"
                          style="background: radial-gradient(circle at 50% 130%, var(--toggle-tab-color), transparent 70%);"
                        ></div>
                        <div
                          class="w-2 h-2 rounded-full border border-solid opacity-60 transition-opacity group-hover:opacity-100 group-focus:opacity-100 group-[[aria-selected=true]]:opacity-100"
                          style="border-color: var(--toggle-tab-color);"
                        ></div>
                        Owners
                      </button>
                      <button
                        title="dom"
                        class="group group relative p-x-2.5 center-child gap-x-1.5 outline-unset transition text-disabled"
                        style="--toggle-tab-color: var(--dom-color);"
                      >
                        <div
                          class="absolute inset-0 -z-1 transition opacity-0 group-hover:opacity-20 group-focus:opacity-20"
                          style="background: radial-gradient(circle at 50% 130%, var(--toggle-tab-color), transparent 70%);"
                        ></div>
                        <div
                          class="w-2 h-2 rounded-full border border-solid opacity-60 transition-opacity group-hover:opacity-100 group-focus:opacity-100 group-[[aria-selected=true]]:opacity-100"
                          style="border-color: var(--toggle-tab-color);"
                        ></div>
                        DOM
                      </button>
                    </div>
                  </div>
                </div>
                <div class="custom_scrollbar relative z-0 w-full h-full overflow-auto overflow-overlay overscroll-none">
                  <div class="absolute inset-0 z-1 pointer-events-none"></div>
                  <div class="relative min-w-full min-h-full w-max h-max overflow-hidden">
                    <div
                      class="box-content"
                      style="padding: 1.125rem 0px; height: calc(42.75rem);"
                    >
                      <div style="transform: translateY(calc(0rem));">
                        <div style="transition: margin-left 300ms ease 0s; margin-left: calc(0rem);">
                          <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
                            <div
                              class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
                              style="opacity: 0;"
                            ></div>
                            <div
                              class="relative -z-2 ml-3.5"
                              style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(0.5rem);"
                            ></div>
                            <div class="relative flex items-center gap-x-2 min-w-36">
                              <button
                                class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
                    before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
                    before:bg-white dark:before:bg-gray-800 before:transition-background-color
                    hover:before:bg-panel-2"
                                aria-selected="false"
                                style="left: -1.125rem;"
                              >
                                <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
                                  <use href="#sdt_icon_Triangle"></use>
                                </svg>
                              </button>
                              <div class="relative z-1">
                                <div
                                  class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
                                  style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
                                ></div>
                                <span class="flex items-center font-mono text-base">
                                  <svg class="w-3 h-3 mr-1 -mb-2px text-disabled">
                                    <use href="#sdt_icon_Root"></use>
                                  </svg>
                                  <span class="text-.8em select-none text-disabled">
                                    Root
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
                            <div
                              class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
                              style="opacity: 0;"
                            ></div>
                            <div
                              class="relative -z-2 ml-3.5"
                              style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(0.5rem);"
                            ></div>
                            <div class="relative flex items-center gap-x-2 min-w-36">
                              <button
                                class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
                    before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
                    before:bg-white dark:before:bg-gray-800 before:transition-background-color
                    hover:before:bg-panel-2"
                                aria-selected="false"
                                style="left: -1.125rem;"
                              >
                                <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
                                  <use href="#sdt_icon_Triangle"></use>
                                </svg>
                              </button>
                              <div class="relative z-1">
                                <div
                                  class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
                                  style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
                                ></div>
                                <span class="flex items-center font-mono text-base">
                                  <svg class="w-3 h-3 mr-1 -mb-2px text-disabled">
                                    <use href="#sdt_icon_Root"></use>
                                  </svg>
                                  <span class="text-.8em select-none text-disabled">
                                    Root
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
                            <div
                              class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
                              style="opacity: 0;"
                            ></div>
                            <div
                              class="relative -z-2 ml-3.5"
                              style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(1.375rem);"
                            ></div>
                            <div class="relative flex items-center gap-x-2 min-w-36">
                              <button
                                class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
                    before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
                    before:bg-white dark:before:bg-gray-800 before:transition-background-color
                    hover:before:bg-panel-2"
                                aria-selected="false"
                                style="left: -1.125rem;"
                              >
                                <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
                                  <use href="#sdt_icon_Triangle"></use>
                                </svg>
                              </button>
                              <div class="relative z-1">
                                <div
                                  class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
                                  style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
                                ></div>
                                <span class="flex items-center font-mono text-base">
                                  <span class="tag_brackets text-component">
                                    Main
                                  </span>
                                </span>
                              </div>
                              <div class="inline-block p-x-1 bg-cyan-600 bg-opacity-20 rounded text-cyan-600 uppercase font-700 text-2.5 select-none">
                                HMR
                              </div>
                            </div>
                          </div>
                          <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
                            <div
                              class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
                              style="opacity: 0;"
                            ></div>
                            <div
                              class="relative -z-2 ml-3.5"
                              style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(2.25rem);"
                            ></div>
                            <div class="relative flex items-center gap-x-2 min-w-36">
                              <button
                                class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
                    before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
                    before:bg-white dark:before:bg-gray-800 before:transition-background-color
                    hover:before:bg-panel-2"
                                aria-selected="false"
                                style="left: -1.125rem;"
                              >
                                <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
                                  <use href="#sdt_icon_Triangle"></use>
                                </svg>
                              </button>
                              <div class="relative z-1">
                                <div
                                  class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
                                  style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
                                ></div>
                                <span class="flex items-center font-mono text-base">
                                  <span class="tag_brackets text-component">
                                    ThemeProvider
                                  </span>
                                </span>
                              </div>
                              <div class="inline-block p-x-1 bg-cyan-600 bg-opacity-20 rounded text-cyan-600 uppercase font-700 text-2.5 select-none">
                                HMR
                              </div>
                            </div>
                          </div>
                          <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
                            <div
                              class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
                              style="opacity: 0;"
                            ></div>
                            <div
                              class="relative -z-2 ml-3.5"
                              style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(3.125rem);"
                            ></div>
                            <div class="relative flex items-center gap-x-2 min-w-36">
                              <button
                                class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
                    before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
                    before:bg-white dark:before:bg-gray-800 before:transition-background-color
                    hover:before:bg-panel-2"
                                aria-selected="false"
                                style="left: -1.125rem;"
                              >
                                <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
                                  <use href="#sdt_icon_Triangle"></use>
                                </svg>
                              </button>
                              <div class="relative z-1">
                                <div
                                  class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
                                  style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
                                ></div>
                                <span class="flex items-center font-mono text-base">
                                  <svg class="w-3 h-3 mr-1 -mb-2px text-disabled">
                                    <use href="#sdt_icon_Context"></use>
                                  </svg>
                                  <span class="text-.8em select-none text-disabled">
                                    Context
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
                            <div
                              class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
                              style="opacity: 0;"
                            ></div>
                            <div
                              class="relative -z-2 ml-3.5"
                              style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(4rem);"
                            ></div>
                            <div class="relative flex items-center gap-x-2 min-w-36">
                              <button
                                class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
                    before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
                    before:bg-white dark:before:bg-gray-800 before:transition-background-color
                    hover:before:bg-panel-2"
                                aria-selected="false"
                                style="left: -1.125rem;"
                              >
                                <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
                                  <use href="#sdt_icon_Triangle"></use>
                                </svg>
                              </button>
                              <div class="relative z-1">
                                <div
                                  class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
                                  style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
                                ></div>
                                <span class="flex items-center font-mono text-base">
                                  <span class="tag_brackets text-component">
                                    App
                                  </span>
                                </span>
                              </div>
                              <div class="inline-block p-x-1 bg-cyan-600 bg-opacity-20 rounded text-cyan-600 uppercase font-700 text-2.5 select-none">
                                HMR
                              </div>
                            </div>
                          </div>
                          <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
                            <div
                              class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
                              style="opacity: 0.45;"
                            ></div>
                            <div
                              class="relative -z-2 ml-3.5"
                              style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(4.875rem);"
                            ></div>
                            <div class="relative flex items-center gap-x-2 min-w-36">
                              <button
                                class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
                    before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
                    before:bg-white dark:before:bg-gray-800 before:transition-background-color
                    hover:before:bg-panel-2"
                                aria-selected="false"
                                style="left: -1.125rem; opacity: 1;"
                              >
                                <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
                                  <use href="#sdt_icon_Triangle"></use>
                                </svg>
                              </button>
                              <div class="relative z-1">
                                <div
                                  class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
                                  style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
                                ></div>
                                <span class="flex items-center font-mono text-base">
                                  <span class="tag_brackets text-component">
                                    Button
                                  </span>
                                </span>
                              </div>
                              <div class="inline-block p-x-1 bg-cyan-600 bg-opacity-20 rounded text-cyan-600 uppercase font-700 text-2.5 select-none">
                                HMR
                              </div>
                            </div>
                          </div>
                          <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
                            <div
                              class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
                              style="opacity: 0;"
                            ></div>
                            <div
                              class="relative -z-2 ml-3.5"
                              style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(4.875rem);"
                            ></div>
                            <div class="relative flex items-center gap-x-2 min-w-36">
                              <button
                                class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
                    before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
                    before:bg-white dark:before:bg-gray-800 before:transition-background-color
                    hover:before:bg-panel-2"
                                aria-selected="false"
                                style="left: -1.125rem;"
                              >
                                <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
                                  <use href="#sdt_icon_Triangle"></use>
                                </svg>
                              </button>
                              <div class="relative z-1">
                                <div
                                  class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
                                  style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
                                ></div>
                                <span class="flex items-center font-mono text-base">
                                  <span class="tag_brackets text-component">
                                    Button
                                  </span>
                                </span>
                              </div>
                              <div class="inline-block p-x-1 bg-cyan-600 bg-opacity-20 rounded text-cyan-600 uppercase font-700 text-2.5 select-none">
                                HMR
                              </div>
                            </div>
                          </div>
                          <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
                            <div
                              class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
                              style="opacity: 0;"
                            ></div>
                            <div
                              class="relative -z-2 ml-3.5"
                              style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(4.875rem);"
                            ></div>
                            <div class="relative flex items-center gap-x-2 min-w-36">
                              <button
                                class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
                    before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
                    before:bg-white dark:before:bg-gray-800 before:transition-background-color
                    hover:before:bg-panel-2"
                                aria-selected="false"
                                style="left: -1.125rem;"
                              >
                                <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
                                  <use href="#sdt_icon_Triangle"></use>
                                </svg>
                              </button>
                              <div class="relative z-1">
                                <div
                                  class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
                                  style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
                                ></div>
                                <span class="flex items-center font-mono text-base">
                                  <span class="tag_brackets text-component">
                                    Show
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
                            <div
                              class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
                              style="opacity: 0;"
                            ></div>
                            <div
                              class="relative -z-2 ml-3.5"
                              style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(5.75rem);"
                            ></div>
                            <div class="relative flex items-center gap-x-2 min-w-36">
                              <button
                                class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
                    before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
                    before:bg-white dark:before:bg-gray-800 before:transition-background-color
                    hover:before:bg-panel-2"
                                aria-selected="false"
                                style="left: -1.125rem;"
                              >
                                <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
                                  <use href="#sdt_icon_Triangle"></use>
                                </svg>
                              </button>
                              <div class="relative z-1">
                                <div
                                  class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
                                  style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
                                ></div>
                                <span class="flex items-center font-mono text-base">
                                  <span class="tag_brackets text-component">
                                    unknown
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
                            <div
                              class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
                              style="opacity: 0;"
                            ></div>
                            <div
                              class="relative -z-2 ml-3.5"
                              style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(6.625rem);"
                            ></div>
                            <div class="relative flex items-center gap-x-2 min-w-36">
                              <button
                                class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
                    before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
                    before:bg-white dark:before:bg-gray-800 before:transition-background-color
                    hover:before:bg-panel-2"
                                aria-selected="false"
                                style="left: -1.125rem;"
                              >
                                <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
                                  <use href="#sdt_icon_Triangle"></use>
                                </svg>
                              </button>
                              <div class="relative z-1">
                                <div
                                  class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
                                  style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
                                ></div>
                                <span class="flex items-center font-mono text-base">
                                  <span class="tag_brackets text-component">
                                    Bold
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
                            <div
                              class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
                              style="opacity: 0;"
                            ></div>
                            <div
                              class="relative -z-2 ml-3.5"
                              style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(4.875rem);"
                            ></div>
                            <div class="relative flex items-center gap-x-2 min-w-36">
                              <button
                                class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
                    before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
                    before:bg-white dark:before:bg-gray-800 before:transition-background-color
                    hover:before:bg-panel-2"
                                aria-selected="false"
                                style="left: -1.125rem;"
                              >
                                <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
                                  <use href="#sdt_icon_Triangle"></use>
                                </svg>
                              </button>
                              <div class="relative z-1">
                                <div
                                  class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
                                  style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
                                ></div>
                                <span class="flex items-center font-mono text-base">
                                  <span class="tag_brackets text-component">
                                    ErrorBoundary
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
                            <div
                              class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
                              style="opacity: 0;"
                            ></div>
                            <div
                              class="relative -z-2 ml-3.5"
                              style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(5.75rem);"
                            ></div>
                            <div class="relative flex items-center gap-x-2 min-w-36">
                              <button
                                class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
                    before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
                    before:bg-white dark:before:bg-gray-800 before:transition-background-color
                    hover:before:bg-panel-2"
                                aria-selected="false"
                                style="left: -1.125rem;"
                              >
                                <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
                                  <use href="#sdt_icon_Triangle"></use>
                                </svg>
                              </button>
                              <div class="relative z-1">
                                <div
                                  class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
                                  style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
                                ></div>
                                <span class="flex items-center font-mono text-base">
                                  <span class="tag_brackets text-component">
                                    Show
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
                            <div
                              class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
                              style="opacity: 0;"
                            ></div>
                            <div
                              class="relative -z-2 ml-3.5"
                              style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(4.875rem);"
                            ></div>
                            <div class="relative flex items-center gap-x-2 min-w-36">
                              <button
                                class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
                    before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
                    before:bg-white dark:before:bg-gray-800 before:transition-background-color
                    hover:before:bg-panel-2"
                                aria-selected="false"
                                style="left: -1.125rem;"
                              >
                                <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
                                  <use href="#sdt_icon_Triangle"></use>
                                </svg>
                              </button>
                              <div class="relative z-1">
                                <div
                                  class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
                                  style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
                                ></div>
                                <span class="flex items-center font-mono text-base">
                                  <span class="tag_brackets text-component">
                                    DynamicSpreadParent
                                  </span>
                                </span>
                              </div>
                              <div class="inline-block p-x-1 bg-cyan-600 bg-opacity-20 rounded text-cyan-600 uppercase font-700 text-2.5 select-none">
                                HMR
                              </div>
                            </div>
                          </div>
                          <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
                            <div
                              class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
                              style="opacity: 0;"
                            ></div>
                            <div
                              class="relative -z-2 ml-3.5"
                              style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(5.75rem);"
                            ></div>
                            <div class="relative flex items-center gap-x-2 min-w-36">
                              <button
                                class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
                    before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
                    before:bg-white dark:before:bg-gray-800 before:transition-background-color
                    hover:before:bg-panel-2"
                                aria-selected="false"
                                style="left: -1.125rem;"
                              >
                                <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
                                  <use href="#sdt_icon_Triangle"></use>
                                </svg>
                              </button>
                              <div class="relative z-1">
                                <div
                                  class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
                                  style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
                                ></div>
                                <span class="flex items-center font-mono text-base">
                                  <span class="tag_brackets text-component">
                                    DynamicSpreadChild
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
                            <div
                              class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
                              style="opacity: 0;"
                            ></div>
                            <div
                              class="relative -z-2 ml-3.5"
                              style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(4.875rem);"
                            ></div>
                            <div class="relative flex items-center gap-x-2 min-w-36">
                              <button
                                class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
                    before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
                    before:bg-white dark:before:bg-gray-800 before:transition-background-color
                    hover:before:bg-panel-2"
                                aria-selected="false"
                                style="left: -1.125rem;"
                              >
                                <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
                                  <use href="#sdt_icon_Triangle"></use>
                                </svg>
                              </button>
                              <div class="relative z-1">
                                <div
                                  class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
                                  style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
                                ></div>
                                <span class="flex items-center font-mono text-base">
                                  <span class="tag_brackets text-component">
                                    Article
                                  </span>
                                </span>
                              </div>
                              <div class="inline-block p-x-1 bg-cyan-600 bg-opacity-20 rounded text-cyan-600 uppercase font-700 text-2.5 select-none">
                                HMR
                              </div>
                            </div>
                          </div>
                          <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
                            <div
                              class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
                              style="opacity: 0;"
                            ></div>
                            <div
                              class="relative -z-2 ml-3.5"
                              style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(5.75rem);"
                            ></div>
                            <div class="relative flex items-center gap-x-2 min-w-36">
                              <button
                                class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
                    before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
                    before:bg-white dark:before:bg-gray-800 before:transition-background-color
                    hover:before:bg-panel-2"
                                aria-selected="false"
                                style="left: -1.125rem;"
                              >
                                <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
                                  <use href="#sdt_icon_Triangle"></use>
                                </svg>
                              </button>
                              <div class="relative z-1">
                                <div
                                  class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
                                  style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
                                ></div>
                                <span class="flex items-center font-mono text-base">
                                  <span class="tag_brackets text-component">
                                    Suspense
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
                            <div
                              class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
                              style="opacity: 0;"
                            ></div>
                            <div
                              class="relative -z-2 ml-3.5"
                              style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(6.625rem);"
                            ></div>
                            <div class="relative flex items-center gap-x-2 min-w-36">
                              <button
                                class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
                    before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
                    before:bg-white dark:before:bg-gray-800 before:transition-background-color
                    hover:before:bg-panel-2"
                                aria-selected="false"
                                style="left: -1.125rem;"
                              >
                                <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
                                  <use href="#sdt_icon_Triangle"></use>
                                </svg>
                              </button>
                              <div class="relative z-1">
                                <div
                                  class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
                                  style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
                                ></div>
                                <span class="flex items-center font-mono text-base">
                                  <svg class="w-3 h-3 mr-1 -mb-2px text-disabled">
                                    <use href="#sdt_icon_Context"></use>
                                  </svg>
                                  <span class="text-.8em select-none text-disabled">
                                    Context
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
                            <div
                              class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
                              style="opacity: 0;"
                            ></div>
                            <div
                              class="relative -z-2 ml-3.5"
                              style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(7.5rem);"
                            ></div>
                            <div class="relative flex items-center gap-x-2 min-w-36">
                              <button
                                class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
                    before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
                    before:bg-white dark:before:bg-gray-800 before:transition-background-color
                    hover:before:bg-panel-2"
                                aria-selected="false"
                                style="left: -1.125rem;"
                              >
                                <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
                                  <use href="#sdt_icon_Triangle"></use>
                                </svg>
                              </button>
                              <div class="relative z-1">
                                <div
                                  class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
                                  style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
                                ></div>
                                <span class="flex items-center font-mono text-base">
                                  <span class="tag_brackets text-component">
                                    PassChildren
                                  </span>
                                </span>
                              </div>
                              <div class="inline-block p-x-1 bg-cyan-600 bg-opacity-20 rounded text-cyan-600 uppercase font-700 text-2.5 select-none">
                                HMR
                              </div>
                            </div>
                          </div>
                          <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
                            <div
                              class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
                              style="opacity: 0;"
                            ></div>
                            <div
                              class="relative -z-2 ml-3.5"
                              style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(4.875rem);"
                            ></div>
                            <div class="relative flex items-center gap-x-2 min-w-36">
                              <button
                                class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
                    before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
                    before:bg-white dark:before:bg-gray-800 before:transition-background-color
                    hover:before:bg-panel-2"
                                aria-selected="false"
                                style="left: -1.125rem;"
                              >
                                <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
                                  <use href="#sdt_icon_Triangle"></use>
                                </svg>
                              </button>
                              <div class="relative z-1">
                                <div
                                  class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
                                  style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
                                ></div>
                                <span class="flex items-center font-mono text-base">
                                  <span class="tag_brackets text-component">
                                    Todos
                                  </span>
                                </span>
                              </div>
                              <div class="inline-block p-x-1 bg-cyan-600 bg-opacity-20 rounded text-cyan-600 uppercase font-700 text-2.5 select-none">
                                HMR
                              </div>
                            </div>
                          </div>
                          <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
                            <div
                              class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
                              style="opacity: 0;"
                            ></div>
                            <div
                              class="relative -z-2 ml-3.5"
                              style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(5.75rem);"
                            ></div>
                            <div class="relative flex items-center gap-x-2 min-w-36">
                              <button
                                class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
                    before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
                    before:bg-white dark:before:bg-gray-800 before:transition-background-color
                    hover:before:bg-panel-2"
                                aria-selected="false"
                                style="left: -1.125rem;"
                              >
                                <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
                                  <use href="#sdt_icon_Triangle"></use>
                                </svg>
                              </button>
                              <div class="relative z-1">
                                <div
                                  class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
                                  style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
                                ></div>
                                <span class="flex items-center font-mono text-base">
                                  <span class="tag_brackets text-component">
                                    Show
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="relative w-full shrink-0 flex h-owner-path-height">
                  <div
                    class="group
                absolute z-1 bottom-0 inset-x-0 w-full p-y-.25 p-x-2
                overflow-hidden box-border flex items-end
                bg-panel-bg b-t b-solid b-panel-border
                h-owner-path-height min-h-owner-path-height
                hover:h-auto hover:pt-.5"
                  >
                    <div class="flex flex-wrap text-sm leading-3 font-mono">
                      <div class="w-3 h-4 mx-.5 center-child first:hidden">
                        <svg class="w-2 h-2 mb-[0.15rem] text-disabled">
                          <use href="#sdt_icon_CarretRight"></use>
                        </svg>
                      </div>
                      <div
                        class="relative z-1 h-3 p-y-.25 my-0.25
                                    flex items-center gap-x-1 cursor-pointer"
                        style="--highlight_opacity_var: 0;"
                      >
                        <div class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity b b-solid b-gray-400 rounded-sm"></div>
                        <svg class="w-2.5 h-2.5 text-disabled">
                          <use href="#sdt_icon_Root"></use>
                        </svg>
                      </div>
                      <div class="w-3 h-4 mx-.5 center-child first:hidden">
                        <svg class="w-2 h-2 mb-[0.15rem] text-disabled">
                          <use href="#sdt_icon_CarretRight"></use>
                        </svg>
                      </div>
                      <div
                        class="relative z-1 h-3 p-y-.25 my-0.25
                                    flex items-center gap-x-1 cursor-pointer"
                        style="--highlight_opacity_var: 0;"
                      >
                        <div class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity b b-solid b-gray-400 rounded-sm"></div>
                        <div class="text-text">Main</div>
                      </div>
                      <div class="w-3 h-4 mx-.5 center-child first:hidden">
                        <svg class="w-2 h-2 mb-[0.15rem] text-disabled">
                          <use href="#sdt_icon_CarretRight"></use>
                        </svg>
                      </div>
                      <div
                        class="relative z-1 h-3 p-y-.25 my-0.25
                                    flex items-center gap-x-1 cursor-pointer"
                        style="--highlight_opacity_var: 0;"
                      >
                        <div class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity b b-solid b-gray-400 rounded-sm"></div>
                        <div class="text-text">ThemeProvider</div>
                      </div>
                      <div class="w-3 h-4 mx-.5 center-child first:hidden">
                        <svg class="w-2 h-2 mb-[0.15rem] text-disabled">
                          <use href="#sdt_icon_CarretRight"></use>
                        </svg>
                      </div>
                      <div
                        class="relative z-1 h-3 p-y-.25 my-0.25
                                    flex items-center gap-x-1 cursor-pointer"
                        style="--highlight_opacity_var: 0;"
                      >
                        <div class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity b b-solid b-gray-400 rounded-sm"></div>
                        <svg class="w-2.5 h-2.5 text-disabled">
                          <use href="#sdt_icon_Context"></use>
                        </svg>
                      </div>
                      <div class="w-3 h-4 mx-.5 center-child first:hidden">
                        <svg class="w-2 h-2 mb-[0.15rem] text-disabled">
                          <use href="#sdt_icon_CarretRight"></use>
                        </svg>
                      </div>
                      <div
                        class="relative z-1 h-3 p-y-.25 my-0.25
                                    flex items-center gap-x-1 cursor-pointer"
                        style="--highlight_opacity_var: 0;"
                      >
                        <div class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity b b-solid b-gray-400 rounded-sm"></div>
                        <div class="text-text">App</div>
                      </div>
                      <div class="w-3 h-4 mx-.5 center-child first:hidden">
                        <svg class="w-2 h-2 mb-[0.15rem] text-disabled">
                          <use href="#sdt_icon_CarretRight"></use>
                        </svg>
                      </div>
                      <div
                        class="relative z-1 h-3 p-y-.25 my-0.25
                                    flex items-center gap-x-1 cursor-pointer"
                        style="--highlight_opacity_var: 0;"
                      >
                        <div class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity b b-solid b-gray-400 rounded-sm"></div>
                        <div class="text-text">Button</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="relative bg-panel-border">
              <div class="absolute z-9999 select-none cursor-row-resize sm:cursor-col-resize -inset-y-3px inset-x-0 sm:inset-y-0 sm:-inset-x-3px bg-panel-border transition opacity-0"></div>
            </div>
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
                              <button
                                class="center-child"
                                title="Open in Graph panel"
                              >
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
          </div>
        </div>
      </div>
    </div>
  );
});
