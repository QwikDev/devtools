import { parseSync } from 'oxc-parser';
import { isAstNodeLike } from './helpers';

// ============================================================================
// Types
// ============================================================================

export interface NodePath<T = any> {
  node: T;
  parent: any | null;
  key: string | number | null;
  index: number | null;
  state: any;
  stop: () => void;
  skip: () => void;
}

type VisitFn = (path: NodePath) => void;
type VisitObj = { enter?: VisitFn; exit?: VisitFn };

export type Visitor = {
  enter?: VisitFn;
  exit?: VisitFn;
  [type: string]: VisitFn | VisitObj | undefined;
};

export interface ComponentBodyRange {
  insertPos: number;
  bodyStart: number;
  bodyEnd: number;
  exportName?: string;
}

// ============================================================================
// Parser
// ============================================================================

/**
 * Parses TypeScript/JSX code into an AST using oxc-parser
 */
export function parseProgram(code: string): unknown {
  const parsed = parseSync('file.tsx', code, {
    lang: 'tsx',
    sourceType: 'module',
    astType: 'ts',
    range: true,
  });
  return parsed.program as unknown;
}

// ============================================================================
// Traverser
// ============================================================================

/**
 * Calls the appropriate visitor function for enter/exit events
 */
function callVisitor(
  visitor: Visitor | undefined,
  type: string,
  hook: 'enter' | 'exit',
  path: NodePath,
): void {
  if (!visitor) return;

  // Call generic enter/exit handler
  const specific = visitor[type] as VisitFn | undefined;
  if (specific) specific(path);

  // Call type-specific handler
  const handler = visitor[path.node && (path.node as any).type] as VisitFn | VisitObj | undefined;
  if (!handler) return;

  if (typeof handler === 'function' && hook === 'enter') {
    handler(path);
    return;
  }

  if (typeof handler === 'object') {
    const fn = handler[hook];
    if (fn) fn(path);
  }
}

/**
 * Traverses an AST program with a visitor pattern
 */
export function traverseProgram(program: unknown, visitor: Visitor, state?: any): void {
  let shouldStopAll = false;

  function traverse(
    node: unknown,
    parent: unknown,
    key: string | number | null,
    index: number | null,
  ): void {
    if (shouldStopAll) return;
    if (!isAstNodeLike(node)) return;

    let shouldSkipChildren = false;

    const path: NodePath = {
      node,
      parent: isAstNodeLike(parent) ? parent : null,
      key,
      index,
      state,
      stop: () => { shouldStopAll = true; },
      skip: () => { shouldSkipChildren = true; },
    };

    // Enter phase
    callVisitor(visitor, 'enter', 'enter', path);

    // Traverse children
    if (!shouldSkipChildren) {
      const record = node as Record<string, unknown>;
      for (const k of Object.keys(record)) {
        const value = record[k];
        if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            traverse(value[i], node, k, i);
          }
        } else {
          traverse(value, node, k, null);
        }
      }
    }

    // Exit phase
    callVisitor(visitor, 'exit', 'exit', path);
  }

  traverse(program, null, null, null);
}

/**
 * Parses code and traverses the resulting AST
 */
export function traverseQwik(code: string, visitor: Visitor, state?: any): void {
  const program = parseProgram(code);
  traverseProgram(program, visitor, state);
}

// ============================================================================
// Component Body Detection
// ============================================================================

/**
 * Finds all component$ function bodies in the AST and returns their positions
 */
export function findAllComponentBodyRangesFromProgram(program: unknown): ComponentBodyRange[] {
  const ranges: ComponentBodyRange[] = [];

  traverseProgram(program, {
    enter: (path) => {
      const node: any = path.node;
      if (!node || node.type !== 'CallExpression') return;

      // Check if this is a component$ call
      const callee = node.callee;
      if (!callee || callee.type !== 'Identifier' || callee.name !== 'component$') return;

      // Get the function argument
      const firstArg = node.arguments?.[0];
      const isFunction =
        firstArg?.type === 'ArrowFunctionExpression' ||
        firstArg?.type === 'FunctionExpression';
      if (!isFunction) return;

      // Get the function body block
      const body = firstArg.body;
      if (body?.type !== 'BlockStatement' || !Array.isArray(body.range)) return;

      const start = body.range[0] as number;
      const end = body.range[1] as number;

      // Detect export name from parent context
      const exportName = detectExportName(path.parent);

      ranges.push({
        insertPos: start + 1,
        bodyStart: start,
        bodyEnd: end,
        exportName,
      });
    },
  });

  // De-duplicate and sort by position ascending
  return deduplicateAndSort(ranges);
}

/**
 * Detects the export name from the parent node context
 */
function detectExportName(parent: any): string | undefined {
  if (!parent) return undefined;

  if (parent.type === 'ExportDefaultDeclaration') {
    return '';
  }

  if (parent.type === 'VariableDeclarator') {
    const id = parent.id;
    if (id?.type === 'Identifier' && typeof id.name === 'string') {
      return id.name;
    }
  }

  return undefined;
}

/**
 * Removes duplicate ranges and sorts by insertPos ascending
 */
function deduplicateAndSort(ranges: ComponentBodyRange[]): ComponentBodyRange[] {
  const seen = new Set<number>();
  const unique = ranges.filter((r) => {
    if (seen.has(r.insertPos)) return false;
    seen.add(r.insertPos);
    return true;
  });
  return unique.sort((a, b) => a.insertPos - b.insertPos);
}
