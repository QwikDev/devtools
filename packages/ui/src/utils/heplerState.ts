import { DomContainer } from '@qwik.dev/core/internal';
import { htmlContainer } from './location';

export function getVnodeById(id: string | number) {
  let VnodeId: number;
  if (typeof id === 'string') {
    VnodeId = Number(id) * 2 + 1;
  } else {
    VnodeId = id * 2 + 1;
  }
  if (Number.isNaN(VnodeId)) {
    new Error(`Vnode id is not a number: ${id}`);
    return null;
  }
  const container = htmlContainer()! as DomContainer;
  return container.$rawStateData$[VnodeId];
}

export function getIndexByObject(obj: unknown) {
  if (typeof obj !== 'object') {
    return null;
  }
  const container = htmlContainer()! as DomContainer;
  const index = container.$rawStateData$.findIndex((item) => item === obj);
  if (index === -1) {
    new Error(`Object not found in state: ${obj}`);
    return null;
  }
  return (index - 1) / 2;
}
