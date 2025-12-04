import type { TreeNode } from '../../components/Tree/Tree';
import { TreeBuilder } from './TreeBuilder';

/**
 * Shared TreeBuilder instance for backward compatibility
 */
const builder = new TreeBuilder();

/**
 * Convert object to TreeNode array
 * @deprecated Use TreeBuilder.objectToTree() directly instead
 */
export const objectToTree = (obj: unknown, parentPath = ''): TreeNode[] => {
  return builder.objectToTree(obj, parentPath);
};

/**
 * Create a group TreeNode with label and children
 * @deprecated Use TreeBuilder.createGroupNode() directly instead
 */
export const createTreeNodeObj = (
  label: string,
  children: TreeNode[] = [],
): TreeNode => {
  return builder.createGroupNode(label, children);
};

/**
 * Reset the internal ID counter
 * Useful for testing to get deterministic IDs
 */
export const resetIdCounter = (): void => {
  builder.resetIdCounter();
};
