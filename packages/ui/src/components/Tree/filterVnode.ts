import { _VNode, QRL } from '@qwik.dev/core/internal';
import {
  vnode_getAttr,
  vnode_getAttrKeys,
  vnode_getFirstChild,
  vnode_getNextSibling,
  vnode_isMaterialized,
  vnode_isVirtualVNode,
  vnode_getProps,
  normalizeName,
} from './vnode';
import { DEBUG_TYPE, RENDER_TYPE } from './type';
import { htmlContainer } from '../../utils/location';
import { TreeNode } from './Tree';

let index = 0;

function initVnode({
  name = 'text',
  props = {},
  element = {},
  children = [],
}): TreeNode {
  return {
    name,
    props,
    element,
    children,
    label: name,
    id: `vnode-${index++}`,
  };
}
export function vnode_toObject(vnodeItem: _VNode | null): TreeNode[] | null {
  if (vnodeItem === null || vnodeItem === undefined) {
    return null;
  }

  return buildTreeRecursive(vnodeItem, false);
}
const container = htmlContainer()!;
function buildTreeRecursive(
  vnode: _VNode | null,
  materialize: boolean,
): TreeNode[] {
  // Return early if the starting node is null.
  if (!vnode) {
    return [];
  }

  const result: TreeNode[] = [];
  let currentVNode: _VNode | null = vnode;

  // Iterate over sibling nodes.
  while (currentVNode) {
    const isVirtual = vnode_isVirtualVNode(currentVNode);
    // Determine if the node is a Fragment ('F') to be filtered out.
    const isFragment =
      isVirtual &&
      typeof container.getHostProp(currentVNode, RENDER_TYPE) === 'function';
    if (isFragment) {
      const vnodeObject = initVnode({ element: currentVNode });

      vnode_getAttrKeys(currentVNode).forEach((key) => {
        // We skip the DEBUG_TYPE prop as it's for internal use.
        if (key === DEBUG_TYPE) return;

        const value = container.getHostProp(currentVNode!, key) as QRL;
        // Update the underlying VNode props array and the new object's props.
        vnode_getProps(currentVNode!)[
          vnode_getProps(currentVNode!).indexOf(key) + 1
        ] = value;
        vnodeObject.props![key] = vnode_getAttr(currentVNode!, key);

        // Special handling to set the label from the render function's symbol.
        if (key === RENDER_TYPE) {
          vnodeObject.label = normalizeName(value!.getSymbol());
          vnodeObject.name = normalizeName(value!.getSymbol());
        }
      });

      // Recursively build the tree for child nodes.
      const firstChild = vnode_getFirstChild(currentVNode);
      const children = firstChild
        ? buildTreeRecursive(firstChild, materialize)
        : [];
      if (children.length > 0) {
        vnodeObject.children = children;
      }

      result.push(vnodeObject);
    } else if (
      vnode_isMaterialized(currentVNode) ||
      (isVirtual && !isFragment)
    ) {
      // For materialized nodes, similar to Fragments, we skip the container node
      // itself and just process its children.
      const firstChild = vnode_getFirstChild(currentVNode);
      if (firstChild) {
        result.push(...buildTreeRecursive(firstChild, materialize));
      }
    }

    // Move to the next sibling in the tree.
    currentVNode = vnode_getNextSibling(currentVNode);
  }

  return result;
}
