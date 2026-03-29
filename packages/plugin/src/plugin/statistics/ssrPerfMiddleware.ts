import type { AnyRecord } from './constants';
import { log } from './constants';

type MiddlewareNext = (err?: unknown) => void;
type MinimalMiddlewareReq = {
  headers: Record<string, string | string[] | undefined>;
  url?: string;
};
type MinimalMiddlewareRes = {
  write: (...args: any[]) => any;
  end: (...args: any[]) => any;
  setHeader: (name: string, value: any) => void;
};

export function attachSsrPerfInjectorMiddleware(server: any) {
  server.middlewares.use(
    (
      req: MinimalMiddlewareReq,
      res: MinimalMiddlewareRes,
      next: MiddlewareNext,
    ) => {
      const accept = req.headers.accept || '';
      if (!accept.includes('text/html')) return next();

      const store = getStoreForSSR() as Record<string, unknown>;
      const originalWrite = res.write.bind(res);
      const originalEnd = res.end.bind(res);
      let body = '';

      res.write = function (
        chunk: unknown,
        encodingOrCallback?: BufferEncoding | ((error?: Error | null) => void),
        callback?: (error?: Error | null) => void,
      ): boolean {
        if (chunk) {
          body +=
            typeof chunk === 'string'
              ? chunk
              : Buffer.from(chunk as any).toString();
        }

        if (typeof encodingOrCallback === 'function') encodingOrCallback();
        if (typeof callback === 'function') callback();
        return true;
      } as typeof res.write;

      res.end = function (
        chunk?: unknown,
        encodingOrCallback?: BufferEncoding | ((error?: Error | null) => void),
        callback?: (error?: Error | null) => void,
      ): typeof res {
        if (chunk) {
          body +=
            typeof chunk === 'string'
              ? chunk
              : Buffer.from(chunk as any).toString();
        }

        const nextBody = injectSsrPerfIntoHtml(body, store, req.url);

        try {
          res.setHeader('Content-Length', Buffer.byteLength(nextBody));
        } catch {
          // ignore
        }

        originalWrite(nextBody);

        if (typeof encodingOrCallback === 'function') encodingOrCallback();
        if (typeof callback === 'function') callback();

        return originalEnd();
      } as typeof res.end;

      next();
    },
  );
}

function getStoreForSSR(): AnyRecord {
  return typeof process !== 'undefined' && process
    ? (process as unknown as AnyRecord)
    : (globalThis as AnyRecord);
}

function injectSsrPerfIntoHtml(
  html: string,
  store: Record<string, unknown>,
  url: string | undefined,
): string {
  if (!html.includes('</head>')) {
    return html;
  }

  const rawEntries = store.__QWIK_SSR_PERF__;
  const entries = Array.isArray(rawEntries) ? rawEntries : [];
  log('inject ssr perf %O', { url, total: entries.length });

  return html.replace(
    /<head(\s[^>]*)?>/i,
    (match) => `${match}${createSsrPerfInjectionScript(entries)}`,
  );
}

function createSsrPerfInjectionScript(entries: unknown[]): string {
  const serializedEntries = JSON.stringify(entries);
  return `
<script>
  window.__QWIK_PERF__ = window.__QWIK_PERF__ || { ssr: [], csr: [] };
  window.__QWIK_PERF__.ssr = ${serializedEntries};
  window.dispatchEvent(new CustomEvent('qwik:ssr-perf', { detail: ${serializedEntries} }));
</script>`;
}
