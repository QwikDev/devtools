import { isSignal, Signal } from '@qwik.dev/core';
import { TreeNode } from '../../components/Tree/Tree';

export const QSEQ = 'q:seq'
export const QPROPS = 'q:props'

let nodeIdCounter = 0;

/**
 * Convert object to TreeNode array
 * Special handling for Qwik's q:seq and other special properties
 */
export const objectToTree = (obj: any, parentPath: string = ''): TreeNode[] => {
  if (!obj || typeof obj !== 'object') {
    return [];
  }

  const result: TreeNode[] = [];

  // If it's an array
  if (Array.isArray(obj)) {
    return obj.map((item, index) => {
      const path = parentPath ? `${parentPath}[${index}]` : `[${index}]`;
      return createTreeNode(item, `[${index}]`, path);
    }).filter(Boolean) as TreeNode[];
  }

  // If it's an object
  Object.entries(obj).forEach(([key, value]) => {
    const path = parentPath ? `${parentPath}.${key}` : key;
    const node = createTreeNode(value, key, path);
    if (node) {
      result.push(node);
    }
  });

  return result;
};

/**
 * Create a single TreeNode
 */
function createTreeNode(value: any, key: string, path: string): TreeNode | null {
  const node: TreeNode =  createTreeNodeObj(key )
  // Handle null or undefined
  if (value === null || value === undefined) {
    node.label = `${key}: ${value}`;
    node.elementType = 'null';
    return node;
  }

  // Handle primitive types
  if (typeof value === 'boolean') {
    node.label = `${key}: ${value}`;
    node.elementType = 'boolean';
    return node;
  }

  if (typeof value === 'number') {
    node.label = `${key}: ${value}`;
    node.elementType = 'number';
    return node;
  }

  if (typeof value === 'string') {
    node.label = `${key}: "${value}"`;
    node.elementType = 'string';
    return node;
  }

  if (typeof value === 'function') {
    node.label = `${key}: ƒ()`;
    node.elementType = 'function';
    // Try to get function name
    if (value.name) {
      node.label = `${key}: ƒ ${value.name}()`;
    }
    return node;
  }

  // Handle arrays
  if (Array.isArray(value)) {
    node.label = `${key}: Array[${value.length}]`;
    node.elementType = 'array';
    node.children = value.map((item, index) => {
      const childPath = `${path}[${index}]`;
      return createTreeNode(item, index.toString(), childPath);
    }).filter(Boolean) as TreeNode[];
    return node;
  }

  // Handle objects
  if (typeof value === 'object') {
    if(value.constructor.name !== 'Object'){
      node.label = `${key}: Class {${value.constructor.name}}`;
      node.elementType = 'object';
    } else {
      const keys = Object.keys(value);
      node.label = `${key}: Object {${keys.length}}`;
      node.elementType = 'object';
  
      // Recursively process child properties
      node.children = Object.entries(value).map(([childKey, childValue]) => {
        const childPath = `${path}.${childKey}`;
        return createTreeNode(childValue, childKey, childPath);
      }).filter(Boolean) as TreeNode[];
    }
    return node;
  }

  return null;
}
/**
 * Convert signal or store objects to tree structure
 * Special handling for value property
 */
export const signalToTree = (signal: Signal): TreeNode[] => {
  
  if (isSignal(signal)) {
    const valueNode = createTreeNode(signal.value, 'value', 'value');
    return valueNode ? [valueNode] : [];
  }
  
  return objectToTree(signal);
};


/**
 * Convert task to tree structure
 */
export const taskToTree = (task: any): TreeNode[] => {
  const valueNode = createTreeNode(task, 'value', 'value');
  return valueNode ? [valueNode] : [];
};


export const createTreeNodeObj = (label: string, children: TreeNode[] = []): TreeNode => {
  return {
    id: `node-${nodeIdCounter++}`,
    label,
    props: {},
    children,
  };
}