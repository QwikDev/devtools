import { describe, expect, it } from 'vitest';
import { isExtensionMessage } from './types';

describe('isExtensionMessage', () => {
  it('accepts valid message with type string', () => {
    expect(isExtensionMessage({ type: 'PAGE_CHANGED' })).toBe(true);
  });

  it('accepts message with payload', () => {
    expect(isExtensionMessage({ type: 'RENDER_EVENT', payload: { component: 'Counter' } })).toBe(true);
  });

  it('rejects null', () => {
    expect(isExtensionMessage(null)).toBe(false);
  });

  it('rejects undefined', () => {
    expect(isExtensionMessage(undefined)).toBe(false);
  });

  it('rejects array', () => {
    expect(isExtensionMessage([1, 2, 3])).toBe(false);
  });

  it('rejects string', () => {
    expect(isExtensionMessage('hello')).toBe(false);
  });

  it('rejects object without type', () => {
    expect(isExtensionMessage({ payload: 'data' })).toBe(false);
  });

  it('rejects object with non-string type', () => {
    expect(isExtensionMessage({ type: 42 })).toBe(false);
  });
});
