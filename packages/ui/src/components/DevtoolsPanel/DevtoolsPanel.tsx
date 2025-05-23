import { component$, Slot, useSignal, useTask$, isBrowser } from "@qwik.dev/core";
import { State } from "../../types/state";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";

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
      class="fixed bottom-6 right-6 flex h-[calc(100vh-3rem)] w-[calc(100vw-3rem)] translate-y-0 transform overflow-hidden rounded-lg border-2 border-border bg-background text-foreground backdrop-blur-lg transition-transform duration-300 ease-in-out"
    >
      <div class="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>
      <Slot />
    </div>
  );
});
