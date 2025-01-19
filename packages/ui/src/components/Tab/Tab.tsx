import { component$, Slot } from "@qwik.dev/core";

interface TabProps {
  state: {
    activeTab: string;
  };
  id: string;
  title: string;
}

export const Tab = component$(({ state, id, title }: TabProps) => {
  return (
    <button
      class={{
        "tab-active": state.activeTab === id,
      }}
      onClick$={() => {
        state.activeTab = id;
      }}
      title={title}
    >
      <Slot />
    </button>
  );
});
