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

export function traverseQwik(code: string, visitor: Visitor, state?: any): void {
  const parsed = parseSync('file.tsx', code, {
    lang: 'tsx',
    sourceType: 'module',
    astType: 'ts',
    range: true,
  })
  const program: unknown = parsed.program as unknown

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


