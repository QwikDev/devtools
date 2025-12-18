/**
 * Phase 1: Initialization Hook Injection
 * Injects collecthook setup and render stats at the beginning of each component body
 */

import { ComponentBodyRange } from './traverse';
import { readIndent } from './helpers';
import { INNER_USE_HOOK } from '@devtools/kit';
import type { InjectOptions, InitTask } from './types';

// ============================================================================
// Main Entry
// ============================================================================

/**
 * Injects collecthook initialization and render stats at the beginning of each component body
 */
export function injectInitHooks(
  code: string,
  bodies: ComponentBodyRange[],
  options?: InjectOptions,
): string {
  const tasks: InitTask[] = [];

  for (const body of bodies) {
    const task = createInitTask(code, body, options);
    if (task) {
      tasks.push(task);
    }
  }

  return applyTasks(code, tasks);
}

// ============================================================================
// Task Creation
// ============================================================================

/**
 * Creates an initialization task for a single component body
 */
function createInitTask(
  code: string,
  body: ComponentBodyRange,
  options?: InjectOptions,
): InitTask | null {
  const { insertPos, exportName } = body;

  // Skip if already has collecthook initialization
  if (hasExistingCollecthook(code, insertPos)) {
    return null;
  }

  // Calculate insertion position
  const { insertIndex, prefixNewline } = calculateInsertPosition(code, insertPos);
  const indent = readIndent(code, insertIndex);

  // Build initialization code
  const componentArg = buildComponentArg(options?.path, exportName);
  const initLine = `${prefixNewline}${indent}const collecthook = ${INNER_USE_HOOK}(${componentArg})\n`;

  return {
    start: insertIndex,
    end: insertIndex,
    text: initLine,
  };
}

// ============================================================================
// Position Helpers
// ============================================================================

function hasExistingCollecthook(code: string, insertPos: number): boolean {
  const lookahead = code.slice(insertPos, insertPos + 200);
  return /const\s+collecthook\s*=\s*useCollectHooks\s*\(/.test(lookahead);
}

function calculateInsertPosition(code: string, insertPos: number): {
  insertIndex: number;
  prefixNewline: string;
} {
  if (code[insertPos] === '\r' && code[insertPos + 1] === '\n') {
    return { insertIndex: insertPos + 2, prefixNewline: '' };
  }
  if (code[insertPos] === '\n') {
    return { insertIndex: insertPos + 1, prefixNewline: '' };
  }
  return { insertIndex: insertPos, prefixNewline: '\n' };
}

// ============================================================================
// Code Builders
// ============================================================================

/**
 * Builds the component argument string for collecthook initialization
 */
function buildComponentArg(path: string | undefined, exportName: string | undefined): string {
  const rawArg = String(path ?? '');
  const baseArg = rawArg.split('?')[0].split('#')[0];
  const suffix = buildComponentSuffix(baseArg, exportName);
  return JSON.stringify(`${baseArg}${suffix}`);
}

function buildComponentSuffix(baseArg: string, exportName: string | undefined): string {
  if (exportName && typeof exportName === 'string') {
    return `_${exportName}`;
  }

  if (baseArg.endsWith('index.tsx')) {
    const parts = baseArg.split('/');
    const parent = parts.length >= 2 ? parts[parts.length - 2] : 'index';
    return `_${parent.replace(/-/g, '_')}`;
  }

  const file = baseArg.split('/').pop() || '';
  const name = file.replace(/\.[^.]+$/, '');
  return name ? `_${name.replace(/-/g, '_')}` : '';
}


// ============================================================================
// Task Application
// ============================================================================

function applyTasks(code: string, tasks: InitTask[]): string {
  // Sort from last to first to keep positions stable
  tasks.sort((a, b) => b.start - a.start);

  let result = code;
  for (const task of tasks) {
    result = result.slice(0, task.start) + task.text + result.slice(task.end);
  }
  return result;
}

