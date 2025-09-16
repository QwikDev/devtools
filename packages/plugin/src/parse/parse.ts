import {  parseProgram, findAllComponentBodyRangesFromProgram, traverseProgram } from './traverse'
import {
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
import { INNER_USE_HOOK } from '@devtools/kit'

export interface InjectOptions { path?: string }
export function parseQwikCode(code: string, options?: InjectOptions): string {

  const program: any = parseProgram(code) as any

  const allBodies = findAllComponentBodyRangesFromProgram(program)

  let result = code
  let index = 0

  if (allBodies.length > 0) {
    type Task = { start: number; end: number; text: string }
    const tasks: Task[] = []
    for (let idx = 0; idx < allBodies.length; idx++) {
      const { insertPos, exportName } = allBodies[idx] as any
      // skip if this body already has init
      const lookahead = result.slice(insertPos, insertPos + 200)
      if (/const\s+collecthook\s*=\s*useCollectHooks\s*\(/.test(lookahead)) continue

      let i = insertPos
      let insertIndex = insertPos
      let prefixNewline = ''
      if (result[i] === '\r' && result[i + 1] === '\n') { i += 2; insertIndex = i }
      else if (result[i] === '\n') { i += 1; insertIndex = i }
      else { prefixNewline = '\n' }

      const indent = readIndent(result, i)
      const rawArg = String(options?.path ?? '')
      const baseArg = rawArg.split('?')[0].split('#')[0]
      let suffix = ''
      
      if (exportName && typeof exportName === 'string') {
        suffix = `_${exportName}`
      }else {
        if (baseArg.endsWith('index.tsx')) {
          const parts = baseArg.split('/')
          const parent = parts.length >= 2 ? parts[parts.length - 2] : 'index'
          const safeParent = parent.replace(/-/g, '_')
          suffix = `_${safeParent}`
        } else {
          const file = baseArg.split('/').pop() || ''
          const name = file.replace(/\.[^.]+$/, '')
          const safeName = name.replace(/-/g, '_')
          suffix = name ? `_${safeName}` : ''
        }
      }
      const arg = JSON.stringify(`${baseArg}${suffix}`)
      const initLine = `${prefixNewline}${indent}const collecthook = ${INNER_USE_HOOK}(${arg})\n`
      tasks.push({ start: insertIndex, end: insertIndex, text: initLine })
    }
    // apply from last to first to keep positions stable
    tasks.sort((a, b) => b.start - a.start)
    for (const t of tasks) {
      result = result.slice(0, t.start) + t.text + result.slice(t.end)
    }
  }

  if (allBodies.length > 0) {
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
            const payload = buildCollecthookPayload(indent, variableId, 'customhook', 'VariableDeclarator', variableId)
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
          const payload = buildCollecthookPayload(indent, variableId, isQrlName, 'VariableDeclarator', variableId)
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
            const payload = buildCollecthookPayload(indent, isQrlName, isQrlName, 'expressionStatement', 'undefined')
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
            const variableName = `_customhook_${index}`
            const declLine = `${indent2}let ${variableName} = ${trimStatementSemicolon(callSource)};\n`
            const payload = buildCollecthookPayload(indent2, variableName, 'customhook', 'VariableDeclarator', variableName)
            index++
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