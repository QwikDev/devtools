import { component$, Slot } from '@qwik.dev/core';
import { State, TabName } from '../../types/state';

interface TabProps {
  state: State;
  id: TabName;
  title: string;
}

export const Tab = component$<TabProps>(({ state, id, title }) => {
  return (
    <button
      onClick$={() => (state.activeTab = id)}
      title={title}
      class={{
        'flex h-10 w-10 items-center justify-center rounded-lg p-2.5 transition-all duration-200':
          true,
        'bg-foreground/5 hover:bg-foreground/10 text-muted-foreground hover:text-foreground hover:bg-primary-hover':
          state.activeTab !== id,
        'shadow-accent/35 bg-accent text-white shadow-lg':
          state.activeTab === id,
      }}
    >
      <Slot />
    </button>
  );
});
