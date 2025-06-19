import { $, component$, QRL, useSignal, useStore } from "@qwik.dev/core";
import {
  HiChevronUpMini
} from '@qwikest/icons/heroicons';

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

const TreeNodeComponent = component$((props: { 
  node: TreeNode, 
  level: number, 
  activeNodeId: string,
  onNodeClick: QRL<(id: string) => void>
}) => {
  const isExpanded = useSignal(true); // Default to expanded
  const hasChildren = props.node.children && props.node.children.length > 0;

  const handleNodeClick = $(() => {
    // Set the current node as active
    props.onNodeClick(props.node.id);
    // Toggle expansion if it has children
    if (hasChildren) {
      isExpanded.value = !isExpanded.value;
    }
  });

  // Check if the current node is the one that is active
  const isActive = props.node.id === props.activeNodeId;

  return (
    <div style={{ paddingLeft: `${props.level * 20}px` }}>
      <div 
        class={`flex items-center p-1 cursor-pointer rounded-md transition-colors duration-150 
                ${isActive 
                    ? 'bg-green-500 text-white' 
                    : ''}`}
        onClick$={handleNodeClick}
      >
        {hasChildren ? (
          <HiChevronUpMini class={`h-4 w-4 mr-2 transition-transform duration-200 flex-shrink-0 ${isExpanded.value ? 'rotate-90' : ''}`} />
        ) : <div class="w-4 mr-2 flex-shrink-0"></div> }
        <span class="text-sm">{`<${props.node.label}>`}</span>
      </div>
      {isExpanded.value && hasChildren && (
        <div class="mt-1">
          {props.node.children?.map((child) => (
            <TreeNodeComponent 
              key={child.id} 
              node={child} 
              level={props.level + 1} 
              activeNodeId={props.activeNodeId} 
              onNodeClick={props.onNodeClick} 
            />
          ))}
        </div>
      )}
    </div>
  );
});

const TREE_DATA: TreeNode[] = [
  {
    id: 'app',
    label: 'App',
    children: [
      {
        id: 'base-split-pane',
        label: 'BaseSplitPane',
        children: [],
      },
      {
        id: 'app-header',
        label: 'AppHeader',
        children: [],
      },
      {
        id: 'story-list',
        label: 'StoryList',
        children: [],
      },
      {
        id: 'router-view',
        label: 'RouterView',
        children: [
            {
                id: 'story',
                label: 'story: /story/:storyId',
                children: [],
            },
        ],
      },
      {
        id: 'base-button-story',
        label: 'BaseButton.story',
        children: [
            {
                id: 'story-fragment-1',
                label: 'Story',
                children: [],
            },
        ],
      },
      {
        id: 'meow-story',
        label: 'Meow.story',
        children: [
            {
                id: 'story-fragment-2',
                label: 'Story',
                children: [],
            },
        ]
      },
      {
        id: 'responsive-story',
        label: 'Responsive.story',
        children: [
            {
                id: 'story-fragment-3',
                label: 'Story',
                children: [],
            },
        ]
      },
    ],
  },
];


export const Tree = component$(() => {

const store = useStore({
    treeData: TREE_DATA,
  });
   // QRL to update the active node ID
  const setActiveNode = $((id: string) => {
    activeNodeId.value = id;
  });
   const activeNodeId = useSignal('');
  return (
    <div class="h-full w-full overflow-y-auto p-4">
      {store.treeData.map((rootNode) => (
                <TreeNodeComponent 
                  key={rootNode.id} 
                  node={rootNode} 
                  level={0} 
                  activeNodeId={activeNodeId.value} 
                  onNodeClick={setActiveNode} 
                />
            ))}
    </div>
  );
});


