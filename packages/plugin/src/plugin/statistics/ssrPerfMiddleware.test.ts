import { describe, expect, test } from 'vitest';
import {
  attachSsrPerfInjectorMiddleware,
  collectSsrPreloadEntries,
  extractSsrPreloadEntriesFromHtml,
  injectSsrDevtoolsIntoHtml,
} from './ssrPerfMiddleware';

describe('ssr preload middleware helpers', () => {
  test('extracts preload links from html', () => {
    const html = `
      <html>
        <head>
          <link rel="modulepreload" href="/build/q-a.js">
          <link rel="preload" href="/build/q-b.css" as="style">
          <link rel="stylesheet" href="/build/app.css">
        </head>
      </html>
    `;

    expect(extractSsrPreloadEntriesFromHtml(html)).toEqual([
      expect.objectContaining({
        href: '/build/q-a.js',
        rel: 'modulepreload',
        resourceType: 'script',
        phase: 'ssr',
      }),
      expect.objectContaining({
        href: '/build/q-b.css',
        rel: 'preload',
        as: 'style',
        resourceType: 'style',
        phase: 'ssr',
      }),
    ]);
  });

  test('merges html preload links with optional server snapshot entries', () => {
    const html = `<head><link rel="modulepreload" href="/build/q-a.js"></head>`;
    const entries = collectSsrPreloadEntries(html, {
      __QWIK_SSR_PRELOADS__: [
        {
          href: '/build/q-a.js',
          loadDuration: 12,
          loadMatchQuality: 'best-effort',
          qrlSymbol: 's_q_a',
        },
      ],
    });

    expect(entries).toEqual([
      expect.objectContaining({
        href: '/build/q-a.js',
        phase: 'ssr',
        loadDuration: 12,
        loadMatchQuality: 'best-effort',
        qrlSymbol: 's_q_a',
      }),
    ]);
  });

  test('injects preload and perf scripts into html', () => {
    const html = '<html><head></head><body></body></html>';
    const nextHtml = injectSsrDevtoolsIntoHtml(
      html,
      {
        __QWIK_SSR_PERF__: [{ component: 'App', phase: 'ssr', duration: 1 }],
        __QWIK_SSR_PRELOADS__: [{ href: '/build/q-a.js', phase: 'ssr', loadDuration: 9 }],
      },
      '/demo',
    );

    expect(nextHtml).toContain('qwik:ssr-perf');
    expect(nextHtml).toContain('qwik:ssr-preloads');
    expect(nextHtml).toContain('window.__QWIK_SSR_PRELOADS__');
    expect(nextHtml).toContain('/build/q-a.js');
  });

  test('normalizes array accept headers before checking for html requests', () => {
    let middleware:
      | ((
          req: { headers: Record<string, string | string[] | undefined>; url?: string },
          res: {
            write: (...args: any[]) => any;
            end: (...args: any[]) => any;
            setHeader: (name: string, value: any) => void;
          },
          next: (err?: unknown) => void,
        ) => void)
      | undefined;

    attachSsrPerfInjectorMiddleware({
      middlewares: {
        use(fn: typeof middleware) {
          middleware = fn;
        },
      },
    });

    expect(middleware).toBeTypeOf('function');

    const html = '<html><head></head><body></body></html>';
    let written = '';
    let ended = false;
    const headers = new Map<string, number>();
    const res = {
      write(chunk: unknown) {
        written += String(chunk);
        return true;
      },
      end(chunk?: unknown) {
        if (chunk) {
          written += String(chunk);
        }
        ended = true;
        return this;
      },
      setHeader(name: string, value: number) {
        headers.set(name, value);
      },
    };
    const processWithPerf = process as typeof process & {
      __QWIK_SSR_PERF__?: unknown[];
    };
    processWithPerf.__QWIK_SSR_PERF__ = [{ component: 'App', phase: 'ssr', duration: 1 }];

    try {
      middleware!(
        {
          headers: {
            accept: ['application/xhtml+xml', 'text/html'],
          },
          url: '/demo',
        },
        res,
        () => {},
      );

      expect(ended).toBe(false);
      res.end(html);
    } finally {
      delete processWithPerf.__QWIK_SSR_PERF__;
    }

    expect(headers.get('Content-Length')).toBeGreaterThan(0);
    expect(written).toContain('qwik:ssr-perf');
    expect(ended).toBe(true);
    expect(written).toContain('<html><head>');
    expect(written).toContain('<script>');
  });
});
