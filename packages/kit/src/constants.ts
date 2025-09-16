export const DEVTOOLS_VITE_MESSAGING_EVENT = 'qwik_tools:vite_messaging_event';
export const USE_HOOK_LIST = [
  'useAsyncComputed',
  'useComputed',
  'useConstant',
  'useContext',
  'useContextProvider',
  'useErrorBoundary',
  'useId',
  'useOn',
  'useOnDocument',
  'useOnWindow',
  'useResource',
  'useSerializer',
  'useServerData',
  'useSignal',
  'useStore',
  'useStyles',
  'useStylesScoped',
  'useTask',
  'useVisibleTask',
  'useLocation',
  'useNavigate',
  'usePreventNavigate',
  'useContent',
  'useDocumentHead',
] as const


export const VARIABLE_DECLARATION_LIST = [
  'useStore',
  'useSignal',
  'useComputed',
  'useAsyncComputed',
  'useContext',
  'useId',
  'useStyles',
  'useStylesScoped',
  'useConstant',
  'useErrorBoundary',
  'useSerializer',
  'useServerData',
  'useLocation',
  'useNavigate',
  'useContent',
  'useDocumentHead',
] as  const


export const EXPRESSION_STATEMENT_LIST = [
  'useVisibleTask',
  'useTask',
  'useResource',
  'useContextProvider',
  'usePreventNavigate',
] as const

export const QSEQ = 'q:seq';
export const QPROPS = 'q:props';
export const QRENDERFN = 'q:renderFn';

export const VIRTUAL_QWIK_DEVTOOLS_KEY = 'virtual-qwik-devtools.ts';

export const INNER_USE_HOOK= 'useCollectHooks'

export const QWIK_DEVTOOLS_GLOBAL_STATE = 'QWIK_DEVTOOLS_GLOBAL_STATE'

export const QRL_KEY = '$qrl$';
export const COMPUTED_QRL_KEY = '$computeQrl$';
export const CHUNK_KEY = '$chunk$';
export const CAPTURE_REF_KEY = '$captureRef$';

export const NORETURN_HOOK = [ 'useVisibleTask', 'useTask'] as const