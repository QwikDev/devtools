import { component$ } from '@builder.io/qwik';
import { LeftPanelElement } from './LeftPanelElement';
import { DevTool } from '../app';

type Props = {
  components: DevTool['components'];
};
export const LeftPanel = component$<Props>(({ components }) => {
  return (
    <div class="relative z-1 overflow-hidden">
      <div
        class="relative h-full w-full overflow-hidden grid"
        style="grid-template-columns: 100%; grid-template-rows: 3rem 1fr;"
      >
        <div class="relative flex items-center justify-center">
          <div class="content-empty absolute z-1 inset-x-0 top-full h-0.6px bg-panel-border"></div>
          <div class="text-xl fixed">
            Components
          </div>
        </div>
        <div class="custom_scrollbar relative z-0 w-full h-full overflow-auto overflow-overlay overscroll-none">
          <div class="absolute inset-0 z-1 pointer-events-none"></div>
          <div class="relative min-w-full min-h-full w-max h-max overflow-hidden pb-[200px]">
            <div class="box-content h-full py-4" style="padding: 1.125rem 0px;">
              <div style="transform: translateY(calc(0rem));">
                <div style="transition: margin-left 300ms ease 0s; margin-left: calc(0rem);">
                  {components && Object.values(components).map((element) => (
                    <LeftPanelElement
                      key={element.id}
                      level={1}
                      element={element}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div class="relative w-full shrink-0 flex h-owner-path-height h-20">
              <div class="content-empty absolute z-1 inset-x-0 top-0 h-0.6px bg-panel-border"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
