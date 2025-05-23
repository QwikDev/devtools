import { component$ } from "@qwik.dev/core";
// import { State } from "../../types/state";
import {inspectorLink} from './constant'
// interface RoutesProps {
//   state: State;
// }

//@ts-ignore
export const Inspect = component$(() => {
  return (
    <div class="overflow-hidden rounded-xl border border-white/10 flex-1">
      <iframe src={`${location.href}${inspectorLink}`} width={'100%'} height={'100%'}></iframe>
    </div>
  );
});
