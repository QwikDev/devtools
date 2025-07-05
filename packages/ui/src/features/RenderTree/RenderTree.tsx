import { component$, useVisibleTask$, useStore } from '@qwik.dev/core';
import { Tree, TreeNode } from '../../components/Tree/Tree';
import { useSignal } from '@qwik.dev/core/internal';
import { vnode_toObject } from '../../components/Tree/filterVnode';
import { htmlContainer } from '../../utils/location';
import { removeNodeFromTree } from '../../components/Tree/vnode';
import { ISDEVTOOL } from '../../components/Tree/type';

export const RenderTree = component$(() => {
  const data = useSignal<TreeNode[]>([]);
  useVisibleTask$(() => {
    data.value = removeNodeFromTree(vnode_toObject(
      htmlContainer().rootVNode,
    )!, (node) => {
      console.log(node.name, '>>')
      return node.name === ISDEVTOOL
    })
  });

  return (
    <div class="h-full w-full flex-1 overflow-hidden rounded-md border  border-border">
      <div class="flex h-full w-full">
        <div class="w-[50%] overflow-hidden p-4">
          <Tree data={data}></Tree>
        </div>
        <div class="border-l border-border"></div>
        <div class="h-full w-[50%] overflow-y-auto p-4">
          <div class="border-b border-slate-200 dark:border-slate-700">
            <div class="relative flex items-center -mb-px" role="tablist" aria-label="Content Tabs">
              <button

                role="tab"
                class={`
                  z-10 relative px-4 py-3 text-sm font-medium transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200
                `}
              >
                121212
              </button>
              <button

                role="tab"
                class={`
                  z-10 relative px-4 py-3 text-sm font-medium transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200
                `}
              >
                121212
              </button>
              <span
                class="absolute bottom-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full transition-all duration-300 ease-in-out"
              >11111</span>
            </div>
          </div>

          <div class="mt-4">
            <div

              class="p-4 bg-background rounded-lg shadow-md animate-fadeIn"
            >
              11111
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
