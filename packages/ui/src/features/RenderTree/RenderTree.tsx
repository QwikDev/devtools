import {
  component$,
  useVisibleTask$,
  useComputed$,
  $, 
  useSignal,
  isSignal,
  useStore
} from '@qwik.dev/core';
import { Tree, TreeNode } from '../../components/Tree/Tree';
import { vnode_toObject } from '../../components/Tree/filterVnode';
import { htmlContainer } from '../../utils/location';
import { ISDEVTOOL } from '../../components/Tree/type';
import { createTreeNodeObj, objectToTree, QSEQ, signalToTree, taskToTree } from './transfromqseq';
import { removeNodeFromTree } from '../../components/Tree/vnode';

export const RenderTree = component$(() => {
  const data = useSignal<TreeNode[]>([]);
  
  // Use a more realistic state example
  const exampleState = {
    user: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      'q:seq': { count: 5 },
      preferences: {
        theme: 'dark',
        language: 'en-US',
        notifications: true
      },
      roles: ['admin', 'user', 'moderator']
    },
    counter: 42,
    isLoading: false,
    items: [
      { id: 1, name: 'Item 1', price: 10.99, inStock: true },
      { id: 2, name: 'Item 2', price: 20.50, inStock: false }
    ],
    config: {
      apiUrl: 'https://api.example.com',
      timeout: 5000,
      retry: 3
    }
  };
  const stateTree = useSignal<TreeNode[]>(objectToTree(exampleState));
  
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
    if(Array.isArray(node.props?.[QSEQ])){
      stateTree.value = node.props?.[QSEQ].map((item: any) => {
        if(isSignal(item)){
        //   return createTreeNodeObj('useSignal', signalToTree(item))
        // } else if(isTask(item)){
        //   return createTreeNodeObj('Task', taskToTree(item))
        // } else {
          // console.log(isStore(item), '>>>>')
          return  createTreeNodeObj('useStore', objectToTree(item))
        }

        // console.log(unwrapStore(item), '>>>>')
        return item
      }).flat()
      console.log(stateTree.value.flat(), '>>>>')
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
              // Return different rendering based on node type
              const elementType = node.elementType;
              const label = node.label || node.name || '';
              
              // Handle different types of nodes
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
