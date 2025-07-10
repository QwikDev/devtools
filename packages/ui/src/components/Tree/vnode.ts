import { _VNode as VNode, _TextVNode, Task  } from '@qwik.dev/core/internal';
import {
  VNodeProps,
  VNodeFlags,
  ElementVNodeProps,
  VirtualVNodeProps,
  Q_PROPS_SEPARATOR,
  QContainerAttr,
  QContainerValue,
  StoreTarget,
} from './type';
import { TreeNode } from './Tree';

export const vnode_isTextVNode = (vNode: VNode): vNode is _TextVNode => {
  const flag = (vNode as VNode)[VNodeProps.flags];
  return (flag & VNodeFlags.Text) === VNodeFlags.Text;
};

export const vnode_isVirtualVNode = (vNode: VNode) => {
  const flag = (vNode as VNode)[VNodeProps.flags];
  return (flag & VNodeFlags.Virtual) === VNodeFlags.Virtual;
};

export const vnode_getFirstChild = (vnode: VNode) => {
  if (vnode_isTextVNode(vnode)) {
    return null;
  }
  let vFirstChild = vnode[ElementVNodeProps.firstChild];
  if (vFirstChild === undefined) {
    vFirstChild = vnode;
  }
  return vFirstChild as VNode | null;
};

export const vnode_isMaterialized = (vNode: VNode): boolean => {
  const flag = (vNode as VNode)[VNodeProps.flags];
  return (
    (flag & VNodeFlags.Element) === VNodeFlags.Element &&
    vNode[ElementVNodeProps.firstChild] !== undefined &&
    vNode[ElementVNodeProps.lastChild] !== undefined
  );
};

export const vnode_getNextSibling = (vnode: VNode): VNode | null => {
  return vnode[VNodeProps.nextSibling];
};

export const vnode_getPropStartIndex = (vnode: VNode): number => {
  const type = vnode[VNodeProps.flags] & VNodeFlags.TYPE_MASK;
  if (type === VNodeFlags.Element) {
    return ElementVNodeProps.PROPS_OFFSET;
  } else if (type === VNodeFlags.Virtual) {
    return VirtualVNodeProps.PROPS_OFFSET;
  }
  throw type;
};

export const vnode_getProps = (vnode: VNode): unknown[] => {
  return vnode[vnode_getPropStartIndex(vnode)] as unknown[];
};

export const mapApp_findIndx = <T>(
  array: (T | null)[],
  key: string,
  start: number,
): number => {
  let bottom = (start as number) >> 1;
  let top = (array.length - 2) >> 1;
  while (bottom <= top) {
    const mid = bottom + ((top - bottom) >> 1);
    const midKey = array[mid << 1] as string;
    if (midKey === key) {
      return mid << 1;
    }
    if (midKey < key) {
      bottom = mid + 1;
    } else {
      top = mid - 1;
    }
  }
  return (bottom << 1) ^ -1;
};

export const mapArray_set = <T>(
  array: (T | null)[],
  key: string,
  value: T | null,
  start: number,
) => {
  const indx = mapApp_findIndx(array, key, start);
  if (indx >= 0) {
    if (value == null) {
      array.splice(indx, 2);
    } else {
      array[indx + 1] = value;
    }
  } else if (value != null) {
    array.splice(indx ^ -1, 0, key as any, value);
  }
};

export const vnode_ensureElementInflated = (vnode: VNode) => {
  const flags = vnode[VNodeProps.flags];
  if ((flags & VNodeFlags.INFLATED_TYPE_MASK) === VNodeFlags.Element) {
    const elementVNode = vnode;
    elementVNode[VNodeProps.flags] ^= VNodeFlags.Inflated;
    const element = elementVNode[ElementVNodeProps.element];
    const attributes = (element as any).attributes;
    const props = vnode_getProps(elementVNode);
    for (let idx = 0; idx < attributes.length; idx++) {
      const attr = attributes[idx];
      const key = attr.name;
      if (key === Q_PROPS_SEPARATOR || !key) {
        // SVG in Domino does not support ':' so it becomes an empty string.
        // all attributes after the ':' are considered immutable, and so we ignore them.
        break;
      } else if (key.startsWith(QContainerAttr)) {
        if (
          attr.value === QContainerValue.TEXT &&
          'value' in (element as any)
        ) {
          mapArray_set(props, 'value', (element as any).value, 0);
        }
      } else if (!key.startsWith('on:')) {
        const value = attr.value;
        mapArray_set(props, key, value, 0);
      }
    }
  }
};

export const vnode_getAttrKeys = (vnode: VNode): string[] => {
  const type = vnode[VNodeProps.flags];
  if ((type & VNodeFlags.ELEMENT_OR_VIRTUAL_MASK) !== 0) {
    vnode_ensureElementInflated(vnode);
    const keys: string[] = [];
    const props = vnode_getProps(vnode);
    for (let i = 0; i < props.length; i = i + 2) {
      const key = props[i] as string;
      if (!key.startsWith(Q_PROPS_SEPARATOR)) {
        keys.push(key);
      }
    }
    return keys;
  }
  return [];
};

export const mapArray_get = <T>(
  array: (T | null)[],
  key: string,
  start: number,
): T | null => {
  const indx = mapApp_findIndx(array, key, start);
  if (indx >= 0) {
    return array[indx + 1] as T | null;
  } else {
    return null;
  }
};

export const vnode_getAttr = (vnode: VNode, key: string): string | null => {
  const type = vnode[VNodeProps.flags];
  if ((type & VNodeFlags.ELEMENT_OR_VIRTUAL_MASK) !== 0) {
    vnode_ensureElementInflated(vnode);
    const props = vnode_getProps(vnode);
    return mapArray_get(props as string[], key, 0);
  }
  return null;
};

export function normalizeName(str: string) {
  const array = str.split('_');
  if (array.length > 0) {
    const componentName = array[0];
    return (
      componentName.charAt(0).toUpperCase() +
      componentName.slice(1).toLowerCase()
    );
  } else {
    return '';
  }
}

export function removeNodeFromTree(
  tree: TreeNode[],
  callback: (node: TreeNode) => boolean,
) {
  return tree.filter((node) => {
    if (callback(node)) {
      return false;
    }
    if (node.children && node.children.length > 0) {
      node.children = removeNodeFromTree(node.children, callback);
    }

    return true;
  });
}


export const STORE_TARGET = Symbol('store.target');

export const isStore = (value: StoreTarget): boolean => {
  return STORE_TARGET in value;
};

export const isTask = (value: any): boolean => {
  return value.constructor?.name === 'Task';
};