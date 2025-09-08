import { parseSync } from 'oxc-parser'
import { isAstNodeLike } from './helpers'

export interface NodePath<T = any> {
  node: T
  parent: any | null
  key: string | number | null
  index: number | null
  state: any
  stop: () => void
  skip: () => void
}

type VisitFn = (path: NodePath) => void
type VisitObj = { enter?: VisitFn; exit?: VisitFn }
export type Visitor = {
  enter?: VisitFn
  exit?: VisitFn
  [type: string]: VisitFn | VisitObj | undefined
}

function callVisitor(visitor: Visitor | undefined, type: string, hook: 'enter' | 'exit', path: NodePath) {
  if (!visitor) return
  const specific = visitor[type] as VisitFn | undefined
  if (specific) specific(path)
  const handler = visitor[path.node && (path.node as any).type] as VisitFn | VisitObj | undefined
  if (!handler) return
  if (typeof handler === 'function' && hook === 'enter') {
    handler(path)
    return
  }
  if (typeof handler === 'object') {
    const fn = handler[hook]
    if (fn) fn(path)
  }
}

export function parseProgram(code: string): unknown {
  const parsed = parseSync('file.tsx', code, {
    lang: 'tsx',
    sourceType: 'module',
    astType: 'ts',
    range: true,
  })
  return parsed.program as unknown
}

export function traverseProgram(program: unknown, visitor: Visitor, state?: any): void {
  let shouldStopAll = false
  function inner(node: unknown, parent: unknown, key: string | number | null, index: number | null) {
    if (shouldStopAll) return
    if (!isAstNodeLike(node)) return
    let shouldSkipChildren = false
    const path: NodePath = {
      node,
      parent: isAstNodeLike(parent) ? parent : null,
      key,
      index,
      state,
      stop: () => { shouldStopAll = true },
      skip: () => { shouldSkipChildren = true },
    }
    callVisitor(visitor, 'enter', 'enter', path)
    if (!shouldSkipChildren) {
      const record = node as Record<string, unknown>
      for (const k of Object.keys(record)) {
        const value: unknown = (record as any)[k]
        if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) inner(value[i], node, k, i)
        } else {
          inner(value, node, k, null)
        }
      }
    }
    callVisitor(visitor, 'exit', 'exit', path)
  }
  inner(program, null, null, null)
}

export function traverseQwik(code: string, visitor: Visitor, state?: any): void {
  const program: unknown = parseProgram(code)
  traverseProgram(program, visitor, state)
}

export interface ComponentBodyRange { insertPos: number; bodyStart: number; bodyEnd: number; exportName?: string }

export function findAllComponentBodyRangesFromProgram(program: unknown): ComponentBodyRange[] {
  const ranges: ComponentBodyRange[] = []
  traverseProgram(program, {
    enter: (path) => {
      const node: any = path.node as any
      if (!node) return
      // collect any component$ call expression
      if (node.type === 'CallExpression') {
        const callee = node.callee
        if (callee && callee.type === 'Identifier' && callee.name === 'component$') {
          const firstArg = node.arguments && node.arguments[0]
          if (firstArg && (firstArg.type === 'ArrowFunctionExpression' || firstArg.type === 'FunctionExpression')) {
            const body = firstArg.body
            if (body && body.type === 'BlockStatement' && Array.isArray(body.range)) {
              const start = (body.range[0] as number)
              const end = (body.range[1] as number)
              // detect export form to derive a name hint
              let exportName: string | undefined
              const parent: any = path.parent as any
              if (parent && parent.type === 'ExportDefaultDeclaration') {
                exportName = 'default'
              } else if (parent && parent.type === 'VariableDeclarator') {
                const id = (parent as any).id
                if (id && id.type === 'Identifier' && typeof id.name === 'string') {
                  exportName = id.name as string
                }
              }
              ranges.push({ insertPos: start + 1, bodyStart: start, bodyEnd: end, exportName })
            }
          }
        }
      }
    }
  })
  // de-duplicate and sort by position ascending
  const seen = new Set<number>()
  const unique = ranges.filter(r => {
    if (seen.has(r.insertPos)) return false
    seen.add(r.insertPos)
    return true
  })
  unique.sort((a, b) => a.insertPos - b.insertPos)
  return unique
}


