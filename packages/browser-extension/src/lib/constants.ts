/** Qwik DOM attribute names used for detection and tree building. */
export const QWIK_ATTR = {
  CONTAINER: 'q:container',
  VERSION: 'q:version',
  RENDER: 'q:render',
  BASE: 'q:base',
  ROUTE: 'q:route',
  MANIFEST_HASH: 'q:manifest-hash',
  ID: 'q:id',
  KEY: 'q:key',
  RUNTIME: 'q:runtime',
} as const;

export const QWIK_CONTAINER_SELECTOR = '[q\\:container]';
export const V2_BINDING_ATTR = ':';

/**
 * Type guard for unknown values that should be a plain object.
 */
export function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}
