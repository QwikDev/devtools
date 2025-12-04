import type { TreeNode } from '../../components/Tree/Tree';
import {
  CAPTURE_REF_KEY,
  CHUNK_KEY,
  COMPUTED_QRL_KEY,
  QRL_KEY,
} from '@devtools/kit';
import type { QRL } from '@qwik.dev/core';
import {
  HOOK_TYPES,
  HIDDEN_HOOKS,
  QRL_HOOKS,
  type HookType,
  type HookFilterItem,
} from './types';
import { TreeBuilder } from './TreeBuilder';

/**
 * Store for managing hook data collected from components.
 * Replaces the previous module-level global state.
 */
export class HookDataStore {
  private data: Map<HookType, Set<unknown>> = new Map();
  private visibilityConfig: Map<HookType, boolean> = new Map();

  constructor() {
    this.initializeStore();
  }

  private initializeStore(): void {
    for (const hookType of HOOK_TYPES) {
      this.data.set(hookType, new Set());
      this.visibilityConfig.set(hookType, !HIDDEN_HOOKS.includes(hookType));
    }
  }

  /**
   * Add data for a specific hook type
   */
  add(type: HookType, entry: unknown): void {
    const set = this.data.get(type);
    if (set) {
      set.add(entry);
    }
  }

  /**
   * Get all entries for a specific hook type
   */
  get(type: HookType): unknown[] {
    return [...(this.data.get(type) ?? [])];
  }

  /**
   * Get all data as a plain object
   */
  getAll(): Record<HookType, unknown[]> {
    const result = {} as Record<HookType, unknown[]>;
    for (const [type, set] of this.data) {
      result[type] = [...set];
    }
    return result;
  }

  /**
   * Check if a hook type has any data
   */
  has(type: HookType): boolean {
    return (this.data.get(type)?.size ?? 0) > 0;
  }

  /**
   * Clear all stored data
   */
  clear(): void {
    for (const set of this.data.values()) {
      set.clear();
    }
  }

  /**
   * Set visibility for a hook type
   */
  setVisibility(type: HookType, visible: boolean): void {
    this.visibilityConfig.set(type, visible);
  }

  /**
   * Check if a hook type is visible
   */
  isVisible(type: HookType): boolean {
    return this.visibilityConfig.get(type) ?? true;
  }

  /**
   * Get filter list for UI
   */
  getFilterList(): HookFilterItem[] {
    return HOOK_TYPES.filter(
      (type) => this.has(type) && this.isVisible(type),
    ).map((key) => ({
      key,
      display: this.isVisible(key),
    }));
  }

  /**
   * Build tree nodes from stored data
   */
  buildTree(): TreeNode[] {
    const builder = new TreeBuilder();
    const result: TreeNode[] = [];

    for (const hookType of HOOK_TYPES) {
      if (!this.has(hookType) || !this.isVisible(hookType)) {
        continue;
      }

      const entries = this.get(hookType);
      const nodes = this.transformEntriesToNodes(hookType, entries, builder);

      if (nodes.length > 0) {
        result.push(builder.createGroupNode(hookType, nodes));
      }
    }

    return result;
  }

  /**
   * Transform entries to tree nodes based on hook type
   */
  private transformEntriesToNodes(
    hookType: HookType,
    entries: unknown[],
    builder: TreeBuilder,
  ): TreeNode[] {
    return entries
      .map((entry) => this.transformSingleEntry(hookType, entry, builder))
      .flat()
      .filter(Boolean) as TreeNode[];
  }

  private transformSingleEntry(
    hookType: HookType,
    entry: unknown,
    builder: TreeBuilder,
  ): TreeNode[] {
    const typedEntry = entry as Record<string, unknown>;

    switch (hookType) {
      case 'props':
      case 'listens':
      case 'render':
        return builder.objectToTree(typedEntry.data as Record<string, unknown>);

      case 'useTask':
      case 'useVisibleTask': {
        const scopeVars = this.findScopeVariables(typedEntry);
        return builder.objectToTree({
          [`let ${typedEntry.variableName ?? hookType} =`]: scopeVars,
        });
      }

      case 'customhook': {
        const captureRef = (typedEntry.data as Record<string, unknown>)?.[
          CAPTURE_REF_KEY
        ];
        return builder.objectToTree({
          [`let ${typedEntry.variableName ?? 'customhook'} = Scope `]: captureRef,
        });
      }

      default:
        return builder.objectToTree({
          [`let ${typedEntry.variableName ?? hookType} =`]: typedEntry.data,
        });
    }
  }

  /**
   * Find scope variables for useTask/useVisibleTask
   */
  private findScopeVariables(entry: Record<string, unknown>): string {
    const targets = (entry.data as Record<string, unknown>)?.[
      CAPTURE_REF_KEY
    ] as unknown[] | undefined;

    if (!targets) return 'Scope []';

    const variableNames: string[] = [];

    for (const [, set] of this.data) {
      for (const storedEntry of set) {
        const entryData = storedEntry as Record<string, unknown>;
        const data = entryData?.data ?? entryData;
        if (!data) continue;

        const match = targets.find((target) => target === data);
        if (match && entryData.variableName) {
          variableNames.push(entryData.variableName as string);
        }
      }
    }

    return `Scope [${variableNames.join(', ')}]`;
  }

  /**
   * Find all QRL paths for code lookup
   */
  findAllQrlPaths(): string[] {
    const paths: string[] = [];

    for (const hookType of QRL_HOOKS) {
      const entries = this.get(hookType);

      for (const entry of entries) {
        const typedEntry = entry as Record<string, unknown>;
        const extracted = this.extractQrlPath(hookType, typedEntry);
        if (extracted) {
          if (Array.isArray(extracted)) {
            paths.push(...extracted.filter(Boolean));
          } else {
            paths.push(extracted);
          }
        }
      }
    }

    return paths.filter(Boolean);
  }

  private extractQrlPath(
    hookType: HookType,
    entry: Record<string, unknown>,
  ): string | string[] | null {
    if (hookType === 'listens') {
      const data = (entry.data ?? entry) as Record<string, unknown>;
      return Object.values(data)
        .map((v) => (v as Record<string, unknown>)?.[CHUNK_KEY] as string)
        .filter(Boolean);
    }

    if (hookType === 'render') {
      const renderFn =
        (entry.data as Record<string, unknown>)?.render ?? entry;
      return this.getQrlPath(renderFn as QRL);
    }

    const data = (entry.data ?? entry) as Record<string, unknown>;
    const qrlObj = data[QRL_KEY] ?? data[COMPUTED_QRL_KEY];
    return this.getQrlPath(qrlObj as QRL);
  }

  private getQrlPath(qrl: QRL | null | undefined): string | null {
    if (!qrl) return null;

    const qrlAny = qrl as unknown as Record<string, unknown>;
    if (qrlAny.dev) {
      return (qrlAny.dev as Record<string, string>).filename;
    }
    return qrlAny[CHUNK_KEY] as string | null;
  }
}

/**
 * Get the chunk name from a QRL for component identification
 */
export function getQrlChunkName(qrl: QRL): string {
  const splitPoint = '_component';
  const qrlAny = qrl as unknown as Record<string, unknown>;
  const chunk = qrlAny[CHUNK_KEY] as string | undefined;
  return chunk?.split(splitPoint)?.[0] ?? '';
}

// Singleton instance for global access (can be replaced with context in the future)
let storeInstance: HookDataStore | null = null;

export function getHookDataStore(): HookDataStore {
  if (!storeInstance) {
    storeInstance = new HookDataStore();
  }
  return storeInstance;
}

export function resetHookDataStore(): void {
  storeInstance = new HookDataStore();
}

