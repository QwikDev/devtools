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
  {
    hook: 'useStore',
    returnType: 'proxy'
  }, {
    hook: 'useSignal',
    returnType: 'qrl'
  },
  {
    hook: 'useComputed',
    returnType: 'qrl'
  },
  {
    hook: 'useAsyncComputed',
    returnType: 'qrl'
  },
  {
    hook: 'useContext',
    returnType: 'any'
  },
  {
    hook: 'useId',
    returnType: 'string'
  },
  {
    hook: 'useStyles',
    returnType: 'string'
  },
  {
    hook: 'useStylesScoped',
    returnType: 'string'
  },
  {
    hook: 'useConstant',
    returnType: 'any'
  },
  {
    hook: 'useErrorBoundary',
    returnType: 'object'
  },
  {
    hook: 'useSerializer',
    returnType: 'qrl'
  },
  {
    hook: 'useServerData',
    returnType: 'any'
  },
  {
    hook: 'useLocation',
    returnType: 'object'
  },
  {
    hook: 'useNavigate',
    returnType: 'qrl'
  },
  {
    hook: 'useContent',
    returnType: 'proxy'
  },
  {
    hook: 'useDocumentHead',
    returnType: 'proxy'
  }
] as const


export const EXPRESSION_STATEMENT_LIST = [
  {
    hook: 'useVisibleTask',
    returnType: 'qrl'
  },
  {
    hook: 'useTask',
    returnType: 'qrl'
  },
  {
    hook: 'useResource',
    returnType: 'object'
  },
  {
    hook: 'useContextProvider',
    returnType: 'number'
  },
  {
    hook: 'usePreventNavigate',
    returnType: 'qrl'
  }
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