import { ComputedSignal, Signal } from '@qwik.dev/core';
import { createTreeNodeObj, objectToTree, signalToTree, taskToTree } from './transfromqseq';

const stateData = new Set();

const signalData = new Set();

const computedData = new Set();

const taskData = new Set();

export function formatSignalData(data: Signal) {
  signalData.add(createTreeNodeObj('useSignal', signalToTree(data)));
}

export function formatTaskData(data: any) {
  taskData.add(createTreeNodeObj('Task', taskToTree(data)));
}

export function formatComputedData(data: ComputedSignal<any>) {
  computedData.add(createTreeNodeObj('Computed', signalToTree(data)));
}

export function formatStoreData(data: any) {
  stateData.add(createTreeNodeObj('useStore', objectToTree(data)));
}

export function getData() {
  const data = [
    createTreeNodeObj('useStoreList', [...Array.from(stateData) as any] ),
    createTreeNodeObj('useSignalList', [...Array.from(signalData) as any]),
    createTreeNodeObj('ComputedList', [...Array.from(computedData) as any]),
    createTreeNodeObj('TaskList', [...Array.from(taskData) as any]),
  ];
  stateData.clear(),
  signalData.clear(),
  computedData.clear(),
  taskData.clear()
  return data
}