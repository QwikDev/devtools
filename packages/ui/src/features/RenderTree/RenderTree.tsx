import {
  component$,
  useVisibleTask$,
  useStore,
  useComputed$,
} from '@qwik.dev/core';
import { Tree, TreeNode } from '../../components/Tree/Tree';
import { useSignal } from '@qwik.dev/core/internal';
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
        return true;
        // console.log(node.name, '>>')
        // return node.name === ISDEVTOOL
      },
    );
  });

  return (
    <div class="h-full w-full flex-1 overflow-hidden rounded-md border  border-border">
      <div class="flex h-full w-full">
        <div class="w-[50%] overflow-hidden p-4">
          <Tree data={data}></Tree>
        </div>
        <div class="border-l border-border"></div>
        <div class="flex h-full w-[50%] flex-col overflow-y-auto p-4">
          <div class="border-b border-border">
            <div class="-mb-px flex space-x-4" aria-label="Tabs">
              <button class="tab-btn active whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-all duration-300 ease-in-out">
                个人资料
              </button>
              <button class="tab-btn inactive whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-all duration-300 ease-in-out">
                账户设置
              </button>
              <button class="tab-btn inactive whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-all duration-300 ease-in-out">
                通知
              </button>
            </div>
          </div>
          <div
            id="tab-content-panel"
            class="mt-5 flex-1 rounded-lg border border-border bg-card-item-bg p-6 shadow-sm"
          >
            <h3 class="mb-2 text-lg font-semibold text-foreground">
              个人资料信息
            </h3>
            <p class="text-muted-foreground">
              这里是您的个人资料详情。您可以在此页面编辑您的姓名、头像和简介等信息。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
