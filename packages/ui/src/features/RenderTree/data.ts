import {
  COMPUTED_QRL_KEY,
  INNER_USE_HOOK,
  QRL_KEY,
} from '@devtools/kit';
import type { ParsedStructure } from '@devtools/kit';
import type { QRLInternal } from './types';

// Extend Window interface to include QWIK_DEVTOOLS_GLOBAL_STATE
declare global {
  interface Window {
    QWIK_DEVTOOLS_GLOBAL_STATE?: Record<string, ParsedStructure[]>;
  }
}

/**
 * Sequence entry from Qwik's q:seq containing QRL references.
 * Can have either $qrl$ (for tasks) or $computeQrl$ (for computed).
 */
interface QSeqEntry {
  [QRL_KEY]?: QRLInternal;
  [COMPUTED_QRL_KEY]?: QRLInternal;
}

/**
 * Check if a sequence entry is a user-defined hook (not internal devtools hook)
 */
function isUserDefinedHook(seq: QSeqEntry): boolean {
  const qrl = seq[QRL_KEY] ?? seq[COMPUTED_QRL_KEY];
  const chunkPath = qrl?.$chunk$ ?? '';
  return !chunkPath.includes(INNER_USE_HOOK);
}

/**
 * Filter sequence data to only include user-defined hooks
 * (excludes internal devtools hooks like useCollectHooks)
 */
export function filterUserDefinedHooks(allSeq: QSeqEntry[]): QSeqEntry[] {
  return allSeq.filter(isUserDefinedHook);
}

/**
 * Get parsed structure from global devtools state by QRL chunk name
 */
export function getQwikState(qrlChunkName: string): ParsedStructure[] {
  const globalState = window.QWIK_DEVTOOLS_GLOBAL_STATE ?? {};
  const matchingKey = Object.keys(globalState).find((key) =>
    key.endsWith(qrlChunkName),
  );

  if (!matchingKey) return [];

  const entries = globalState[matchingKey] ?? [];
  return entries.filter((item) => item.data !== undefined);
}

/**
 * Determine hook type from QRL chunk path
 */
function getHookTypeFromChunk(
  chunkPath: string,
): 'useTask' | 'useVisibleTask' {
  return chunkPath.includes('useTask') ? 'useTask' : 'useVisibleTask';
}

/**
 * Transform QRL sequence data to normalized parsed structure format
 */
export function transformQrlSequenceData(seqs: QSeqEntry[]): ParsedStructure[] {
  return seqs
    .filter(isUserDefinedHook)
    .filter((item) => item[QRL_KEY])
    .map((item) => {
      const qrl = item[QRL_KEY]!;
      const chunkPath = qrl.$chunk$ ?? '';
      const hookType = getHookTypeFromChunk(chunkPath);

      return {
        category: 'expressionStatement' as const,
        data: qrl,
        hookType,
        variableName: hookType,
      };
    });
}

// Legacy exports for backward compatibility
export const findInnerHook = filterUserDefinedHooks;
export const returnQrlData = transformQrlSequenceData;
