import { component$, Slot } from "@qwik.dev/core";

interface TabProps {
  state: {
    activeTab: string;
  };
  id: string;
  title: string;
}

export const Tab = component$<TabProps>(({ state, id, title }) => {
  return (
    <button
      onClick$={() => (state.activeTab = id)}
      title={title}
      class={{
        "flex h-10 w-10 items-center justify-center rounded-lg p-2.5 transition-all duration-200":
          true,
        "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white":
          state.activeTab !== id,
        "bg-emerald-500 text-white shadow-lg shadow-emerald-500/35":
          state.activeTab === id,
      }}
    >
      <Slot />
    </button>
  );
});
