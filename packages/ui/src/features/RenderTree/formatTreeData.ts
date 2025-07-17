import { ComputedSignal, Signal } from '@qwik.dev/core';
import { createTreeNodeObj, objectToTree, signalToTree, taskToTree } from './transfromqseq';

const storeData = new Set();

const signalData = new Set();

const computedData = new Set();

const taskData = new Set();

const propsData = new Set();

const listenData = new Set();

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

export function formatPropsData(data: any) {
  propsData.add(objectToTree(data));
}


export function formatListenData(data: any) {
  listenData.add(objectToTree(data));
}

export function getData() {
  const store = [...storeData as any].flat()
  const signal = [...signalData as any].flat()
  const computed = [...computedData as any].flat()
  const task = [...taskData as any].flat()
  const props = [...propsData as any].flat()
  const listen = [...listenData as any].flat()
  const data = [
    store.length > 0 && createTreeNodeObj('useStore', store),
    signal.length > 0 && createTreeNodeObj('useSignal', signal),
    computed.length > 0 && createTreeNodeObj('Computed', computed),
    task.length > 0 && createTreeNodeObj('Task', task),
    props.length > 0 && createTreeNodeObj('Props', props),
    listen.length > 0 && createTreeNodeObj('Listens', listen),
  ];
  storeData.clear(),
  signalData.clear(),
  computedData.clear(),
  taskData.clear()
  propsData.clear()
  listenData.clear()
  return data.filter(Boolean)
}