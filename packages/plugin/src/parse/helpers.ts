import { VARIABLE_DECLARATION_LIST, EXPRESSION_STATEMENT_LIST, USE_HOOK_LIST, HookType } from '@devtools/kit'

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

export function normalizeQrlHookName(hookName: string): string {
  return hookName.endsWith('Qrl') ? hookName.slice(0, -3) : hookName
}

export function findLineStart(code: string, index: number): number {
  let lineStart = index
  for (let i = index - 1; i >= 0; i--) {
    const ch = code[i]
    if (ch === '\n' || ch === '\r') { lineStart = i + 1; break }
    if (i === 0) lineStart = 0
  }
  return lineStart
}

export function readIndent(code: string, indexFrom: number): string {
  let indent = ''
  let i = indexFrom
  while (i < code.length) {
    const ch = code[i]
    if (ch === ' ' || ch === '\t') { indent += ch; i++ } else { break }
  }
  return indent
}

export function buildCollecthookPayload(
  indent: string,
  variableName: string,
  category: 'VariableDeclarator' | 'expressionStatement',
  returnType: string,
  hookExpression: string | 'undefined',
): string {
  const hookLine = hookExpression === 'undefined' ? 'undefined' : hookExpression
  return (
`${indent}collecthook({
${indent}  variableName: '${variableName}',
${indent}  category: '${category}',
${indent}  returnType: '${returnType}',
${indent}  hook: ${hookLine}
${indent}});\n`
  )
}

export function hasCollecthookAfterByVariableId(code: string, fromIndex: number, variableId: string, maxLookahead = 600): boolean {
  const lookahead = code.slice(fromIndex, fromIndex + maxLookahead)
  const alreadyInserted = new RegExp(`collecthook\\s*\\(\\s*\\{[\\s\\S]{0,300}?hook:\\s*${variableId}\\b`).test(lookahead)
  return alreadyInserted
}

export function hasCollecthookAfterByVariableName(code: string, fromIndex: number, variableName: string, maxLookahead = 600): boolean {
  const lookahead = code.slice(fromIndex, fromIndex + maxLookahead)
  const alreadyInserted = new RegExp(`collecthook\\s*\\(\\s*\\{[\\s\\S]{0,200}?variableName:\\s*'${variableName}'`).test(lookahead)
  return alreadyInserted
}

export function trimStatementSemicolon(segment: string): string {
  return segment.trim().replace(/;?\s*$/, '')
}


export function isCustomHook(hookName: string): boolean {
  return !(USE_HOOK_LIST.some(item => item.startsWith(hookName))) && /^use[A-Z_]/.test(hookName)
}