import { isSignal } from "@qwik.dev/core";

export function isPureSignal(obj: any): boolean {
  return isSignal(obj) && obj.constructor.name === 'SignalImpl';
}

// export const isStore = (value: any) => {
  
// };

export const isComputed = (value: any) => {
  return value.constructor?.name === 'Computed';
};