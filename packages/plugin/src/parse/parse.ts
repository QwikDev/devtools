import { HookType, ParsedStructure } from "@devtools/kit"
import { traverseQwik } from './traverse'
import {
  VARIABLE_RETURN_TYPE_BY_HOOK,
  EXPRESSION_RETURN_TYPE_BY_HOOK,
  isAstNodeLike,
  normalizeHookName,
  getNodeStart,
  getVariableIdentifierName,
  isKnownHook,
} from './helpers'



// helpers & maps are imported from './helpers'

/**
 * Parse TSX source and extract Qwik hook declarations in source order.
 */
export function parseQwikCode(code: string): ParsedStructure[] {
  const collected: Array<ParsedStructure> = []

  // Use traversal to collect hooks
  traverseQwik(code, {
    VariableDeclarator: (path) => {
      const node = path.node as any
      const init = node.init
      if (!isAstNodeLike(init) || init.type !== 'CallExpression') return
      const callee = (init as any).callee
      if (!isAstNodeLike(callee) || callee.type !== 'Identifier') return
      const hookName = normalizeHookName((callee as any).name as string)
      const isQrlName = hookName.endsWith('Qrl') ? hookName.slice(0, -3) : hookName
      if (!isKnownHook(isQrlName)) return
      const variableName = getVariableIdentifierName(node.id)
      if (!variableName) return
      collected.push({
        variableName,
        hookType: isQrlName as HookType,
        category: 'variableDeclaration',
        __start__: getNodeStart(node),
        returnType: VARIABLE_RETURN_TYPE_BY_HOOK.get(isQrlName) as HookType,
      })
    },
    ExpressionStatement: (path) => {
      const node = path.node as any
      const expression = node.expression
      if (!isAstNodeLike(expression) || expression.type !== 'CallExpression') return
      const callee = (expression as any).callee
      if (!isAstNodeLike(callee) || callee.type !== 'Identifier') return
      const hookName = normalizeHookName((callee as any).name as string)
      const isQrlName = hookName.endsWith('Qrl') ? hookName.slice(0, -3) : hookName
      if (!isKnownHook(isQrlName)) return
      collected.push({
        variableName: isQrlName,
        hookType: isQrlName as HookType,
        category: 'expressionStatement',
        __start__: getNodeStart(node),
        returnType: EXPRESSION_RETURN_TYPE_BY_HOOK.get(isQrlName) as HookType,
      })
    }
  })

  collected.sort((a, b) => (a.__start__ ?? 0) - (b.__start__ ?? 0))
  return collected.map(({ __start__, ...rest }) => rest)
}

export interface QwikHookVisitor {
  Hook?: (node: Omit<ParsedStructure, '__start__'>) => void
  VariableDeclaration?: (node: Omit<ParsedStructure, '__start__'> & { category: 'variableDeclaration' }) => void
  ExpressionStatement?: (node: Omit<ParsedStructure, '__start__'> & { category: 'expressionStatement' }) => void
}

/**
 * Traverse parsed hooks with a visitor-like API.
 * Similar to Babel traverse: pass callbacks in a visitor object.
 */
export function traverseQwikCode(
  code: string,
  visitor: QwikHookVisitor
): void {
  const items = parseQwikCode(code)
  for (const item of items) {
    // Generic hook callback
    visitor.Hook?.(item)
    if (item.category === 'variableDeclaration') {
      visitor.VariableDeclaration?.(item as any)
    } else if (item.category === 'expressionStatement') {
      visitor.ExpressionStatement?.(item as any)
    }
  }
}