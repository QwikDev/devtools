import { component$ } from '@builder.io/qwik';
import { componentGraph } from '../app';
import { LeftPanelElement } from './LeftPanelElement';

type Props = {
  componentGraph: typeof componentGraph;
};
export const LeftPanel = component$<Props>(({ componentGraph }) => {
  return (
    <div class="relative z-1 overflow-hidden">
      <div
        class="relative h-full w-full overflow-hidden grid"
        style="grid-template-columns: 100%; grid-template-rows: 1.75rem 1fr 1.125rem;"
      >
        <div class="relative flex items-stretch">
          <div class="content-empty absolute z-1 inset-x-0 top-full h-0.6px bg-panel-border"></div>
          <button class="shrink-0 w-7 h-7 toggle-button" aria-selected="false">
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
              class="box-content h-full py-4"
              style="padding: 1.125rem 0px;"
            >
              <div style="transform: translateY(calc(0rem));">
                <div style="transition: margin-left 300ms ease 0s; margin-left: calc(0rem);">
                  {Object.values(componentGraph).map((element) => (
                    <LeftPanelElement
                      key={element.id}
                      level={1}
                      element={element}
                    />
                  ))}
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
  );
});

// <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
// <div
//   class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
//   style="opacity: 0;"
// ></div>
// <div
//   class="relative -z-2 ml-3.5"
//   style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(0.5rem);"
// ></div>
// <div class="relative flex items-center gap-x-2 min-w-36">
//   <button
//     class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
// before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
// before:bg-white dark:before:bg-gray-800 before:transition-background-color
// hover:before:bg-panel-2"
//     aria-selected="false"
//     style="left: -1.125rem;"
//   >
//     <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
//       <use href="#sdt_icon_Triangle"></use>
//     </svg>
//   </button>
//   <div class="relative z-1">
//     <div
//       class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
//       style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
//     ></div>
//     <span class="flex items-center font-mono text-base">
//       <svg class="w-3 h-3 mr-1 -mb-2px text-disabled">
//         <use href="#sdt_icon_Root"></use>
//       </svg>
//       <span class="text-.8em select-none text-disabled">
//         Root
//       </span>
//     </span>
//   </div>
// </div>
// </div>
// <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
// <div
//   class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
//   style="opacity: 0;"
// ></div>
// <div
//   class="relative -z-2 ml-3.5"
//   style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(0.5rem);"
// ></div>
// <div class="relative flex items-center gap-x-2 min-w-36">
//   <button
//     class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
// before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
// before:bg-white dark:before:bg-gray-800 before:transition-background-color
// hover:before:bg-panel-2"
//     aria-selected="false"
//     style="left: -1.125rem;"
//   >
//     <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
//       <use href="#sdt_icon_Triangle"></use>
//     </svg>
//   </button>
//   <div class="relative z-1">
//     <div
//       class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
//       style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
//     ></div>
//     <span class="flex items-center font-mono text-base">
//       <svg class="w-3 h-3 mr-1 -mb-2px text-disabled">
//         <use href="#sdt_icon_Root"></use>
//       </svg>
//       <span class="text-.8em select-none text-disabled">
//         Root
//       </span>
//     </span>
//   </div>
// </div>
// </div>
// <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
// <div
//   class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
//   style="opacity: 0;"
// ></div>
// <div
//   class="relative -z-2 ml-3.5"
//   style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(3.125rem);"
// ></div>
// <div class="relative flex items-center gap-x-2 min-w-36">
//   <button
//     class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
// before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
// before:bg-white dark:before:bg-gray-800 before:transition-background-color
// hover:before:bg-panel-2"
//     aria-selected="false"
//     style="left: -1.125rem;"
//   >
//     <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
//       <use href="#sdt_icon_Triangle"></use>
//     </svg>
//   </button>
//   <div class="relative z-1">
//     <div
//       class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
//       style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
//     ></div>
//     <span class="flex items-center font-mono text-base">
//       <svg class="w-3 h-3 mr-1 -mb-2px text-disabled">
//         <use href="#sdt_icon_Context"></use>
//       </svg>
//       <span class="text-.8em select-none text-disabled">
//         Context
//       </span>
//     </span>
//   </div>
// </div>
// </div>
// <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
// <div
//   class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
//   style="opacity: 0;"
// ></div>
// <div
//   class="relative -z-2 ml-3.5"
//   style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(4rem);"
// ></div>
// <div class="relative flex items-center gap-x-2 min-w-36">
//   <button
//     class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
// before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
// before:bg-white dark:before:bg-gray-800 before:transition-background-color
// hover:before:bg-panel-2"
//     aria-selected="false"
//     style="left: -1.125rem;"
//   >
//     <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
//       <use href="#sdt_icon_Triangle"></use>
//     </svg>
//   </button>
//   <div class="relative z-1">
//     <div
//       class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
//       style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
//     ></div>
//     <span class="flex items-center font-mono text-base">
//       <span class="tag_brackets text-component">App</span>
//     </span>
//   </div>
//   <div class="inline-block p-x-1 bg-cyan-600 bg-opacity-20 rounded text-cyan-600 uppercase font-700 text-2.5 select-none">
//     HMR
//   </div>
// </div>
// </div>
// <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
// <div
//   class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
//   style="opacity: 0.45;"
// ></div>
// <div
//   class="relative -z-2 ml-3.5"
//   style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(4.875rem);"
// ></div>
// <div class="relative flex items-center gap-x-2 min-w-36">
//   <button
//     class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
// before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
// before:bg-white dark:before:bg-gray-800 before:transition-background-color
// hover:before:bg-panel-2"
//     aria-selected="false"
//     style="left: -1.125rem; opacity: 1;"
//   >
//     <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
//       <use href="#sdt_icon_Triangle"></use>
//     </svg>
//   </button>
//   <div class="relative z-1">
//     <div
//       class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
//       style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
//     ></div>
//     <span class="flex items-center font-mono text-base">
//       <span class="tag_brackets text-component">
//         Button
//       </span>
//     </span>
//   </div>
//   <div class="inline-block p-x-1 bg-cyan-600 bg-opacity-20 rounded text-cyan-600 uppercase font-700 text-2.5 select-none">
//     HMR
//   </div>
// </div>
// </div>
// <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
// <div
//   class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
//   style="opacity: 0;"
// ></div>
// <div
//   class="relative -z-2 ml-3.5"
//   style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(4.875rem);"
// ></div>
// <div class="relative flex items-center gap-x-2 min-w-36">
//   <button
//     class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
// before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
// before:bg-white dark:before:bg-gray-800 before:transition-background-color
// hover:before:bg-panel-2"
//     aria-selected="false"
//     style="left: -1.125rem;"
//   >
//     <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
//       <use href="#sdt_icon_Triangle"></use>
//     </svg>
//   </button>
//   <div class="relative z-1">
//     <div
//       class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
//       style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
//     ></div>
//     <span class="flex items-center font-mono text-base">
//       <span class="tag_brackets text-component">
//         Button
//       </span>
//     </span>
//   </div>
//   <div class="inline-block p-x-1 bg-cyan-600 bg-opacity-20 rounded text-cyan-600 uppercase font-700 text-2.5 select-none">
//     HMR
//   </div>
// </div>
// </div>
// <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
// <div
//   class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
//   style="opacity: 0;"
// ></div>
// <div
//   class="relative -z-2 ml-3.5"
//   style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(4.875rem);"
// ></div>
// <div class="relative flex items-center gap-x-2 min-w-36">
//   <button
//     class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
// before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
// before:bg-white dark:before:bg-gray-800 before:transition-background-color
// hover:before:bg-panel-2"
//     aria-selected="false"
//     style="left: -1.125rem;"
//   >
//     <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
//       <use href="#sdt_icon_Triangle"></use>
//     </svg>
//   </button>
//   <div class="relative z-1">
//     <div
//       class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
//       style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
//     ></div>
//     <span class="flex items-center font-mono text-base">
//       <span class="tag_brackets text-component">Show</span>
//     </span>
//   </div>
// </div>
// </div>
// <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
// <div
//   class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
//   style="opacity: 0;"
// ></div>
// <div
//   class="relative -z-2 ml-3.5"
//   style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(5.75rem);"
// ></div>
// <div class="relative flex items-center gap-x-2 min-w-36">
//   <button
//     class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
// before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
// before:bg-white dark:before:bg-gray-800 before:transition-background-color
// hover:before:bg-panel-2"
//     aria-selected="false"
//     style="left: -1.125rem;"
//   >
//     <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
//       <use href="#sdt_icon_Triangle"></use>
//     </svg>
//   </button>
//   <div class="relative z-1">
//     <div
//       class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
//       style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
//     ></div>
//     <span class="flex items-center font-mono text-base">
//       <span class="tag_brackets text-component">
//         unknown
//       </span>
//     </span>
//   </div>
// </div>
// </div>
// <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
// <div
//   class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
//   style="opacity: 0;"
// ></div>
// <div
//   class="relative -z-2 ml-3.5"
//   style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(6.625rem);"
// ></div>
// <div class="relative flex items-center gap-x-2 min-w-36">
//   <button
//     class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
// before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
// before:bg-white dark:before:bg-gray-800 before:transition-background-color
// hover:before:bg-panel-2"
//     aria-selected="false"
//     style="left: -1.125rem;"
//   >
//     <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
//       <use href="#sdt_icon_Triangle"></use>
//     </svg>
//   </button>
//   <div class="relative z-1">
//     <div
//       class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
//       style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
//     ></div>
//     <span class="flex items-center font-mono text-base">
//       <span class="tag_brackets text-component">Bold</span>
//     </span>
//   </div>
// </div>
// </div>
// <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
// <div
//   class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
//   style="opacity: 0;"
// ></div>
// <div
//   class="relative -z-2 ml-3.5"
//   style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(4.875rem);"
// ></div>
// <div class="relative flex items-center gap-x-2 min-w-36">
//   <button
//     class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
// before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
// before:bg-white dark:before:bg-gray-800 before:transition-background-color
// hover:before:bg-panel-2"
//     aria-selected="false"
//     style="left: -1.125rem;"
//   >
//     <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
//       <use href="#sdt_icon_Triangle"></use>
//     </svg>
//   </button>
//   <div class="relative z-1">
//     <div
//       class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
//       style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
//     ></div>
//     <span class="flex items-center font-mono text-base">
//       <span class="tag_brackets text-component">
//         ErrorBoundary
//       </span>
//     </span>
//   </div>
// </div>
// </div>
// <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
// <div
//   class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
//   style="opacity: 0;"
// ></div>
// <div
//   class="relative -z-2 ml-3.5"
//   style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(5.75rem);"
// ></div>
// <div class="relative flex items-center gap-x-2 min-w-36">
//   <button
//     class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
// before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
// before:bg-white dark:before:bg-gray-800 before:transition-background-color
// hover:before:bg-panel-2"
//     aria-selected="false"
//     style="left: -1.125rem;"
//   >
//     <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
//       <use href="#sdt_icon_Triangle"></use>
//     </svg>
//   </button>
//   <div class="relative z-1">
//     <div
//       class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
//       style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
//     ></div>
//     <span class="flex items-center font-mono text-base">
//       <span class="tag_brackets text-component">Show</span>
//     </span>
//   </div>
// </div>
// </div>
// <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
// <div
//   class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
//   style="opacity: 0;"
// ></div>
// <div
//   class="relative -z-2 ml-3.5"
//   style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(4.875rem);"
// ></div>
// <div class="relative flex items-center gap-x-2 min-w-36">
//   <button
//     class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
// before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
// before:bg-white dark:before:bg-gray-800 before:transition-background-color
// hover:before:bg-panel-2"
//     aria-selected="false"
//     style="left: -1.125rem;"
//   >
//     <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
//       <use href="#sdt_icon_Triangle"></use>
//     </svg>
//   </button>
//   <div class="relative z-1">
//     <div
//       class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
//       style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
//     ></div>
//     <span class="flex items-center font-mono text-base">
//       <span class="tag_brackets text-component">
//         DynamicSpreadParent
//       </span>
//     </span>
//   </div>
//   <div class="inline-block p-x-1 bg-cyan-600 bg-opacity-20 rounded text-cyan-600 uppercase font-700 text-2.5 select-none">
//     HMR
//   </div>
// </div>
// </div>
// <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
// <div
//   class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
//   style="opacity: 0;"
// ></div>
// <div
//   class="relative -z-2 ml-3.5"
//   style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(5.75rem);"
// ></div>
// <div class="relative flex items-center gap-x-2 min-w-36">
//   <button
//     class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
// before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
// before:bg-white dark:before:bg-gray-800 before:transition-background-color
// hover:before:bg-panel-2"
//     aria-selected="false"
//     style="left: -1.125rem;"
//   >
//     <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
//       <use href="#sdt_icon_Triangle"></use>
//     </svg>
//   </button>
//   <div class="relative z-1">
//     <div
//       class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
//       style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
//     ></div>
//     <span class="flex items-center font-mono text-base">
//       <span class="tag_brackets text-component">
//         DynamicSpreadChild
//       </span>
//     </span>
//   </div>
// </div>
// </div>
// <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
// <div
//   class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
//   style="opacity: 0;"
// ></div>
// <div
//   class="relative -z-2 ml-3.5"
//   style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(4.875rem);"
// ></div>
// <div class="relative flex items-center gap-x-2 min-w-36">
//   <button
//     class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
// before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
// before:bg-white dark:before:bg-gray-800 before:transition-background-color
// hover:before:bg-panel-2"
//     aria-selected="false"
//     style="left: -1.125rem;"
//   >
//     <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
//       <use href="#sdt_icon_Triangle"></use>
//     </svg>
//   </button>
//   <div class="relative z-1">
//     <div
//       class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
//       style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
//     ></div>
//     <span class="flex items-center font-mono text-base">
//       <span class="tag_brackets text-component">
//         Article
//       </span>
//     </span>
//   </div>
//   <div class="inline-block p-x-1 bg-cyan-600 bg-opacity-20 rounded text-cyan-600 uppercase font-700 text-2.5 select-none">
//     HMR
//   </div>
// </div>
// </div>
// <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
// <div
//   class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
//   style="opacity: 0;"
// ></div>
// <div
//   class="relative -z-2 ml-3.5"
//   style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(5.75rem);"
// ></div>
// <div class="relative flex items-center gap-x-2 min-w-36">
//   <button
//     class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
// before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
// before:bg-white dark:before:bg-gray-800 before:transition-background-color
// hover:before:bg-panel-2"
//     aria-selected="false"
//     style="left: -1.125rem;"
//   >
//     <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
//       <use href="#sdt_icon_Triangle"></use>
//     </svg>
//   </button>
//   <div class="relative z-1">
//     <div
//       class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
//       style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
//     ></div>
//     <span class="flex items-center font-mono text-base">
//       <span class="tag_brackets text-component">
//         Suspense
//       </span>
//     </span>
//   </div>
// </div>
// </div>
// <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
// <div
//   class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
//   style="opacity: 0;"
// ></div>
// <div
//   class="relative -z-2 ml-3.5"
//   style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(6.625rem);"
// ></div>
// <div class="relative flex items-center gap-x-2 min-w-36">
//   <button
//     class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
// before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
// before:bg-white dark:before:bg-gray-800 before:transition-background-color
// hover:before:bg-panel-2"
//     aria-selected="false"
//     style="left: -1.125rem;"
//   >
//     <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
//       <use href="#sdt_icon_Triangle"></use>
//     </svg>
//   </button>
//   <div class="relative z-1">
//     <div
//       class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
//       style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
//     ></div>
//     <span class="flex items-center font-mono text-base">
//       <svg class="w-3 h-3 mr-1 -mb-2px text-disabled">
//         <use href="#sdt_icon_Context"></use>
//       </svg>
//       <span class="text-.8em select-none text-disabled">
//         Context
//       </span>
//     </span>
//   </div>
// </div>
// </div>
// <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
// <div
//   class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
//   style="opacity: 0;"
// ></div>
// <div
//   class="relative -z-2 ml-3.5"
//   style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(7.5rem);"
// ></div>
// <div class="relative flex items-center gap-x-2 min-w-36">
//   <button
//     class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
// before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
// before:bg-white dark:before:bg-gray-800 before:transition-background-color
// hover:before:bg-panel-2"
//     aria-selected="false"
//     style="left: -1.125rem;"
//   >
//     <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
//       <use href="#sdt_icon_Triangle"></use>
//     </svg>
//   </button>
//   <div class="relative z-1">
//     <div
//       class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
//       style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
//     ></div>
//     <span class="flex items-center font-mono text-base">
//       <span class="tag_brackets text-component">
//         PassChildren
//       </span>
//     </span>
//   </div>
//   <div class="inline-block p-x-1 bg-cyan-600 bg-opacity-20 rounded text-cyan-600 uppercase font-700 text-2.5 select-none">
//     HMR
//   </div>
// </div>
// </div>
// <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
// <div
//   class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
//   style="opacity: 0;"
// ></div>
// <div
//   class="relative -z-2 ml-3.5"
//   style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(4.875rem);"
// ></div>
// <div class="relative flex items-center gap-x-2 min-w-36">
//   <button
//     class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
// before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
// before:bg-white dark:before:bg-gray-800 before:transition-background-color
// hover:before:bg-panel-2"
//     aria-selected="false"
//     style="left: -1.125rem;"
//   >
//     <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
//       <use href="#sdt_icon_Triangle"></use>
//     </svg>
//   </button>
//   <div class="relative z-1">
//     <div
//       class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
//       style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
//     ></div>
//     <span class="flex items-center font-mono text-base">
//       <span class="tag_brackets text-component">Todos</span>
//     </span>
//   </div>
//   <div class="inline-block p-x-1 bg-cyan-600 bg-opacity-20 rounded text-cyan-600 uppercase font-700 text-2.5 select-none">
//     HMR
//   </div>
// </div>
// </div>
// <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
// <div
//   class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
//   style="opacity: 0;"
// ></div>
// <div
//   class="relative -z-2 ml-3.5"
//   style="height: calc(1.125rem + 0.95px); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(5.75rem);"
// ></div>
// <div class="relative flex items-center gap-x-2 min-w-36">
//   <button
//     class="h-4.5 w-4.5 shrink center-child absolute -left-6 opacity-0 selected:opacity-100
// before:content-empty before:absolute before:-z-2 before:inset-.5 before:rounded-full
// before:bg-white dark:before:bg-gray-800 before:transition-background-color
// hover:before:bg-panel-2"
//     aria-selected="false"
//     style="left: -1.125rem;"
//   >
//     <svg class="w-2 h-2 text-panel-5 transition rotate-180 opacity-50">
//       <use href="#sdt_icon_Triangle"></use>
//     </svg>
//   </button>
//   <div class="relative z-1">
//     <div
//       class="highlight_element absolute -z-1 inset-y-0 -inset-x-1 rounded transition-opacity"
//       style="--highlight_color_var: #22d3ee; --highlight_opacity_var: 0;"
//     ></div>
//     <span class="flex items-center font-mono text-base">
//       <span class="tag_brackets text-component">Show</span>
//     </span>
//   </div>
// </div>
// </div>
