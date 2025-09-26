import { createTreeNodeObj, objectToTree } from './transfromqseq';
import { TreeNode } from '../../components/Tree/Tree';
import { QRL } from '@qwik.dev/core';
import {
  CAPTURE_REF_KEY,
  CHUNK_KEY,
  COMPUTED_QRL_KEY,
  ParsedStructure,
  QRL_KEY,
} from '@devtools/kit';

const schedule = (value: any) => {
  return objectToTree(value);
};

export type QSeqsList = keyof typeof qSeqs;

const qSeqs = {
  props: {
    set: new Set<Record<string, any>>(),
    toTree: schedule,
    display: true,
  },
  listens: {
    set: new Set<Record<string, any>>(),
    toTree: schedule,
    display: true,
  },
  useStore: {
    set: new Set<ParsedStructure>(),
    toTree: schedule,
    display: true,
  },
  useSignal: {
    set: new Set<ParsedStructure>(),
    toTree: schedule,
    display: true,
  },
  useContext: {
    set: new Set<ParsedStructure>(),
    toTree: schedule,
    display: true,
  },
  useId: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  useStyles: {
    set: new Set<ParsedStructure>(),
    toTree: schedule,
    display: true,
  },
  useStylesScoped: {
    set: new Set<ParsedStructure>(),
    toTree: schedule,
    display: true,
  },
  useConstant: {
    set: new Set<ParsedStructure>(),
    toTree: schedule,
    display: true,
  },
  useTask: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  useVisibleTask: {
    set: new Set<ParsedStructure>(),
    toTree: schedule,
    display: true,
  },
  useComputed: {
    set: new Set<ParsedStructure>(),
    toTree: schedule,
    display: true,
  },
  useAsyncComputed: {
    set: new Set<ParsedStructure>(),
    toTree: schedule,
    display: true,
  },
  useErrorBoundary: {
    set: new Set<ParsedStructure>(),
    toTree: schedule,
    display: true,
  },
  useServerData: {
    set: new Set<ParsedStructure>(),
    toTree: schedule,
    display: true,
  },
  useSerializer: {
    set: new Set<ParsedStructure>(),
    toTree: schedule,
    display: true,
  },
  useResource: {
    set: new Set<ParsedStructure>(),
    toTree: schedule,
    display: false,
  },
  useContextProvider: {
    set: new Set<ParsedStructure>(),
    toTree: schedule,
    display: true,
  },
  render: {
    set: new Set<Record<string, any>>(),
    toTree: schedule,
    display: false,
  },
  useLocation: {
    set: new Set<ParsedStructure>(),
    toTree: schedule,
    display: true,
  },
  useNavigate: {
    set: new Set<ParsedStructure>(),
    toTree: schedule,
    display: true,
  },
  usePreventNavigate: {
    set: new Set<ParsedStructure>(),
    toTree: schedule,
    display: false,
  },
  useContent: {
    set: new Set<ParsedStructure>(),
    toTree: schedule,
    display: true,
  },
  useDocumentHead: {
    set: new Set<ParsedStructure>(),
    toTree: schedule,
    display: true,
  },
  customhook: {
    set: new Set<ParsedStructure>(),
    toTree: schedule,
    display: true,
  },
};

type DataType = keyof typeof qSeqs;

export function formatData(
  type: 'props' | 'listens' | 'render',
  data: Record<string, any>,
): void;
export function formatData(
  type: Exclude<DataType, 'props' | 'listens' | 'render'>,
  data: ParsedStructure,
): void;
export function formatData(
  type: DataType,
  data: ParsedStructure | Record<string, any>,
) {
  qSeqs[type].set.add(data as any);
}

export function getData() {
  return Object.entries(qSeqs)
    .map(([name, { set, toTree, display }]) => {
      const arr = [...set]
        .map((item) => {
          if (name === 'props' || name === 'listens' || name === 'render') {
            return toTree((item as any).data);
          } else if (name === 'useTask' || name === 'useVisibleTask') {
            return toTree({
              [`let ${(item as any)?.variableName} =`]: findMatchVarfromScope(
                item as ParsedStructure,
              ),
            });
          } else if (name === 'customhook') {
            return toTree({
              [`let ${(item as any)?.variableName} = Scope `]: (item as any)
                .data[CAPTURE_REF_KEY],
            });
          } else {
            return toTree({
              [`let ${(item as any)?.variableName} =`]: (item as any).data,
            });
          }
        })
        .flat();
      if (display === false) return null;
      return arr.length > 0 ? createTreeNodeObj(name, arr as TreeNode[]) : null;
    })
    .filter(Boolean);
}

export function findMatchVarfromScope(item: ParsedStructure) {
  const targets = (item as any)?.data[CAPTURE_REF_KEY];
  const variableName: string[] = [];
  if (!targets) return [];

  for (const { set } of Object.values(qSeqs) as Array<{ set: Set<any> }>) {
    for (const entry of set as Set<any>) {
      const data = (entry as any)?.data ?? entry;
      if (!data) continue;
      const varName = targets.find((target: any) => target === data);
      varName && variableName.push(entry?.variableName);
    }
  }

  return `Scope [${variableName.join(', ')}]`;
}

// Build tree nodes without mutating sets. Useful for UI re-filtering after data collected
export function buildTree() {
  return getData();
}

// Clear all stored hook data
export function clearAll() {
  for (const key of Object.keys(qSeqs) as Array<keyof typeof qSeqs>) {
    qSeqs[key].set.clear();
  }
}

// Get filter list for UI
export function getHookFilterList() {
  return (Object.keys(qSeqs) as Array<keyof typeof qSeqs>)
    .filter((usename) => qSeqs[usename].set.size > 0 && qSeqs[usename].display)
    .map((key) => ({
      key,
      display: qSeqs[key].display,
    }));
}

// Update multiple hook display flags at once
export function updateHookDisplays(
  map: Partial<Record<keyof typeof qSeqs, boolean>>,
) {
  for (const [k, v] of Object.entries(map)) {
    if (typeof v === 'boolean') {
      // @ts-ignore
      qSeqs[k as keyof typeof qSeqs].display = v;
    }
  }
}

function getRawDataObj() {
  const result: Record<string, any[]> = {};
  for (const [name, { set }] of Object.entries(qSeqs)) {
    result[name] = [...set];
  }
  return result;
}

export function findAllQrl() {
  const list: Array<keyof typeof qSeqs> = [
    'useTask',
    'useVisibleTask',
    'useComputed',
    'useAsyncComputed',
    'useServerData',
    'useSerializer',
    'render',
    'listens',
  ];

  const rawData = getRawDataObj();

  const result = list.map((item) => {
    return rawData[item].map((entry) => {
      if (item === 'listens') {
        return Object.values(entry.data || entry).map(
          (v: any) => v?.[CHUNK_KEY],
        );
      } else if (item === 'render') {
        return getQrlPath(entry.data.render || entry);
      } else {
        const qrlObj =
          (entry.data || entry)[QRL_KEY] ||
          (entry.data || entry)[COMPUTED_QRL_KEY];
        return getQrlPath(qrlObj);
      }
    });
  });
  console.log('findAllQrl', result.flat(2).filter(Boolean));
  return result.flat(2).filter(Boolean);
}

export function getQrlPath(qrl: QRL) {
  // CHUNK_KEY is not available when dev property isn't null or undefined
  if(qrl?.dev){
    return `/@fs${(qrl as any)?.[CHUNK_KEY]}`;
  }
  return (qrl as any)?.[CHUNK_KEY];
}

export function getQrlChunkName(qrl: QRL): string {
  const splitPoint = '_component';
  return (qrl as any)?.[CHUNK_KEY]?.split(splitPoint)?.[0];
}

export function normalizeData(
  qseq: Record<string, any>[],
  parsed: ParsedStructure[],
): ParsedStructure[] {
  return qseq.map((item, index) => ({
    data: item,
    ...parsed[index],
  }));
}
