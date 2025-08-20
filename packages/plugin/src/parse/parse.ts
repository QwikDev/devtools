import { parseSync } from 'oxc-parser'
import { HOOK_NAME_LIST, HookType, ParsedStructure } from "@devtools/kit"



// Precompute for quick membership checks
const HOOK_NAMES = new Set<string>(HOOK_NAME_LIST as readonly string[])

/**
 * Parse TSX source and extract Qwik hook declarations in source order.
 */
export function parseQwikCode(code: string): ParsedStructure[] {
  const collected: Array<ParsedStructure> = []

  const parsed = parseSync('file.tsx', code, {
    lang: 'tsx',
    sourceType: 'module',
    astType: 'ts',
    range: true,
  })

  const program: unknown = parsed.program as unknown

  function isAstNodeLike(value: unknown): value is { type: string } {
    return Boolean(value) && typeof value === 'object' && 'type' in (value as Record<string, unknown>)
  }

  function getVariableIdentifierName(id: unknown): string | null {
    if (!isAstNodeLike(id)) return null
    return id.type === 'Identifier' ? (id as any).name as string : null
  }

  function normalizeHookName(raw: string): string {
    return raw.endsWith('$') ? raw.slice(0, -1) : raw
  }

  function isKnownHook(name: string): name is HookType {
    return HOOK_NAMES.has(name)
  }

  function getNodeStart(node: unknown): number {
    if (node && typeof node === 'object') {
      // oxc optionally emits `range: [start, end]`, else some nodes have `start`
      const maybeRange = (node as any).range
      if (Array.isArray(maybeRange)) return maybeRange[0] ?? 0
      const maybeStart = (node as any).start
      if (typeof maybeStart === 'number') return maybeStart
    }
    return 0
  }

  function visit(node: unknown): void {
    if (!isAstNodeLike(node)) return

    // Match: const <id> = useHook$(...)
    if (node.type === 'VariableDeclarator') {
      const init = (node as any).init
      if (init && isAstNodeLike(init) && (init as any).type === 'CallExpression') {
        const callee = (init as any).callee
        if (callee && isAstNodeLike(callee) && (callee as any).type === 'Identifier') {
          const rawName: string = (callee as any).name
          const hookName = normalizeHookName(rawName)
          if (isKnownHook(hookName)) {
            const variableName = getVariableIdentifierName((node as any).id)
            if (variableName) {
              collected.push({
                variableName,
                hookType: hookName as HookType,
                category: 'hook',
                __start__: getNodeStart(node),
              })
            }
          }
        }
      }
    }

    // Generic deep traversal
    for (const key of Object.keys(node as Record<string, unknown>)) {
      const value = (node as any)[key]
      if (Array.isArray(value)) {
        for (const child of value) visit(child)
      } else {
        visit(value)
      }
    }
  }

  visit(program)

  collected.sort((a, b) => (a.__start__ ?? 0) - (b.__start__ ?? 0))
  return collected.map(({ __start__, ...rest }) => rest)
}