import {
  createTreeNodeObj,
  objectToTree,
  signalToTree,
  taskToTree,
} from './transfromqseq';
import { TreeNode } from '../../components/Tree/Tree';
import { QRL } from '@qwik.dev/core';

const qrlKey = '$qrl$';
const computedQrlKey = '$computeQrl$';
const chunkKey = '$chunk$';

const dataMap = {
  UseStore: { set: new Set(), toTree: objectToTree, display: true },
  Props: { set: new Set(), toTree: objectToTree, display: true },
  Listens: { set: new Set(), toTree: objectToTree, display: true },
  UseSignal: { set: new Set(), toTree: signalToTree, display: true },
  Computed: { set: new Set(), toTree: signalToTree, display: true },
  AsyncComputed: { set: new Set(), toTree: signalToTree, display: true },
  Task: { set: new Set(), toTree: taskToTree, display: true },
  Render: { set: new Set(), toTree: taskToTree, display: false },
} as const;

type DataType = keyof typeof dataMap;

export function formatData(type: DataType, data: any) {
  dataMap[type].set.add(data);
}

export function getData() {
  return Object.entries(dataMap)
    .map(([name, { set, toTree, display }]) => {
      const arr = [...set].map((item) => toTree(item as any)).flat();
      set.clear();
      if (display === false) return null;
      return arr.length > 0 ? createTreeNodeObj(name, arr as TreeNode[]) : null;
    })
    .filter(Boolean);
}

function getRawDataObj() {
  const result: Record<string, any[]> = {};
  for (const [name, { set }] of Object.entries(dataMap)) {
    result[name] = [...set];
  }
  return result;
}

export function findAllQrl() {
  const list: Array<keyof typeof dataMap> = [
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