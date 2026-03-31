import { debug } from 'debug';

export const PERF_VIRTUAL_ID = 'virtual:qwik-component-proxy';
export const log = debug('qwik:devtools:perf');

export type AnyRecord = Record<string, any>;
