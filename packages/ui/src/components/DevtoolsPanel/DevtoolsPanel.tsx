import { component$, Slot, useSignal, useTask$,isBrowser } from "@qwik.dev/core";
import { State } from "../../types/state";

interface DevtoolsPanelProps {
  state: State;
}

export const DevtoolsPanel = component$(({ state }: DevtoolsPanelProps) => {
  const panelRef = useSignal<HTMLDivElement>();

  useTask$(({ cleanup }) => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "`" && e.metaKey) {
        state.isOpen.value = !state.isOpen.value;
      }
      // Add Escape key to close
      if (e.key === "Escape" && state.isOpen.value) {
        state.isOpen.value = false;
      }
    };

    // Handle click outside
    const handleClickOutside = (e: MouseEvent) => {
      if (
        state.isOpen.value &&
        panelRef.value &&
        !panelRef.value.parentElement?.contains(e.target as Node)
      ) {
        state.isOpen.value = !state.isOpen.value;
      }
    };
    if (!isBrowser) return;
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("mousedown", handleClickOutside);

    cleanup(() => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("mousedown", handleClickOutside);
    });
  });

  return (
    <div
      ref={panelRef}
      class="fixed bottom-8 right-6 flex h-[50vh] w-full translate-y-0 transform overflow-hidden rounded-lg border-2 border-white/10 bg-zinc-900 text-white backdrop-blur-lg transition-transform duration-300 ease-in-out md:w-3/5"
    >
      <Slot />
    </div>
  );
});
