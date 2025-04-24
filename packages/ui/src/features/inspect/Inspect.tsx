import { component$ } from "@qwik.dev/core";
// import { State } from "../../types/state";
import { useLocation } from "@qwik.dev/router";
import {inspectorLink} from './constant'
// interface RoutesProps {
//   state: State;
// }

//@ts-ignore
export const Inspect = component$(() => {
  const location = useLocation();
  console.log(location);
  return (
    <div class="overflow-hidden rounded-xl border border-white/10">
      <iframe src={`${location.url.href}${inspectorLink}`} width={'100%'} height={'100%'}></iframe>
    </div>
  );
});
