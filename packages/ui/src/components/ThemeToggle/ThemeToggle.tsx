import { component$ } from "@qwik.dev/core";
import { HiMoonMini, HiSunMini } from "@qwikest/icons/heroicons";
import { useDark } from "../../hooks/useDark";

export const ThemeToggle = component$(() => {
  const dark = useDark();

  return (
    <button
      onClick$={() => dark.toggleDark()}
      class="flex h-8 w-8 items-center justify-center rounded-md bg-background text-foreground hover:bg-accent/10"
      aria-label={dark.isDark.value ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark.isDark.value ? (
        <HiSunMini class="h-5 w-5" />
      ) : (
        <HiMoonMini class="h-5 w-5" />
      )}
    </button>
  );
});