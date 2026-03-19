import { component$, Slot, useTask$, isBrowser } from '@qwik.dev/core';
import { State } from '../../types/state';
import { IconXMark } from '../Icons/Icons';

interface DevtoolsPanelProps {
  state: State;
}

export const DevtoolsPanel = component$(({ state }: DevtoolsPanelProps) => {
  useTask$(({ cleanup }) => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!state) return;
      if (e.key === '`' && e.metaKey) {
        state.isOpen = !state.isOpen;
      }
      // Add Escape key to close
      if (e.key === 'Escape' && state.isOpen) {
        state.isOpen = false;
      }
    };

    if (!isBrowser) return;
    window.addEventListener('keydown', handleKeyPress);

    cleanup(() => {
      window.removeEventListener('keydown', handleKeyPress);
    });
  });

  return (
    <>
      <div
        class="fixed inset-0 bg-black/40 backdrop-blur-[1px]"
        onMouseDown$={() => {
          state.isOpen = false;
        }}
      />
      <div
        class="border-border bg-background text-foreground fixed bottom-6 right-6 flex h-[calc(100vh-3rem)] w-[calc(100vw-3rem)] translate-y-0 transform overflow-hidden rounded-lg border-2 backdrop-blur-lg transition-transform duration-300 ease-in-out"
      >
        <button
          type="button"
          aria-label="Close devtools"
          class="border-border bg-background/90 text-muted-foreground hover:text-foreground absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-md border shadow-sm transition-colors cursor-pointer"
          onClick$={() => {
            state.isOpen = false;
          }}
        >
          <IconXMark class="h-5 w-5" />
        </button>
        <Slot />
      </div>
    </>
  );
});
