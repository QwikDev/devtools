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
] as const

export const QSEQ = 'q:seq';
export const QPROPS = 'q:props';
export const QRENDERFN = 'q:renderFn';