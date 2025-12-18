/**
 * Shared types for the parse module
 */

export interface InjectOptions {
  path?: string;
}

export type InsertTask = { kind: 'insert'; pos: number; text: string };
export type ReplaceTask = { kind: 'replace'; start: number; end: number; text: string };
export type InjectionTask = InsertTask | ReplaceTask;
export type InitTask = { start: number; end: number; text: string };

