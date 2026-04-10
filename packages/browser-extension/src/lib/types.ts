/**
 * Extension message types for communication between content script,
 * background service worker, and DevTools panel.
 */

export type MessageType =
  | 'DETECT_QWIK'
  | 'QWIK_DETECTION_RESULT'
  | 'GET_COMPONENT_TREE'
  | 'COMPONENT_TREE_RESULT'
  | 'GET_ROUTES'
  | 'ROUTES_RESULT'
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
  payload?: QwikContainerInfo | QwikComponentNode[] | QwikRouteInfo | ErrorPayload | ElementPickedPayload;
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

export type QwikObjectType =
  | 'signal'
  | 'computed'
  | 'qrl'
  | 'element-ref'
  | 'text-ref'
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'array'
  | 'null'
  | 'undefined';

export interface ComponentStateEntry {
  index: number;
  type: QwikObjectType;
  rawValue: string | number | boolean | null | Record<string, unknown> | unknown[];
  decodedValue: string | number | boolean | null | Record<string, unknown> | unknown[];
}

export interface ComponentContext {
  componentQrl?: string;
  componentName?: string;
  props?: Record<string, string | number | boolean | null>;
}

export interface QwikComponentNode {
  id: string;
  key: string | null;
  tagName: string;
  componentName: string;
  children: QwikComponentNode[];
  depth: number;
  hasContext: boolean;
  attributes: Record<string, string>;
  state: ComponentStateEntry[];
  context: ComponentContext | null;
}

export interface PreloadedModule {
  href: string;
  as: string | null;
  size: number | null;
}

export interface QwikRouteInfo {
  activeRoute: string | null;
  preloadedModules: PreloadedModule[];
  detectedRoutes: string[];
}

export interface AssetEntry {
  url: string;
  size: number;
  type: string;
}

export interface ImageEntry {
  src: string;
  width: number | null;
  height: number | null;
  naturalWidth: number;
  naturalHeight: number;
  renderedWidth: number;
  renderedHeight: number;
  hasWidthAttr: boolean;
  hasHeightAttr: boolean;
  hasAlt: boolean;
  alt: string;
  loading: string | null;
  format: string;
  transferSize: number;
}

export interface AssetData {
  scripts: AssetEntry[];
  styles: AssetEntry[];
  images: ImageEntry[];
  preloads: AssetEntry[];
}

export interface ListenerInfo {
  event: string;
  elementId: string;
  qrl: string;
  loaded: boolean;
}

export interface SerializationBreakdown {
  totalObjects: number;
  signal: number;
  computed: number;
  qrl: number;
  string: number;
  number: number;
  object: number;
  array: number;
  other: number;
  rawSize: number;
  topObjects: { index: number; size: number; type: string; preview: string }[];
}

export interface PrefetchInfo {
  totalModules: number;
  loadedModules: number;
  pendingModules: number;
  totalSize: number;
  loadedSize: number;
}

export interface ResumabilityData {
  containerState: string;
  totalListeners: number;
  pendingListeners: number;
  resumedListeners: number;
  resumabilityScore: number;
  listenerBreakdown: ListenerInfo[];
  serializationSize: number;
  serializationBreakdown: SerializationBreakdown;
  prefetchStatus: PrefetchInfo;
}

export interface QwikContext {
  componentQrl?: string;
  props?: Record<string, string | number | boolean | null>;
  tasks?: string[];
}

export interface QwikSerializedObject {
  index: number;
  rawValue: string | number | boolean | null | Record<string, unknown> | unknown[];
  type: QwikObjectType;
  decodedValue: string | number | boolean | null | Record<string, unknown> | unknown[];
}

export interface QwikSerializedState {
  raw: string;
  refs: Record<string, string>;
  ctx: Record<string, QwikContext>;
  objs: QwikSerializedObject[];
  subs: string[][];
}

export type StoreListener = () => void;
