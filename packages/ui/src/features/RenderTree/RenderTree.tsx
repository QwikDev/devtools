import { component$, useVisibleTask$, useComputed$, $ } from '@qwik.dev/core';
import { Tree } from '../../components/Tree/Tree';
import { useSignal } from '@qwik.dev/core/internal';
import { vnode_toObject } from '../../components/Tree/filterVnode';
import { htmlContainer } from '../../utils/location';
//@ts-ignore
export const RenderTree = component$(() => {
  const data = useSignal([]);
  const domContainerFromResultHtml = useComputed$(() => {
    try {
      return htmlContainer();
    } catch (err) {
      console.error(err);
      return null;
    }
  });

  useVisibleTask$(() => {
    data.value = vnode_toObject(
      domContainerFromResultHtml.value!.rootVNode,
      false,
    ) as any;
  });

  return (
    <div class="h-full w-full flex-1 overflow-hidden rounded-md border  border-border">
      <div class="flex h-full w-full">
        <div class="w-[50%] overflow-hidden p-4">
          <Tree data={data}></Tree>
        </div>
        <div class="border-l border-border"></div>
        <div class="h-full w-[50%] overflow-y-auto p-4">1</div>
      </div>
    </div>
  );
});
