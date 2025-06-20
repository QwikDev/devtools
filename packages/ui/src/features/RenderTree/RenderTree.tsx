import { component$ } from '@qwik.dev/core';
import { Tree } from '../../components/Tree/Tree';

//@ts-ignore
export const RenderTree = component$(() => {
  return (
    <div class="flex-1 overflow-hidden h-full w-full border border-border  rounded-md">
      <div class="flex h-full w-full">
        <div class="flex-1">
          <Tree></Tree>
        </div>
        <div class="border-l border-border"></div>
        <div class="flex-1 overflow-y-auto p-4 h-full">
          1
        </div>
      </div>
    </div>
  );
});
