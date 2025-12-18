import { VIRTUAL_QWIK_DEVTOOLS_KEY, INNER_USE_HOOK } from '@devtools/kit';
import useCollectHooksSource from './useCollectHooks';
import qwikComponentProxySource from './qwikComponentProxy';
import { parseQwikCode } from '../parse/parse';
import { debug } from 'debug';

const log = debug('qwik:devtools:plugin');

// ============================================================================
// Types & Configuration
// ============================================================================

export interface VirtualModuleConfig {
  key: string;
  source: string;
  hookName: string;
}

export const VIRTUAL_MODULES: VirtualModuleConfig[] = [
  {
    key: VIRTUAL_QWIK_DEVTOOLS_KEY,
    source: useCollectHooksSource,
    hookName: INNER_USE_HOOK,
  },
  {
    // Perf tracking: used by `plugin/statistics.ts` to rewrite `componentQrl` imports
    key: 'virtual:qwik-component-proxy',
    source: qwikComponentProxySource,
    hookName: '',
  }
];

// ============================================================================
// Virtual Module Helpers
// ============================================================================

export function normalizeId(id: string): string {
  return id.split('?')[0].split('#')[0];
}

export function getIdVariations(key: string): string[] {
  return [key, `/${key}`, `\u0000${key}`, `/@id/${key}`];
}

export function isVirtualId(id: string, key: string): boolean {
  return getIdVariations(key).includes(normalizeId(id));
}

export function findVirtualModule(id: string): VirtualModuleConfig | undefined {
  return VIRTUAL_MODULES.find((module) => isVirtualId(id, module.key));
}

// ============================================================================
// Code Transform Helpers
// ============================================================================

function injectImportIfMissing(code: string, key: string, hookName: string): string {
  if (!code.includes(key)) {
    return `import { ${hookName} } from '${key}';\n${code}`;
  }
  log('importing virtual qwik devtools', key, code);
  return code;
}

export function transformComponentFile(code: string, id: string): string {
  // Inject useCollectHooks import
  code = injectImportIfMissing(code, VIRTUAL_QWIK_DEVTOOLS_KEY, INNER_USE_HOOK);
  // Parse and transform the Qwik code
  return parseQwikCode(code, { path: id });
}

export function transformRootFile(code: string): string {
  const mode = process.env.MODE;
  const importPath = mode === 'dev' ? '@devtools/ui' : '@qwik.dev/devtools/ui';

  // Add QwikDevtools import if not present
  if (!code.includes(importPath)) {
    code = `import { QwikDevtools } from '${importPath}';\n${code}`;
  }

  // Inject QwikDevtools component before closing body tag
  const bodyMatch = code.match(/<body[^>]*>([\s\S]*?)<\/body>/);
  if (bodyMatch) {
    const bodyContent = bodyMatch[1];
    const newBodyContent = `${bodyContent}\n        <QwikDevtools />`;
    code = code.replace(bodyContent, newBodyContent);
  }

  return code;
}

