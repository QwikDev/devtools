//@ts-nocheck

import { component$, useStyles$ } from "@qwik.dev/core";
import { QGreetings } from "./components/Tree";
import reactTreeCss from "react-complex-tree/lib/style-modern.css?inline";
import styles from "./styles.css?inline";
export const Components = component$(() => {
  useStyles$(reactTreeCss);
  useStyles$(styles);

  return (
    <div>
      <QGreetings />
      {/* <div>
        Count signal value:{" "}
        {
          window.__QWIK_DEVTOOLS__.appState["routes/index.tsx"].state.count
            .value.value
        }
      </div>
      <div>Increase count:</div>
      <button
        class="rounded-md bg-blue-500 px-2 py-1 text-white"
        onClick$={() => {
          window.__QWIK_DEVTOOLS__.appState[
            "routes/index.tsx"
          ].state.count.value.value =
            window.__QWIK_DEVTOOLS__.appState["routes/index.tsx"].state.count
              .value.value + 1;
        }}
      >
        +1
      </button> */}
    </div>
  );
});
