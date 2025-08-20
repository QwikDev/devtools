import { describe, expect, it } from 'vitest'
import { parseQwikCode } from './parse'

const sample = `
  import { component$, useStore, useSignal, useComputed$, useAsyncComputed$, useContext, useId } from '@qwik.dev/core';

  const store = useStore({ count: 0 });
  const signal = useSignal('init');
  const qwikContainer = useComputed$(() => 1);
  const asyncComputedValue = useAsyncComputed$(() => Promise.resolve(1));
  const context = useContext(ButtonContext);
  const buttonId = useId();
`

describe('parseQwikCode', () => {
  it('extracts variable names and hook types in source order', () => {
    const results = parseQwikCode(sample)
    const normalized = results.map(r => ({ variableName: r.variableName, hookType: r.hookType, category: r.category }))

    const expected = [
      { variableName: 'store', hookType: 'useStore', category: 'hook' },
      { variableName: 'signal', hookType: 'useSignal', category: 'hook' },
      { variableName: 'qwikContainer', hookType: 'useComputed', category: 'hook' },
      { variableName: 'asyncComputedValue', hookType: 'useAsyncComputed', category: 'hook' },
      { variableName: 'context', hookType: 'useContext', category: 'hook' },
      { variableName: 'buttonId', hookType: 'useId', category: 'hook' },
    ]

    expect(normalized).toEqual(expected)
  })
})


