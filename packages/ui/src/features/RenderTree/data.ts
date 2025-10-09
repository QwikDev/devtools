import {
  CHUNK_KEY,
  COMPUTED_QRL_KEY,
  INNER_USE_HOOK,
  ParsedStructure,
  QRL_KEY,
} from '@devtools/kit';

// Extend Window interface to include QWIK_DEVTOOLS_GLOBAL_STATE
declare global {
  interface Window {
    QWIK_DEVTOOLS_GLOBAL_STATE?: Record<string, ParsedStructure[]>;
  }
}

// Q:SEQ has all data that includs hook and state, so we can use it to ingore inner hook and custom hook
export const findInnerHook = (allSeq: Record<any, any>[]) => {
  return allSeq.filter(isInnerHook);
};

const isInnerHook = (seq: Record<any, any>) => {
  return !(seq[QRL_KEY] || seq[COMPUTED_QRL_KEY])?.[CHUNK_KEY].includes(
    INNER_USE_HOOK,
  );
};

export const getQwikState = (qrl: string) => {
  const stateKeyPath = Object.keys(window.QWIK_DEVTOOLS_GLOBAL_STATE || {})?.find(
    (key) => key.endsWith(qrl!),
  );

  return (
    stateKeyPath
      ? (window.QWIK_DEVTOOLS_GLOBAL_STATE?.[stateKeyPath] as ParsedStructure[])?.filter((item) => !!item.data) || []
      : []
  );
};

export const returnQrlData = (seqs: Record<any, any>) => {
  return seqs
    .filter(isInnerHook)
    .filter((item: any) => item[QRL_KEY])
    .map((item: any) => {
      return {
        category: 'expressionStatement',
        data: item[QRL_KEY],
        hookType: item[QRL_KEY]?.[CHUNK_KEY]?.includes('useTask')
          ? 'useTask'
          : 'useVisibleTask',
        returnType: 'undefined',
        variableName: item[QRL_KEY]?.[CHUNK_KEY]?.includes('useTask')
          ? 'useTask'
          : 'useVisibleTask',
      };
    });
};
