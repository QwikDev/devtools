import { describe, expect, test } from 'vitest';
import {
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
});
