import { component$, Slot } from '@qwik.dev/core';
import { State, TabName } from '../../types/state';

interface TabProps {
  state: State;
  id: TabName;
  title: string;
}

export const Tab = component$<TabProps>(({ state, id, title }) => {
  const isActive = state.activeTab === id;

  return (
    <button
      onClick$={() => (state.activeTab = id)}
      title={title}
      class={[
        'relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 ease-out cursor-pointer select-none',
        isActive
          ? 'bg-primary/15 text-primary'
          : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
      ]}
      style={isActive ? { boxShadow: 'inset 3px 0 0 0 var(--color-primary)' } : {}}
    >
      <Slot />
    </button>
  );
});
