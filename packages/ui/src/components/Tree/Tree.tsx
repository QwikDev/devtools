import { $, component$, QRL, useSignal } from '@qwik.dev/core';
import type { JSXOutput, Signal } from '@qwik.dev/core';
import { HiChevronUpMini } from '@qwikest/icons/heroicons';

export interface TreeNode {
  name?: string | 'text';
  props?: Record<string, any>;
  element?: Record<string, any>;
  children?: TreeNode[];
  elementType?: string;
  label?: string;
  isHover?: boolean;
  id: string;
}

const TreeNodeComponent = component$(
  (props: {
    node: TreeNode;
    level: number;
    gap: number;
    isHover: boolean;
    activeNodeId: string;
    expandLevel: number;
    onNodeClick: QRL<(node: TreeNode) => void>;
    renderNode?: QRL<(node: TreeNode) => JSXOutput>;
    animate?: boolean;
    animationDuration?: number;
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

    const iterateProps = (porps: Record<string, any>) => {
      const displayProp = ['q:id', 'q:key'];
      return displayProp.reduce((totalStr, prop) => {
        if (porps[prop]) {
          totalStr += `${prop}="${porps[prop]}" `;
        }
        return totalStr;
      }, '');
    };

    // Check if the current node is the one that is active
    const isActive = props.isHover
      ? props.node.id === props.activeNodeId
      : false;
    const duration = props.animationDuration ?? 200;
    const shouldShowChildren = hasChildren && !isExpanded.value;
    const renderChildren = props.node.children?.map((child) => (
      <TreeNodeComponent
        isHover={props.isHover}
        key={child.id}
        node={child}
        gap={props.gap}
        expandLevel={props.expandLevel}
        level={props.level + 1}
        activeNodeId={props.activeNodeId}
        onNodeClick={props.onNodeClick}
        renderNode={props.renderNode}
        animate={props.animate}
        animationDuration={props.animationDuration}
      />
    ));
    return (
      <div class="w-full">
        <div
          style={{ paddingLeft: `${props.level * props.gap}px` }}
          class={`flex w-full cursor-pointer items-center rounded-md p-1 transition-colors duration-150 
                ${
                  isActive
                    ? 'bg-primary  text-white '
                    : 'hover:bg-primary-hover '
                }`}
          onClick$={handleNodeClick}
        >
          {hasChildren ? (
            <HiChevronUpMini
              class={`mr-2 h-4 w-4 flex-shrink-0 transition-transform duration-200 ${isExpanded.value ? 'rotate-90' : 'rotate-180'}`}
            />
          ) : (
            <div class="mr-2 w-4 flex-shrink-0"></div>
          )}
          <div class="text-sm whitespace-nowrap cursor-pointer">
            {props.renderNode ? (
              <>{props.renderNode(props.node)}</>
            ) : (
              `<${props.node.label || props.node.name} ${iterateProps(props.node.props! || {})}>`
            )}
          </div>
        </div>
        {hasChildren ? (
          props.animate ? (
            <div
              class={`overflow-hidden transition-all ease-in-out`}
              style={{
                maxHeight: shouldShowChildren ? '1000px' : '0px',
                opacity: shouldShowChildren ? '1' : '0',
                transition: `max-height ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`,
              }}
            >
              {renderChildren}
            </div>
          ) : (
            shouldShowChildren && <>{renderChildren}</>
          )
        ) : null}
      </div>
    );
  },
);

export const Tree = component$(
  (props: {
    data: Signal<TreeNode[]>;
    onNodeClick?: QRL<(node: TreeNode) => void>;
    renderNode?: QRL<(node: TreeNode) => JSXOutput>;
    gap?: number;
    isHover?: boolean;
    animate?: boolean;
    animationDuration?: number;
    expandLevel?: number;
  }) => {
    const ref = useSignal<HTMLElement | undefined>();
    const store = props.data;
    const activeNodeId = useSignal('');
    // QRL to update the active node ID
    const setActiveNode = $((node: TreeNode) => {
      ref.value!.scrollLeft = ref.value!.scrollWidth;
      activeNodeId.value = node.id;
      props.onNodeClick && props.onNodeClick(node);
    });

    return (
      <div class="h-full w-full overflow-x-auto overflow-y-auto" ref={ref}>
        {store.value.map((rootNode) => (
          <TreeNodeComponent
            isHover={props.isHover === false ? false : true}
            gap={props.gap || 20}
            key={rootNode.id}
            node={rootNode}
            level={0}
            expandLevel={props.expandLevel ?? 2}
            activeNodeId={activeNodeId.value}
            onNodeClick={setActiveNode}
            renderNode={props.renderNode}
            animate={props.animate ?? true}
            animationDuration={props.animationDuration}
          />
        ))}
      </div>
    );
  },
);
