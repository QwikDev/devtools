import { _VNode } from '@qwik.dev/core/internal';
import {
  vnode_getAttr,
  vnode_getAttrKeys,
  vnode_getFirstChild,
  vnode_getNextSibling,
  vnode_isMaterialized,
  vnode_isVirtualVNode,
} from './vnode';
import { DEBUG_TYPE } from './type';
import { htmlContainer } from '../../utils/location';

let index = 0;
interface VNodeObject {
  name?: string | 'text';
  props?: Record<string, any>;
  element?: Record<string, any>;
  children?: VNodeObject[];
  elementType?: string;
  label?: string;
  id: string;
}

function initVnode({
  name = 'text',
  props = {},
  element = {},
  children = [],
}): VNodeObject {
  return {
    name,
    props,
    element,
    children,
    label: name,
    id: `vnode-${index++}`,
  };
}
export function vnode_toObject(
  vnodeItem: _VNode | null,
  materialize: boolean = false,
): VNodeObject | VNodeObject[] | null {
  if (vnodeItem === null || vnodeItem === undefined) {
    return null;
  }

  return buildTreeRecursive(vnodeItem, materialize);
}
const container = htmlContainer();
function buildTreeRecursive(
  vnode: _VNode | null,
  materialize: boolean,
): VNodeObject[] {
  if (!vnode) {
    return [];
  }

  const result: VNodeObject[] = [];
  let currentVNode: _VNode | null = vnode;

  while (currentVNode) {
    const item = (vnodeList: any) =>
      Array.isArray((vnodeList as any)?.[6]) &&
      (vnodeList as any)?.[6]?.find((item: any) => typeof item === 'function');

    const item1 =
      Array.isArray((currentVNode as any)?.[6]) &&
      (currentVNode as any)?.[6]?.find((item: any) => item === 'q:renderFn');
    if (!item(currentVNode) && item1) {
      (currentVNode as any)?.[6].forEach((prop, index) => {
        if (index % 2 === 0) {
          (currentVNode?.[6] as any)[index + 1] = container.getHostProp(
            currentVNode!,
            prop,
          );
          console.log(currentVNode);
        }
      });
      console.log(currentVNode, item1);
    }
    if (vnode_isVirtualVNode(currentVNode) && item(currentVNode)) {
      console.log(currentVNode);
      const vnodeObject = initVnode({ element: currentVNode });
      vnode_getAttrKeys(currentVNode).forEach((key) => {
        if (key !== DEBUG_TYPE) {
          const value = vnode_getAttr(currentVNode!, key);
          vnodeObject.props![key] = value;
        }
      });

      const firstChild = vnode_getFirstChild(currentVNode);
      const filteredChildren = firstChild
        ? buildTreeRecursive(firstChild, materialize)
        : [];
      if (filteredChildren.length > 0) {
        vnodeObject.children = filteredChildren;
      }

      if (Array.isArray((currentVNode as any)[6])) {
        const itme = (currentVNode as any)[6].find(
          (item: any) => typeof item === 'function',
        );
        if (itme && itme.$symbol$) {
          vnodeObject.label = itme.$symbol$;
          vnodeObject.name = itme.$symbol$;
        }
      }

      result.push(vnodeObject);
    } else if (
      vnode_isMaterialized(currentVNode) ||
      (vnode_isVirtualVNode(currentVNode) && !item(currentVNode))
    ) {
      const firstChild = vnode_getFirstChild(currentVNode);
      if (firstChild) {
        const childObjects = buildTreeRecursive(firstChild, materialize);
        result.push(...childObjects);
      }
    }

    currentVNode = vnode_getNextSibling(currentVNode);
  }

  return result;
}
