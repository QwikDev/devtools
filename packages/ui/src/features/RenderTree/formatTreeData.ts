import { ComputedSignal, Signal } from '@qwik.dev/core';
import { createTreeNodeObj, objectToTree, signalToTree, taskToTree } from './transfromqseq';

const storeData = new Set();

const signalData = new Set();

const computedData = new Set();

const taskData = new Set();

export function formatSignalData(data: Signal) {
  signalData.add(signalToTree(data));
}
export function formatTaskData(data: any) {
  taskData.add(taskToTree(data));
}

export function formatComputedData(data: ComputedSignal<any>) {
  computedData.add(signalToTree(data));
}

export function formatStoreData(data: any) {
  storeData.add(objectToTree(data));
}

export function getData() {
  const store = [...storeData as any].flat()
  const signal = [...signalData as any].flat()
  const computed = [...computedData as any].flat()
  const task = [...taskData as any].flat()
  const data = [
    store.length > 0 && createTreeNodeObj('useStore', store),
    signal.length > 0 && createTreeNodeObj('useSignal', signal),
    computed.length > 0 && createTreeNodeObj('Computed', computed),
    task.length > 0 && createTreeNodeObj('Task', task),
  ];
  storeData.clear(),
  signalData.clear(),
  computedData.clear(),
  taskData.clear()
  return data
}