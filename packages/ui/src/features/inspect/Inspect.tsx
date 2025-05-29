import { component$ } from "@qwik.dev/core";
// import { State } from "../../types/state";
import { inspectorLink } from "./constant";
// interface RoutesProps {
//   state: State;
// }

//@ts-ignore
export const Inspect = component$(() => {
  return (
    <div class="flex-1 overflow-hidden rounded-xl border border-border">
      <iframe
        src={`${location.href}${inspectorLink}`}
        width={"100%"}
        height={"100%"}
        id="inspect_qwik"
      ></iframe>
    </div>
  );
});
