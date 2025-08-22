import { describe, expect, it } from 'vitest'
import { parseQwikCode } from './parse'

const sampleVarDecl = `
  import { useStore, useSignal, useComputed$, useAsyncComputed$, useContext, useId } from '@qwik.dev/core';

  const store = useStore({ count: 0 });
  const signal = useSignal('init');
  const qwikContainer = useComputed$(() => 1);
  const asyncComputedValue = useAsyncComputed$(() => Promise.resolve(1));
  const context = useContext(ButtonContext);
  const buttonId = useId();
`

const sampleExprStmt = `
  import { useTask$, useVisibleTask$, useContextProvider } from '@qwik.dev/core';

  useTask$(() => {});
  useVisibleTask$(() => {});
  useContextProvider(ButtonContext, { theme: 'primary', size: 'large' });
`

const sampleComplex = `
  import {
    useStore,
    useSignal,
    useTask$,
    useVisibleTask$,
    useComputed$,
    useAsyncComputed$,
    useContext,
    useContextProvider,
    useId,
    useResource$,
    useStyles$,
    useStylesScoped$,
    useSerializer$,
    useConstant,
    useServerData,
    useErrorBoundary
  } from '@qwik.dev/core';

  const store = useStore({ count: 0 });
  const signal = useSignal('111');
  const constantValue = useConstant(() => 'CONST');
  const serverData = useServerData('demo-key');
  const errorBoundary = useErrorBoundary();

  useTask$(({ track }) => {
    track(() => store.count);
  });

  useVisibleTask$(({ track }) => {
    track(() => store.count);
  });

  const qwikContainer = useComputed$(() => 1);
  const asyncComputedValue = useAsyncComputed$(({ track }) => Promise.resolve(track(signal) + 3));

  useContextProvider(ButtonContext, { theme: 'primary', size: 'large' });

  const context = useContext(ButtonContext);
  const buttonId = useId();

  const resourceData = useResource$(async ({ track }) => {
    track(() => store.count);
    return { message: 'ok', timestamp: Date.now() };
  });

  const customSerialized = useSerializer$(() => ({
    deserialize: () => ({ n: store.count }),
    update: (current) => {
      current.n = store.count;
      return current;
    }
  }));
  useStyles$(
    111
  );
`

describe('parseQwikCode', () => {
  it('extracts hooks in variable declarations (source order)', () => {
    const results = parseQwikCode(sampleVarDecl)
    const normalized = results.map(r => ({ variableName: r.variableName, hookType: r.hookType, category: r.category }))

    const expected = [
      { variableName: 'store', hookType: 'useStore', category: 'variableDeclaration' },
      { variableName: 'signal', hookType: 'useSignal', category: 'variableDeclaration' },
      { variableName: 'qwikContainer', hookType: 'useComputed', category: 'variableDeclaration' },
      { variableName: 'asyncComputedValue', hookType: 'useAsyncComputed', category: 'variableDeclaration' },
      { variableName: 'context', hookType: 'useContext', category: 'variableDeclaration' },
      { variableName: 'buttonId', hookType: 'useId', category: 'variableDeclaration' },
    ]

    expect(normalized).toEqual(expected)
  })

  it('extracts hooks in expression statements (use hook name as variableName when no variable)', () => {
    const results = parseQwikCode(sampleExprStmt)
    const normalized = results.map(r => ({ variableName: r.variableName, hookType: r.hookType, category: r.category }))

    const expected = [
      { variableName: 'useTask', hookType: 'useTask', category: 'expressionStatement' },
      { variableName: 'useVisibleTask', hookType: 'useVisibleTask', category: 'expressionStatement' },
      { variableName: 'useContextProvider', hookType: 'useContextProvider', category: 'expressionStatement' },
    ]

    expect(normalized).toEqual(expected)
  })

  it('parses a complex component-like sample combining variable declarations and expression statements', () => {
    const results = parseQwikCode(sampleComplex)
    const normalized = results.map(r => ({ variableName: r.variableName, hookType: r.hookType, category: r.category }))

    const expected = [
      { variableName: 'store', hookType: 'useStore', category: 'variableDeclaration' },
      { variableName: 'signal', hookType: 'useSignal', category: 'variableDeclaration' },
      { variableName: 'constantValue', hookType: 'useConstant', category: 'variableDeclaration' },
      { variableName: 'serverData', hookType: 'useServerData', category: 'variableDeclaration' },
      { variableName: 'errorBoundary', hookType: 'useErrorBoundary', category: 'variableDeclaration' },
      { variableName: 'useTask', hookType: 'useTask', category: 'expressionStatement' },
      { variableName: 'useVisibleTask', hookType: 'useVisibleTask', category: 'expressionStatement' },
      { variableName: 'qwikContainer', hookType: 'useComputed', category: 'variableDeclaration' },
      { variableName: 'asyncComputedValue', hookType: 'useAsyncComputed', category: 'variableDeclaration' },
      { variableName: 'useContextProvider', hookType: 'useContextProvider', category: 'expressionStatement' },
      { variableName: 'context', hookType: 'useContext', category: 'variableDeclaration' },
      { variableName: 'buttonId', hookType: 'useId', category: 'variableDeclaration' },
      { variableName: 'resourceData', hookType: 'useResource', category: 'variableDeclaration' },
      { variableName: 'customSerialized', hookType: 'useSerializer', category: 'variableDeclaration' },
      { variableName: 'useStyles', hookType: 'useStyles', category: 'expressionStatement' },
    ]

    expect(normalized).toEqual(expected)
  })
})


