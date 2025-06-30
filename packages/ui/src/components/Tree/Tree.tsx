import { $, component$, QRL, useSignal } from "@qwik.dev/core";
import type {Signal} from "@qwik.dev/core";
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
  expandLevel: number
  onNodeClick: QRL<(node: TreeNode) => void>
}) => {
  const isExpanded = useSignal(props.expandLevel <= props.level); // Default to expanded
  const hasChildren = props.node.children && props.node.children.length > 0;

  const handleNodeClick = $(() => {
    // Set the current node as active
    props.onNodeClick(props.node);
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
            ? 'bg-primary  text-white '
            : 'hover:bg-primary-hover '}`}
        onClick$={handleNodeClick}
      >
        {hasChildren ? (
          <HiChevronUpMini class={`h-4 w-4 mr-2 transition-transform duration-200 flex-shrink-0 ${isExpanded.value ? 'rotate-90' : 'rotate-180'}`} />
        ) : <div class="w-4 mr-2 flex-shrink-0"></div>}
        <span class="text-sm">{`<${props.node.label}>`}</span>
      </div>
      {(!isExpanded.value && hasChildren) && (
        <div class="mt-1">
          {props.node.children?.map((child) => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              expandLevel={props.expandLevel}
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


export const Tree = component$((
  props: {
    data: Signal<TreeNode[]>
    onNodeClick?: QRL<(node: TreeNode) => void>
  }
) => {
  const ref = useSignal<HTMLElement | undefined>();
  const store = props.data
  const activeNodeId = useSignal('');
  // QRL to update the active node ID
  const setActiveNode = $((node: TreeNode) => {
    ref.value!.scrollLeft = ref.value!.scrollWidth
    activeNodeId.value = node.id;
    props.onNodeClick && props.onNodeClick(node)
  });

  return (
    <div class="h-full w-full overflow-y-auto overflow-x-auto" ref={ref}>
      {store.value.map((rootNode) => (
        <TreeNodeComponent
          key={rootNode.id}
          node={rootNode}
          level={0}
          expandLevel={2}
          activeNodeId={activeNodeId.value}
          onNodeClick={setActiveNode}
        />
      ))}
    </div>
  );
});


