import {
  component$,
  useVisibleTask$,
  useStore,
  useComputed$,
  $, 
  useSignal
} from '@qwik.dev/core';
import { Tree, TreeNode } from '../../components/Tree/Tree';
import { vnode_toObject } from '../../components/Tree/filterVnode';
import { htmlContainer } from '../../utils/location';
import { removeNodeFromTree } from '../../components/Tree/vnode';
import { ISDEVTOOL } from '../../components/Tree/type';

export const RenderTree = component$(() => {
  const data = useSignal<TreeNode[]>([]);
  const qwikContainer = useComputed$(() => {
    try {
      return htmlContainer();
    } catch (error) {
      console.error(error);
      return null;
    }
  });

  useVisibleTask$(() => {
    data.value = removeNodeFromTree(
      vnode_toObject(qwikContainer.value!.rootVNode)!,
      (node) => {
        // console.log(node.name, '>>')
        return node.name === ISDEVTOOL
      },
    );
  });

  const onNodeClick = $((node: TreeNode) => {
    console.log(node, '>>');
    
    console.log(node.props['q:seq'].count, '>>')
  });

  const currentTab = useSignal<'state' | 'code'>('state');

  return (
    <div class="h-full w-full flex-1 overflow-hidden rounded-md border  border-border">
      <div class="flex h-full w-full">
        <div class="w-[50%] overflow-hidden p-4">
          <Tree data={data} onNodeClick={onNodeClick}></Tree>
        </div>
        <div class="border-l border-border"></div>
        <div class="flex h-full w-[50%] flex-col overflow-y-auto p-4">
          <div class="border-b border-border">
            <div class="flex space-x-4 border-b border-border">
              <button
                onClick$={() => (currentTab.value = 'state')}
                style={currentTab.value === 'state' ? { borderBottom: '2px solid var(--color-primary-active)' } : {}}
                class="px-4 py-3 text-sm font-medium border-b-transparent border-b-2 transition-all duration-300 ease-in-out"
              >
                state
              </button>
              <button
                onClick$={() => (currentTab.value = 'code')}
                style={currentTab.value === 'code' ? { borderBottom: '2px solid var(--color-primary-active)' } : {}}
                class="px-4 py-3 text-sm font-medium border-b-transparent border-b-2  transition-all duration-300 ease-in-out"
              >
                code
              </button>
            </div>
          </div>

          {currentTab.value === 'state' && <div

            class="mt-5 flex-1 rounded-lg border border-border bg-card-item-bg p-2 shadow-sm"
          >
            这里是您的个人资料详111情。您可以在此页面编辑您的姓名、头像和简介等信息。
          </div>
          }

          {currentTab.value === 'code' && <div
            class="mt-5 flex-1 rounded-lg border border-border bg-card-item-bg p-2 shadow-sm"
          >
            这里是您的个人资料详情。您可以在此页面编辑您的姓名、头像和简介等信息。
          </div>
          }
        </div>
      </div>
    </div>
  );
});
