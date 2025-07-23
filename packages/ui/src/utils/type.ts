import { isSignal } from '@qwik.dev/core';
import { unwrapStore } from '@qwik.dev/core/internal';

export function isPureSignal(obj: any): boolean {
  return isSignal(obj) && obj.constructor.name === 'SignalImpl';
}

export const isStore = (storeObj: any) => {
  return storeObj !== unwrapStore(storeObj);
};

export const isComputed = (value: any) => {
  return value.constructor?.name === 'ComputedSignalImpl';
};

export const isAsyncComputed = (value: any) => {
  return value.constructor?.name === 'AsyncComputedSignalImpl';
};

export const isTask = (value: any) => {
  return value.constructor?.name === 'Task';
};

export const isListen = (str: string) => {
  return /^on.*\$/.test(str);
};
