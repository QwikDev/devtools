import { _VNode } from '@qwik.dev/core/internal';
import { vnode_getAttr, vnode_getAttrKeys, vnode_getFirstChild, vnode_getNextSibling, vnode_getNode, vnode_getText, vnode_isElementVNode, vnode_isMaterialized, vnode_isTextVNode, vnode_isVirtualVNode } from './vnode';
import { DEBUG_TYPE, VirtualType, VirtualTypeName } from './type';

let index = 0
interface VNodeObject {
  name?: string | 'text';
  props?: Record<string, any>;
  element?: Record<string, any>;
  children?: VNodeObject[];
  elementType?: string
  label?: string;
  id: string;
}

function initVnode({
  name = 'text',
  props = {},
  element = {},
  children = [],
  elementType = ''
}: VNodeObject
): VNodeObject {
  return {
    name,
    props,
    element,
    children,
    label: elementType,
    id: `vnode-${index++}`,
  }
}
export function vnode_toObject(
  vnodeItem: _VNode | null,
  materialize: boolean = false,
  siblings: boolean = false
): VNodeObject | VNodeObject[] | null {
  const vnode = vnodeItem;

  if (vnode === null || vnode === undefined) {
    return null;
  }

  const result: VNodeObject[] = [];

  traverse(vnode, result, siblings, materialize);
  // 返回兄弟节点数组
  return result;


}

function traverse(vnode: _VNode, result: VNodeObject[], siblings: boolean, materialize: boolean): void {
  let vnodeItem: _VNode | null = vnode;
  do {
    if (vnode_isTextVNode(vnodeItem)) {
      // const text = vnode_getText(vnodeItem);
      result.push(initVnode({ name: 'text', element: vnodeItem })); // Fixed: use vnodeItem
    } else if (vnode_isVirtualVNode(vnodeItem)) {
      const vnodeObject = initVnode({ name: 'virtual', element: vnodeItem }) // Fixed: use vnodeItem
      vnode_getAttrKeys(vnodeItem).forEach((key) => { // Fixed: use vnodeItem
        if (key !== DEBUG_TYPE) {
          const value = vnode_getAttr(vnodeItem!, key); // Fixed: use vnodeItem
          if (!vnodeObject.props) {
            vnodeObject.props = {};
          }
          vnodeObject.props[key] = value;
        }
      });
      
      const child = vnode_getFirstChild(vnodeItem); // Fixed: use vnodeItem
      if (child) {
        if (!vnodeObject.children) {
          vnodeObject.children = [];
        }
        traverse(child, result, true, true);
      }

      // result.push(vnodeObject);
    } else if (vnode_isElementVNode(vnodeItem)) {
      const vnodeObject = initVnode({ name: 'element', element: vnodeItem, elementType: vnodeItem[6]!.nodeName }) // Fixed: use vnodeItem
      const keys = vnode_getAttrKeys(vnodeItem); // Fixed: use vnodeItem
      keys.forEach((key) => {
        const value = vnode_getAttr(vnodeItem!, key); // Fixed: use vnodeItem
        if (!vnodeObject.props) {
          vnodeObject.props = {};
        }
        vnodeObject.props[key] = value;
      });
      result.push(vnodeObject);
      if (vnode_isMaterialized(vnodeItem)) { // Fixed: use vnodeItem
        const child = vnode_getFirstChild(vnodeItem); // Fixed: use vnodeItem
        if (child) {
          if (!vnodeObject.children) {
            vnodeObject.children = [];
          }
          traverse(child, vnodeObject.children, true, true);
        }
      }

    }
    vnodeItem = (siblings && vnode_getNextSibling(vnodeItem)) || null;
  } while (vnodeItem);
}