import {  parseProgram, findDefaultComponentBodyInsertPosFromProgram, traverseProgram, findFirstComponentBodyInsertPosFromProgram } from './traverse'
import {
  EXPRESSION_RETURN_TYPE_BY_HOOK,
  VARIABLE_RETURN_TYPE_BY_HOOK,
  isAstNodeLike,
  normalizeHookName,
  getVariableIdentifierName,
  isKnownHook,
  normalizeQrlHookName,
  findLineStart,
  readIndent,
  buildCollecthookPayload,
  hasCollecthookAfterByVariableId,
  hasCollecthookAfterByVariableName,
  trimStatementSemicolon,
  isCustomHook,
} from './helpers'
import { INNER_USE_HOOK, VIRTUAL_QWIK_DEVTOOLS_KEY } from '@devtools/kit'

export interface InjectOptions { path?: string }
export function parseQwikCode(code: string, options?: InjectOptions): string {
  const alreadyHasImport = new RegExp(`from\\s+['\"]${VIRTUAL_QWIK_DEVTOOLS_KEY}['\"]`).test(code)
  const alreadyHasInit = /const\s+collecthook\s*=\s*useCollectHooks\s*\(/g.test(code)

  const program: any = parseProgram(code) as any

  let importInsertPos = 0
  if (Array.isArray(program.body)) {
    for (const stmt of program.body) {
      if (stmt && stmt.type === 'ImportDeclaration' && Array.isArray(stmt.range)) {
        importInsertPos = Math.max(importInsertPos, stmt.range[1] as number)
      }
    }
  }

  let bodyInsertPos: number | null = findDefaultComponentBodyInsertPosFromProgram(program)
  if (bodyInsertPos == null) {
    bodyInsertPos = findFirstComponentBodyInsertPosFromProgram(program)
  }

  let result = code

  let importDelta = 0
  if (bodyInsertPos != null && !alreadyHasImport) {
    const importLine = `import { ${INNER_USE_HOOK} } from '${VIRTUAL_QWIK_DEVTOOLS_KEY}';\n`
    const before = result.slice(0, importInsertPos)
    const after = result.slice(importInsertPos)
    const needsPrefixNewline = importInsertPos > 0 && before[before.length - 1] !== '\n'
    const prefix = needsPrefixNewline ? '\n' : ''
    const suffix = after.startsWith('\n') ? '' : '\n'
    result = before + prefix + importLine + suffix + after
    importDelta = (prefix + importLine + suffix).length
  }

  if ( bodyInsertPos != null && !alreadyHasInit) {
    const absoluteInsert = bodyInsertPos + importDelta
    let insertIndex = absoluteInsert
    let i = absoluteInsert
    let prefixNewline = ''
    if (result[i] === '\r' && result[i + 1] === '\n') {
      i += 2
      insertIndex = i
    } else if (result[i] === '\n') {
      i += 1
      insertIndex = i
    } else {
      prefixNewline = '\n'
    }
    let indent = ''
    while (i < result.length) {
      const ch = result[i]
      if (ch === ' ' || ch === '\t') { indent += ch; i++ } else { break }
    }
    const arg = JSON.stringify(options?.path as string)
    const initLine = `${prefixNewline}${indent}const collecthook = ${INNER_USE_HOOK}(${arg})\n`
    result = result.slice(0, insertIndex) + initLine + result.slice(insertIndex)
  }

  if (bodyInsertPos != null) {
    const programForInjections: any = parseProgram(result) as any
    type InsertTask = { kind: 'insert'; pos: number; text: string }
    type ReplaceTask = { kind: 'replace'; start: number; end: number; text: string }
    type InjectionTask = InsertTask | ReplaceTask
    const tasks: InjectionTask[] = []
    traverseProgram(programForInjections, {
      enter: (path) => {
        const node: any = path.node as any
        if (!node) return

        if (node.type === 'VariableDeclarator') {
          const init = node.init
          if (!isAstNodeLike(init) || init.type !== 'CallExpression') return
          const callee = (init as any).callee
          if (!isAstNodeLike(callee) || callee.type !== 'Identifier') return
          const hookName = normalizeHookName(((callee as any).name) as string)
          const isQrlName = normalizeQrlHookName(hookName)
          const variableId = getVariableIdentifierName(node.id)
          if (!variableId) return

          if (hookName === INNER_USE_HOOK) return

          if (isCustomHook(isQrlName)) {
            const parent: any = path.parent as any
            const parentRange: number[] | undefined = parent && Array.isArray(parent.range) ? parent.range : undefined
            if (!parentRange) return
            const declStart = parentRange[0] as number
            const declEnd = parentRange[1] as number

            const lineStart = findLineStart(result, declStart)
            const indent = readIndent(result, lineStart)
            const payload = buildCollecthookPayload(indent, 'customhook', 'VariableDeclarator', 'qrl', variableId)
            if (hasCollecthookAfterByVariableId(result, declEnd, variableId)) return
            tasks.push({ kind: 'insert', pos: declEnd, text: '\n' + payload })
            return
          }
          if (!isKnownHook(isQrlName)) return

          const parent: any = path.parent as any
          const parentRange: number[] | undefined = parent && Array.isArray(parent.range) ? parent.range : undefined
          if (!parentRange) return
          const declStart = parentRange[0] as number
          const declEnd = parentRange[1] as number

          const lineStart = findLineStart(result, declStart)
          const indent = readIndent(result, lineStart)
          const returnType = VARIABLE_RETURN_TYPE_BY_HOOK.get(isQrlName) as unknown as string
          const payload = buildCollecthookPayload(indent, variableId, 'VariableDeclarator', String(returnType), variableId)
          if (hasCollecthookAfterByVariableId(result, declEnd, variableId)) return
          tasks.push({ kind: 'insert', pos: declEnd, text: '\n' + payload })
          return
        }
        if (node.type === 'ExpressionStatement') {
          const expr = node.expression
          if (!isAstNodeLike(expr) || expr.type !== 'CallExpression') return
          const callee = (expr as any).callee
          if (!isAstNodeLike(callee) || callee.type !== 'Identifier') return
          const hookName = normalizeHookName(((callee as any).name) as string)
          const isQrlName = normalizeQrlHookName(hookName)
          const isListed = isKnownHook(isQrlName)
          if (hookName === INNER_USE_HOOK) return
          const stmtRange: number[] | undefined = Array.isArray((node as any).range) ? (node as any).range : undefined
          if (!stmtRange) return
          const stmtStart = stmtRange[0] as number
          const stmtEnd = stmtRange[1] as number
          const lineStart = findLineStart(result, stmtStart)
          const indent = readIndent(result, lineStart)

          if (isListed) {
            const returnType = EXPRESSION_RETURN_TYPE_BY_HOOK.get(isQrlName) as unknown as string
            const payload = buildCollecthookPayload(indent, isQrlName, 'expressionStatement', String(returnType), 'undefined')
            if (hasCollecthookAfterByVariableName(result, stmtEnd, isQrlName)) return
            tasks.push({ kind: 'insert', pos: stmtEnd, text: '\n' + payload })
          } else if (isCustomHook(isQrlName)) {
            const stmtRange: number[] | undefined = Array.isArray((node as any).range) ? (node as any).range : undefined
            if (!stmtRange) return
            const stmtStart = stmtRange[0] as number
            const stmtEnd = stmtRange[1] as number
            const callSource = result.slice(stmtStart, stmtEnd)
            const lineStart2 = findLineStart(result, stmtStart)
            const indent2 = readIndent(result, lineStart2)
            const declLine = `${indent2}let _customhook = ${trimStatementSemicolon(callSource)};\n`
            const payload = buildCollecthookPayload(indent2, 'customhook', 'VariableDeclarator', 'qrl', '_customhook')
            tasks.push({ kind: 'replace', start: stmtStart, end: stmtEnd, text: declLine + payload })
          }
        }
      }
    })

    if (tasks.length > 0) {
      tasks.sort((a, b) => {
        const apos = a.kind === 'insert' ? a.pos : a.start
        const bpos = b.kind === 'insert' ? b.pos : b.start
        return bpos - apos
      })
      for (const t of tasks) {
        if (t.kind === 'insert') {
          result = result.slice(0, t.pos) + t.text + result.slice(t.pos)
        } else {
          result = result.slice(0, t.start) + t.text + result.slice(t.end)
        }
      }
    }
  }

  return result
}