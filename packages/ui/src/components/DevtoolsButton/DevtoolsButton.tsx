import { component$ } from "@qwik.dev/core";
import { State } from "../../types/state";

interface DevtoolsButtonProps {
  state: State;
}

export const DevtoolsButton = component$(({ state }: DevtoolsButtonProps) => {
  return (
    <div
      class={{
        "fixed bottom-4 right-4 flex h-9 w-9 origin-center cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-zinc-900 backdrop-blur-md transition-all duration-300 ease-in-out":
          true,
        "rotate-90 border-emerald-500/50 bg-zinc-900/95 shadow-lg shadow-emerald-500/35":
          state.isOpen,
      }}
      onClick$={() => (state.isOpen = !state.isOpen)}
    >
      <img
        width={20}
        height={20}
        src="https://qwik.dev/logos/qwik-logo.svg"
        alt="Qwik Logo"
        class="h-5 w-5 opacity-90 drop-shadow-md transition-all duration-300 ease-in-out hover:scale-110 hover:opacity-100"
      />
    </div>
  );
});
