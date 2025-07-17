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
import { QPROPS, QSEQ} from './transfromqseq';
import { removeNodeFromTree } from '../../components/Tree/vnode';
import { isComputed, isListen, isPureSignal, isStore, isTask } from '../../utils/type';
import { formatComputedData, formatListenData, formatPropsData, formatSignalData, formatStoreData, formatTaskData, getData } from './formatTreeData';
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
    console.log(node)
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
     
    }
    if(node.props?.[QPROPS]){
      const props = unwrapStore(node.props?.[QPROPS])
      Object.keys(props).forEach((key: any) => {
        if(isListen(key)){
          formatListenData({[key]: props[key]})
        } else {
          formatPropsData({[key]: props[key]})
        }

      })
    }

    stateTree.value = getData() as TreeNode[]
    
  });

  const currentTab = useSignal<'state' | 'code'>('state');

  return (
    <div class="h-full w-full flex-1 overflow-hidden rounded-md border  border-border">
      <div class="flex h-full w-full">
        <div class="w-[50%] overflow-hidden p-4">
          <Tree data={data} onNodeClick={onNodeClick}></Tree>
        </div>
        <div class="border-l border-border"></div>
        <div class="flex h-full w-[50%] flex-col p-4">
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
            class="mt-5 flex-1 rounded-lg border border-border bg-card-item-bg p-2 shadow-sm overflow-y-auto"
          >
            
            <Tree data={stateTree} gap={10} isHover={false} 
            renderNode={$((node) => {
              const label = node.label || node.name || '';
              const isProperty = label.split(':')
              // 分组节点大色块样式
              if (label === 'useStore' || label === 'useSignal' || label === 'Computed' || label === 'Task' || label === 'Props' || label === 'Listens') {
                return (
                  <span class="text-gray-500 dark:text-gray-300">
                    {label}
                  </span>
                );
              }

              return (isProperty.length > 1 ? (<><span class="text-red-300 dark:text-red-500">{isProperty[0]}</span><span class="text-gray-400">: {isProperty[1]}</span></>) : <span>{label}</span>)
      
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
