import type { Plugin } from 'vite';
import { debug } from 'debug';
import perfLazyWrapperPreamble from '../virtualmodules/perfLazyWrapperPreamble';
import { isVirtualId, normalizeId } from '../virtualmodules/virtualModules';

/**
 * Statistics plugin: collect Qwik render performance.
 *
 * Responsibilities (kept similar to `plugin/devtools.ts` structure):
 * - Transform: rewrite `componentQrl` imports to a virtual module
 * - Transform: wrap Qwik-generated lazy render modules (`_component_`) to record perf entries
 * - Dev SSR: inject SSR perf snapshot into final HTML
 *
 * The virtual module source for `componentQrl` is registered in:
 * - `packages/plugin/src/virtualmodules/qwikComponentProxy.ts`
 * and is served by the core devtools plugin (`plugin/devtools.ts`) via `virtualmodules/virtualModules.ts`.
 *
 * Data sinks:
 * - **CSR**: `window.__QWIK_PERF__ = { ssr: [], csr: [] }`
 * - **SSR**: stored on `process` (preferred) or `globalThis` as `__QWIK_SSR_PERF__`
 */

// ============================================================================
// Constants
// ============================================================================

const PERF_VIRTUAL_ID = 'virtual:qwik-component-proxy';
const log = debug('qwik:devtools:perf');

type AnyRecord = Record<string, any>;

// ============================================================================
// Shared env helpers
// ============================================================================

function getStoreForSSR(): AnyRecord {
  // NOTE: Vite SSR module-runner may execute in an isolated context; `globalThis` may not be
  // the same as the dev server's `globalThis`. Using `process` is usually cross-context.
  return typeof process !== 'undefined' && process
    ? (process as unknown as AnyRecord)
    : (globalThis as AnyRecord);
}

function isFromNodeModules(cleanId: string): boolean {
  return cleanId.includes('/node_modules/') || cleanId.includes('\\node_modules\\');
}

function isUiLibBuildOutput(cleanId: string): boolean {
  // Avoid rewriting the already-built UI library (`.qwik.mjs` etc).
  return cleanId.includes('/packages/ui/lib/') || cleanId.includes('\\packages\\ui\\lib\\');
}

function shouldTransformSource(id: string): boolean {
  const cleanId = normalizeId(id);
  // We intentionally do NOT skip all virtual modules: Qwik (and Vite) generate many `\0` ids,
  // and SSR instrumentation needs to cover them. We only skip third-party deps / build outputs.
  return !isFromNodeModules(cleanId) && !isUiLibBuildOutput(cleanId);
}

function isPerfVirtualModuleId(id: string): boolean {
  return isVirtualId(id, PERF_VIRTUAL_ID);
}

// ============================================================================
// Transform: rewrite componentQrl import
// ============================================================================

function rewriteComponentQrlImport(code: string, id: string): { code: string; changed: boolean } {
  if (!code.includes('@qwik.dev/core') || !code.includes('componentQrl')) {
    return { code, changed: false };
  }

  // Match: `import { ... componentQrl ... } from '@qwik.dev/core'`
  const importRe = /import\s*\{([^}]*)\}\s*from\s*['"]@qwik\.dev\/core['"]/g;
  let changed = false;
  const next = code.replace(importRe, (match, imports) => {
    const importList = String(imports)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const hasComponentQrl = importList.some(
      (imp) => imp === 'componentQrl' || imp.startsWith('componentQrl ')
    );
    if (!hasComponentQrl) return match;

    changed = true;
    log('rewrite componentQrl import %O', {
      id,
      isVirtual: normalizeId(id).startsWith('\0'),
    });

    // Filter out `componentQrl` (including `componentQrl as alias`)
    const filteredImports = importList.filter(
      (imp) => imp !== 'componentQrl' && !imp.startsWith('componentQrl ')
    );

    if (filteredImports.length === 0) {
      // Only `componentQrl` was imported: fully replace it
      return `import { componentQrl } from '${PERF_VIRTUAL_ID}'`;
    }

    // Keep other imports and add the virtual `componentQrl`
    return `import { ${filteredImports.join(
      ', '
    )} } from '@qwik.dev/core';\nimport { componentQrl } from '${PERF_VIRTUAL_ID}'`;
  });

  return { code: next, changed };
}

// ============================================================================
// Transform: wrap Qwik lazy render modules (`_component_`)
// ============================================================================

function findQwikLazyComponentExports(code: string): string[] {
  // Match: `export const XXX_component_HASH = ...`
  const exportRe = /export\s+const\s+(\w+_component_\w+)\s*=/g;
  const exports: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = exportRe.exec(code)) !== null) {
    exports.push(match[1]);
  }

  return exports;
}

function replaceExportWithOriginal(code: string, exportName: string): string {
  return code.replace(
    new RegExp(`export\\s+const\\s+${exportName}\\s*=`),
    `const __original_${exportName}__ =`
  );
}

function appendWrappedExport(code: string, exportName: string, id: string): string {
  return (
    code +
    `
export const ${exportName} = __qwik_wrap__(__original_${exportName}__, '${exportName}', '${id}');
`
  );
}

function wrapQwikLazyComponentExports(params: {
  code: string;
  id: string;
  exports: string[];
}): { code: string; changed: boolean } {
  const { exports, id } = params;
  if (exports.length === 0) return { code: params.code, changed: false };

  log('wrap _component_ exports %O', { id, count: exports.length });

  let modifiedCode = perfLazyWrapperPreamble + params.code;

  // Replace each export by wrapping the original function
  for (const exportName of exports) {
    modifiedCode = replaceExportWithOriginal(modifiedCode, exportName);
    modifiedCode = appendWrappedExport(modifiedCode, exportName, id);
  }

  return { code: modifiedCode, changed: true };
}

// ============================================================================
// Dev SSR: inject SSR perf snapshot into HTML
// ============================================================================

function createSsrPerfInjectionScript(entries: unknown[]): string {
  // Inject SSR perf data into the final HTML page so the UI can display it.
  return `
<script>
  window.__QWIK_PERF__ = window.__QWIK_PERF__ || { ssr: [], csr: [] };
  window.__QWIK_PERF__.ssr = ${JSON.stringify(entries)};
  window.dispatchEvent(new CustomEvent('qwik:ssr-perf', { detail: ${JSON.stringify(entries)} }));
</script>`;
}

type MiddlewareNext = (err?: unknown) => void;
type MinimalMiddlewareReq = { headers: Record<string, string | string[] | undefined>; url?: string };
type MinimalMiddlewareRes = {
  write: (...args: any[]) => any;
  end: (...args: any[]) => any;
  setHeader: (name: string, value: any) => void;
};

function attachSsrPerfInjectorMiddleware(server: any) {
  // In dev SSR, Qwik streams HTML; `transformIndexHtml` often runs before SSR rendering finishes,
  // causing `__QWIK_SSR_PERF__` to still be empty at injection time.
  // Instead, intercept the final HTML response and inject after SSR completes.
  server.middlewares.use((req: MinimalMiddlewareReq, res: MinimalMiddlewareRes, next: MiddlewareNext) => {
    const accept = req.headers.accept || '';
    if (!accept.includes('text/html')) return next();

    // The SSR collector uses "global accumulation + de-dupe".
    // Do NOT clear it per-request, otherwise we may inject empty data if sampling hasn't occurred yet.
    const store = getStoreForSSR() as unknown as Record<string, unknown>;

    const originalWrite = res.write.bind(res);
    const originalEnd = res.end.bind(res);

    let body = '';

    res.write = function (
      chunk: unknown,
      encodingOrCallback?: BufferEncoding | ((error?: Error | null) => void),
      callback?: (error?: Error | null) => void
    ): boolean {
      if (chunk) {
        body += typeof chunk === 'string' ? chunk : Buffer.from(chunk as any).toString();
      }
      // Don't flush immediately; inject on `end` (in dev it's OK to sacrifice streaming)
      if (typeof encodingOrCallback === 'function') encodingOrCallback();
      if (typeof callback === 'function') callback();
      return true;
    } as typeof res.write;

    res.end = function (
      chunk?: unknown,
      encodingOrCallback?: BufferEncoding | ((error?: Error | null) => void),
      callback?: (error?: Error | null) => void
    ): typeof res {
      if (chunk) {
        body += typeof chunk === 'string' ? chunk : Buffer.from(chunk as any).toString();
      }

      if (body.includes('</head>')) {
        const rawArr = store.__QWIK_SSR_PERF__;
        const entries = Array.isArray(rawArr) ? rawArr : [];
        log('inject ssr perf %O', { url: req.url, total: entries.length });
        const script = createSsrPerfInjectionScript(entries);

        // Place at the start of `<head>` so it runs earlier than other head scripts
        body = body.replace(/<head(\s[^>]*)?>/i, (m) => `${m}${script}`);
      }

      try {
        res.setHeader('Content-Length', Buffer.byteLength(body));
      } catch {
        // ignore
      }

      originalWrite(body);

      if (typeof encodingOrCallback === 'function') encodingOrCallback();
      if (typeof callback === 'function') callback();

      return originalEnd();
    } as typeof res.end;

    next();
  });
}

// ============================================================================
// Plugin factory (similar entry-point style to devtools.ts)
// ============================================================================

export function statisticsPlugin(): Plugin {
  return {
    name: 'vite:qwik-component-proxy-transform',
    enforce: 'post',
    apply: 'serve',
    transform(code, id) {
      // Avoid rewriting imports inside the perf virtual module itself (otherwise `originalComponentQrl`
      // could become self-referential/undefined)
      if (isPerfVirtualModuleId(id)) return null;

      // By default, skip dependencies and build outputs (otherwise we'd transform node_modules / ui's `.qwik.mjs` as well)
      if (!shouldTransformSource(id)) return null;

      let modifiedCode = code;
      let hasChanges = false;

      // 1) Replace `componentQrl` import from `@qwik.dev/core` -> virtual module
      const rewritten = rewriteComponentQrlImport(modifiedCode, id);
      modifiedCode = rewritten.code;
      hasChanges = hasChanges || rewritten.changed;

      // 2) Handle Qwik-generated lazy render function modules (`_component_`)
      const cleanId = normalizeId(id);
      if (cleanId.includes('_component_')) {
        const exports = findQwikLazyComponentExports(code);
        const wrapped = wrapQwikLazyComponentExports({ code: modifiedCode, id, exports });
        modifiedCode = wrapped.code;
        hasChanges = hasChanges || wrapped.changed;
      }

      if (!hasChanges) return null;
      return { code: modifiedCode, map: null };
    },

    configureServer(server) {
      attachSsrPerfInjectorMiddleware(server);
    },
  };
}