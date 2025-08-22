import {
  createTreeNodeObj,
  objectToTree,
  signalToTree,
  taskToTree,
} from './transfromqseq';
import { TreeNode } from '../../components/Tree/Tree';
import { QRL } from '@qwik.dev/core';
import { ParsedStructure } from '@devtools/kit';
import { isStore, isTask, isValue } from '../../utils/type';
import { unwrapStore } from '@qwik.dev/core/internal';

const qrlKey = '$qrl$';
const computedQrlKey = '$computeQrl$';
const chunkKey = '$chunk$';


const schedule = (value: any, name: string) => {
  if (isValue(value)) {
    return signalToTree(value, 'sdsdsdsd')
  } else if (isTask(value)) {
    return taskToTree(value)
  } else if(isStore(value)) {
    return objectToTree(unwrapStore(value))
  }else {
    return objectToTree(value)
  }
}

export type QSeqsList = keyof typeof qSeqs

const qSeqs = {
  Props: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  Listens: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  UseStore: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  UseSignal: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  UseContext: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  UseId: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  UseStyles: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  UseStylesScoped: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  UseConstant: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  UseTask: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  UseVisibleTask: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  useComputed: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  useAsyncComputed: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  useErrorBoundary: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  useServerData: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  useSerializer: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  useResource: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  useContextProvider: { set: new Set<ParsedStructure>(), toTree: schedule, display: true },
  Render: { set: new Set<ParsedStructure>(), toTree: schedule, display: false },
} as const;

type DataType = keyof typeof qSeqs;

export function formatData(type: DataType, data: ParsedStructure) {
  qSeqs[type].set.add(data);
}

export function getData() {
  return Object.entries(qSeqs)
    .map(([name, { set, toTree, display }]) => {
      const arr = [...set].map((item) =>  createTreeNodeObj(item?.variableName || name, toTree(item.data, '2323'))).flat();
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
    'Computed',
    'Task',
    'Listens',
    'Render',
  ];


  const rawData = getRawDataObj();

  const result = list.map((item) => {
    return rawData[item].map((entry) => {
      if (item === 'Listens') {
        return Object.values(entry || {}).map((v: any) => v?.[chunkKey]);
      } else if (item === 'Render') {
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