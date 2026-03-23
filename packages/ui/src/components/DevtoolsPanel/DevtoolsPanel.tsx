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
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9990] transition-opacity duration-300"
        onMouseDown$={() => {
          state.isOpen = false;
        }}
      />
      <div
        class="glass-panel text-foreground fixed bottom-6 right-6 z-[9991] flex h-[calc(100vh-3rem)] w-[calc(100vw-3rem)] md:w-[90vw] lg:w-[85vw] max-w-7xl animate-slide-up-fade overflow-hidden rounded-2xl transition-transform duration-300 ease-out origin-bottom-right"
      >
        <button
          type="button"
          aria-label="Close devtools"
          class="bg-card-item-bg hover:bg-card-item-hover-bg border-glass-border text-muted-foreground hover:text-foreground absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
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
