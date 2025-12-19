import type { TreeNode } from '../../components/Tree/Tree';
import type { ParsedStructure } from '@devtools/kit';
import { CAPTURE_REF_KEY, COMPUTED_QRL_KEY, QRL_KEY } from '@devtools/kit';
import debug from 'debug';
import { TreeBuilder } from './TreeBuilder';
import {
  HOOK_TYPES,
  HIDDEN_HOOKS,
  QRL_HOOKS,
  type HookType,
  type HookFilterItem,
  type QRLInternal,
} from './types';

const log = debug('qwik:devtools:renderTree');

// ============================================================================
// HookStore Class
// ============================================================================

interface HookStoreEntry {
  set: Set<unknown>;
  visible: boolean;
}

/**
 * Manages hook data storage and tree building for the devtools.
 */
export class HookStore {
  private store: Record<HookType, HookStoreEntry>;
  private treeBuilder: TreeBuilder;

  constructor() {
    this.store = this.createStore();
    this.treeBuilder = new TreeBuilder();
  }

  private createStore(): Record<HookType, HookStoreEntry> {
    const store = {} as Record<HookType, HookStoreEntry>;
    for (const hookType of HOOK_TYPES) {
      store[hookType] = {
        set: new Set(),
        visible: !HIDDEN_HOOKS.includes(hookType),
      };
    }
    return store;
  }

  // ==========================================================================
  // Data Management
  // ==========================================================================

  /**
   * Add data to the store for a specific hook type
   */
  add(type: HookType, data: ParsedStructure | { data: Record<string, unknown> }): void {
    this.store[type].set.add(data);
  }

  /**
   * Clear all stored hook data
   */
  clear(): void {
    for (const entry of Object.values(this.store)) {
      entry.set.clear();
    }
  }

  /**
   * Reset the entire store
   */
  reset(): void {
    this.store = this.createStore();
  }

  /**
   * Get entries for a specific hook type
   */
  getEntries(type: HookType): unknown[] {
    return [...this.store[type].set];
  }

  /**
   * Check if a hook type has entries
   */
  hasEntries(type: HookType): boolean {
    return this.store[type].set.size > 0;
  }

  // ==========================================================================
  // Visibility Management
  // ==========================================================================

  /**
   * Set visibility for a hook type
   */
  setVisibility(type: HookType, visible: boolean): void {
    this.store[type].visible = visible;
  }

  /**
   * Check if a hook type is visible
   */
  isVisible(type: HookType): boolean {
    return this.store[type].visible;
  }

  /**
   * Get filter list for UI
   */
  getFilterList(): HookFilterItem[] {
    return HOOK_TYPES.filter(
      (type) => this.hasEntries(type) && this.isVisible(type),
    ).map((key) => ({
      key,
      display: this.store[key].visible,
    }));
  }

  // ==========================================================================
  // Tree Building
  // ==========================================================================

  /**
   * Build tree nodes from all stored hook data
   */
  buildTree(): TreeNode[] {
    const result: TreeNode[] = [];

    for (const hookType of HOOK_TYPES) {
      if (!this.hasEntries(hookType) || !this.isVisible(hookType)) continue;

      const nodes = this.transformEntries(hookType);
      if (nodes.length > 0) {
        result.push(this.treeBuilder.createGroupNode(hookType, nodes));
      }
    }

    return result;
  }

  private transformEntries(hookType: HookType): TreeNode[] {
    const entries = this.getEntries(hookType);
    return entries.map((entry) => this.transformEntry(hookType, entry)).flat();
  }

  private transformEntry(hookType: HookType, entry: unknown): TreeNode[] {
    const typedEntry = entry as Record<string, unknown>;

    switch (hookType) {
      case 'props':
      case 'listens':
      case 'render':
        return this.treeBuilder.objectToTree(
          typedEntry.data as Record<string, unknown>,
        );

      case 'useTask':
      case 'useVisibleTask': {
        const scopeVars = this.findScopeVariables(typedEntry);
        return this.treeBuilder.objectToTree({
          [`let ${typedEntry.variableName ?? hookType} =`]: scopeVars,
        });
      }

      case 'customhook': {
        const captureRef = (typedEntry.data as Record<string, unknown>)?.[
          CAPTURE_REF_KEY
        ];
        return this.treeBuilder.objectToTree({
          [`let ${typedEntry.variableName ?? 'customhook'} = Scope `]: captureRef,
        });
      }

      default:
        return this.treeBuilder.objectToTree({
          [`let ${typedEntry.variableName ?? hookType} =`]: typedEntry.data,
        });
    }
  }

  findScopeVariables(item: Record<string, unknown>): string {
    const targets = (item.data as Record<string, unknown>)?.[
      CAPTURE_REF_KEY
    ] as unknown[] | undefined;

    if (!targets) return 'Scope []';

    const variableNames: string[] = [];

    for (const entry of Object.values(this.store)) {
      for (const storedEntry of entry.set) {
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

  // ==========================================================================
  // QRL Path Utilities
  // ==========================================================================

  /**
   * Find all QRL paths for code lookup
   */
  findAllQrlPaths(): string[] {
    const paths: string[] = [];

    for (const hookType of QRL_HOOKS) {
      const entries = this.getEntries(hookType);

      for (const entry of entries) {
        const extracted = this.extractQrlPath(
          hookType,
          entry as Record<string, unknown>,
        );

        if (extracted) {
          if (Array.isArray(extracted)) {
            paths.push(...extracted.filter(Boolean));
          } else {
            paths.push(extracted);
          }
        }
      }
    }

    log('findAllQrlPaths return: %O', paths);
    return paths.filter(Boolean);
  }

  private extractQrlPath(
    hookType: HookType,
    entry: Record<string, unknown>,
  ): string | string[] | null {
    if (hookType === 'listens') {
      const data = (entry.data ?? entry) as Record<string, unknown>;
      return Object.values(data)
        .map((v) => (v as QRLInternal)?.$chunk$)
        .filter((v): v is string => typeof v === 'string');
    }

    if (hookType === 'render') {
      const renderFn = (entry.data as Record<string, unknown>)?.render ?? entry;
      return QrlUtils.getPath(renderFn as QRLInternal);
    }

    const data = (entry.data ?? entry) as Record<string, unknown>;
    const qrlObj = data[QRL_KEY] ?? data[COMPUTED_QRL_KEY];
    return QrlUtils.getPath(qrlObj as QRLInternal);
  }
}

// ============================================================================
// QRL Utilities (Static)
// ============================================================================

/**
 * Static utilities for working with QRL objects
 */
export class QrlUtils {
  /**
   * Get the file path from a QRL object.
   * In dev mode, uses dev.file; in production, uses $chunk$.
   */
  static getPath(qrl: QRLInternal | null | undefined): string | null {
    if (!qrl) return null;
    if (qrl.dev) return qrl.dev.file;
    return qrl.$chunk$;
  }

  /**
   * Get the chunk name from a QRL for component identification
   */
  static getChunkName(qrl: QRLInternal): string {
    const splitPoint = '_component';
    const chunk = qrl.$chunk$;
    return chunk?.split(splitPoint)?.[0] ?? '';
  }

  /**
   * Normalize raw qseq data with parsed structure metadata
   */
  static normalizeData(
    qseq: Record<string, unknown>[],
    parsed: ParsedStructure[],
  ): ParsedStructure[] {
    return qseq.map((item, index) => ({
      data: item,
      ...parsed[index],
    }));
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

/** Global hook store instance */
const hookStore = new HookStore();

/** Get the global hook store instance */
export function getHookStore(): HookStore {
  return hookStore;
}

// Re-export HookType for convenience
export type { HookType };
