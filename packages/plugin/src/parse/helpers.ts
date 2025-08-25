import { VARIABLE_DECLARATION_LIST, EXPRESSION_STATEMENT_LIST, HookType } from '@devtools/kit'

// Precomputed maps for O(1) lookups
export const VARIABLE_RETURN_TYPE_BY_HOOK = new Map<string, HookType>(
  (VARIABLE_DECLARATION_LIST ?? []).map(item => [item.hook, item.returnType as HookType])
)
export const EXPRESSION_RETURN_TYPE_BY_HOOK = new Map<string, HookType>(
  (EXPRESSION_STATEMENT_LIST ?? []).map(item => [item.hook, item.returnType as HookType])
)
export const ALL_HOOK_NAMES = new Set<string>([
  ...VARIABLE_RETURN_TYPE_BY_HOOK.keys(),
  ...EXPRESSION_RETURN_TYPE_BY_HOOK.keys(),
])

export function isAstNodeLike(value: unknown): value is { type: string } {
  return Boolean(value) && typeof value === 'object' && 'type' in (value as Record<string, unknown>)
}

export function normalizeHookName(raw: string): string {
  return raw.endsWith('$') ? raw.slice(0, -1) : raw
}

export function getNodeStart(node: unknown): number {
  if (node && typeof node === 'object') {
    const maybeRange = (node as any).range
    if (Array.isArray(maybeRange)) return maybeRange[0] ?? 0
    const maybeStart = (node as any).start
    if (typeof maybeStart === 'number') return maybeStart
  }
  return 0
}

export function getVariableIdentifierName(id: unknown): string | null {
  if (!isAstNodeLike(id)) return null
  return id.type === 'Identifier' ? (id as any).name as string : null
}

export function isKnownHook(name: string): name is HookType {
  return ALL_HOOK_NAMES.has(name)
}


