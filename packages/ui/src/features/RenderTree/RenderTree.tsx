import {
  component$,
  useVisibleTask$,
  useComputed$,
  $, 
  useSignal,
} from '@qwik.dev/core';
import { Tree, TreeNode } from '../../components/Tree/Tree';
import { vnode_toObject } from '../../components/Tree/filterVnode';
import { htmlContainer } from '../../utils/location';
import { ISDEVTOOL } from '../../components/Tree/type';
import { QSEQ} from './transfromqseq';
import { removeNodeFromTree } from '../../components/Tree/vnode';
import { isComputed, isPureSignal, isStore, isTask } from '../../utils/type';
import { formatComputedData, formatSignalData, formatStoreData, formatTaskData, getData } from './formatTreeData';
import { unwrapStore } from '@qwik.dev/core/internal';

export const RenderTree = component$(() => {
  const data = useSignal<TreeNode[]>([]);
  
  const stateTree = useSignal<TreeNode[]>([]);
  
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
        return node.name === ISDEVTOOL
      },
    );
  });

  const onNodeClick = $((node: TreeNode) => {
    if(Array.isArray(node.props?.[QSEQ])){
      node.props?.[QSEQ].forEach((item: any) => {
        if(isPureSignal(item)){
          formatSignalData(item)
        }else if(isTask(item)){
          formatTaskData(item)
        } else if(isComputed(item)){
          formatComputedData(item)
        } else if(isStore(item)){
          formatStoreData(unwrapStore(item))
        }
      })
      stateTree.value = getData()
    }
    
    
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
            
            <Tree data={stateTree} gap={10} renderNode={$((node) => {
              // 优化：根据 name 渲染不同样式
              const elementType = node.elementType;
              const label = node.label || node.name || '';
              const name = node.label;
              // useStoreList
              if (name === 'useStoreList') {
                return (
                  <span class="inline-flex items-center px-2 py-0.5 rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 font-semibold text-sm">
                    <span class="mr-1">🏪</span> {name}
                  </span>
                );
              }
              // useSignal
              if (name === 'useSignalList') {
                return (
                  <span class="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-semibold text-sm">
                    <span class="mr-1">📶</span> {name}
                  </span>
                );
              }
              // Computed
              if (name === 'ComputedList') {
                return (
                  <span class="inline-flex items-center px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 font-semibold text-sm">
                    <span class="mr-1">🧮</span> {name}
                  </span>
                );
              }
              // Task
              if (name === 'TaskList') {
                return (
                  <span class="inline-flex items-center px-2 py-0.5 rounded bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 font-semibold text-sm">
                    <span class="mr-1">⏳</span>{name}
                  </span>
                );
              }

              // 其余类型保持原有逻辑
              if (elementType === 'string') {
                return (
                  <span class="text-green-600 dark:text-green-400">
                    {label}
                  </span>
                );
              }
              if (elementType === 'number') {
                return (
                  <span class="text-blue-600 dark:text-blue-400">
                    {label}
                  </span>
                );
              }
              if (elementType === 'boolean') {
                return (
                  <span class="text-purple-600 dark:text-purple-400">
                    {label}
                  </span>
                );
              }
              if (elementType === 'null') {
                return (
                  <span class="text-gray-500 dark:text-gray-400 italic">
                    {label}
                  </span>
                );
              }
              if (elementType === 'function') {
                return (
                  <span class="text-orange-600 dark:text-orange-400 italic">
                    {label}
                  </span>
                );
              }
              if (elementType === 'array' || elementType === 'object') {
                return (
                  <span class="font-medium">
                    {label}
                  </span>
                );
              }
              return <span>{label}</span>;
            })}></Tree>
          </div>
          }

          {currentTab.value === 'code' && <div
            class="mt-5 flex-1 rounded-lg border border-border bg-card-item-bg p-2 shadow-sm"
          >
            This is where the code view will be displayed. You can inspect the component source code here.
          </div>
          }
        </div>
      </div>
    </div>
  );
});
