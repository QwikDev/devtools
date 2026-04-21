/**
 * Extension message types for communication between content script,
 * background service worker, and DevTools panel.
 */

export type MessageType =
  | 'DETECT_QWIK'
  | 'QWIK_DETECTION_RESULT'
  | 'PAGE_CHANGED'
  | 'START_INSPECT'
  | 'STOP_INSPECT'
  | 'ELEMENT_PICKED'
  | 'COMPONENT_TREE_UPDATE'
  | 'RENDER_EVENT'
  | 'OK'
  | `${string}_ERROR`;

export interface ExtensionMessage {
  type: MessageType;
  payload?: QwikContainerInfo | ErrorPayload | ElementPickedPayload;
}

export interface ErrorPayload {
  error: string;
}

export interface ElementPickedPayload {
  qId: string | null;
  /** v2 uses `:=` instead of `q:id` */
  colonId: string | null;
  /** Tree node ID resolved by the page-side hook. */
  treeNodeId: string | null;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/**
 * Runtime type guard for messages received from the extension messaging
 * channel. Validates shape before casting to avoid acting on malformed data.
 */
export function isExtensionMessage(msg: unknown): msg is ExtensionMessage {
  if (!isRecord(msg)) return false;
  return typeof msg['type'] === 'string';
}

export interface QwikContainerInfo {
  detected: boolean;
  version: string | null;
  renderMode: string | null;
  containerState: string | null;
  base: string | null;
  manifestHash: string | null;
  containerCount: number;
  /** `q:runtime` attribute, present in v2 (value `"2"`) */
  runtime: string | null;
}



