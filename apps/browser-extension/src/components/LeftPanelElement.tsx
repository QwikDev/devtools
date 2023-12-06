import { component$ } from '@builder.io/qwik';

type Props = {
  level: number;
  element: any;
};

export const LeftPanelElement = component$<Props>(({ level, element }) => {
  return (
    <>
      <div class="h-owner-path-height relative flex items-center p-r-4 cursor-pointer">
        <div
          class="absolute -z-1 inset-y-0 inset-x-1 rounded bg-highlight-bg b b-solid b-highlight-border transition-opacity duration-100"
          style="opacity: 0;"
        ></div>
        <div
          class="relative -z-2 ml-3.5"
          style={`height: calc(1.8rem); background: repeating-linear-gradient(to right, transparent, transparent calc(0.875rem - 0.95px), var(--panel__3) calc(0.875rem - 0.95px), var(--panel__3) 0.875rem); -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.4), black 12rem); width: calc(${level} * 1.375rem);`}
        ></div>
        <div class="relative flex items-center gap-x-2">
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
            <span class="flex items-center font-mono text-lg">
              <span class="tag_brackets text-component">{element.id}</span>
            </span>
          </div>
        </div>
      </div>
      {(element.children || []).map((el: any) => (
        <LeftPanelElement key={el.id} level={level + 1} element={el} />
      ))}
    </>
  );
});
