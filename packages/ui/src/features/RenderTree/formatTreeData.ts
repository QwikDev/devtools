import {
  createTreeNodeObj,
  objectToTree,
} from './transfromqseq';
import { TreeNode } from '../../components/Tree/Tree';
import { QRL } from '@qwik.dev/core';
import { ParsedStructure } from '@devtools/kit';
import { isStore, isTask, isValue } from '../../utils/type';
import { unwrapStore } from '@qwik.dev/core/internal';

const qrlKey = '$qrl$';
const computedQrlKey = '$computeQrl$';
const chunkKey = '$chunk$';


const schedule = (value: any) => {
  // if(isStore(value)) {
  //   return objectToTree(unwrapStore(value))
  // } else if (isTask(value)) {
  //   return taskToTree(value)
  // } else if (isValue(value)) {
  //   return signalToTree(value)
  // } else {
  //   return objectToTree(value)
  // }

  return objectToTree(value)
}

export type QSeqsList = keyof typeof qSeqs

const qSeqs = {
  props: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  listens: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  useStore: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  useSignal: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  useContext: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  useId: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  useStyles: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  useStylesScoped: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  useConstant: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  useTask: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  useVisibleTask: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  useComputed: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  useAsyncComputed: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  useErrorBoundary: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  useServerData: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  useSerializer: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  useResource: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  useContextProvider: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  render: { set: new Set<ParsedStructure>(), toTree: schedule, display: false },
} as const;

type DataType = keyof typeof qSeqs;

export function formatData(type: DataType, data: ParsedStructure) {
  qSeqs[type].set.add(data);
}

export function getData() {
  return Object.entries(qSeqs)
    .map(([name, { set, toTree, display }]) => {
      const arr = [...set].map((item) =>  toTree({[item?.variableName]: item.data})).flat();
      set.clear();
      if (display === false) return null;
      return arr.length > 0 ? createTreeNodeObj(name, arr as TreeNode[]) : null;
    })
    .filter(Boolean);
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
    'useComputed',
    'useAsyncComputed',
    'useErrorBoundary',
    'useServerData',
    'useSerializer',
    'useResource',
    'useContextProvider',
    'listens',
    'render',
  ];


  const rawData = getRawDataObj();

  const result = list.map((item) => {
    return rawData[item].map((entry) => {
      if (item === 'listens') {
        return Object.values(entry || {}).map((v: any) => v?.[chunkKey]);
      } else if (item === 'render') {
        return getQrlPath(entry);
      } else {
        const qrlObj = (entry as any)[qrlKey] || (entry as any)[computedQrlKey];
        return getQrlPath(qrlObj);
      }
    });
  });
  console.log('findAllQrl', result.flat(2).filter(Boolean));
  return result.flat(2).filter(Boolean);
}


export function getQrlPath(qrl: QRL):string {
  return (qrl as any)?.[chunkKey];
}


export function normalizeData(qseq: Record<string, any>[], parsed: ParsedStructure[]): ParsedStructure[] {
  return qseq.map((item, index) => ({
    data: item,
    ...parsed[index]
  }));
}