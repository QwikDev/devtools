import {
  component$,
  createSignal,
  isBrowser,
  Signal,
  event$,
} from "@qwik.dev/core";
import { HiMoonMini, HiSunMini } from "@qwikest/icons/heroicons";
import { themeStorageKey } from "../router-head/theme-script";

type ThemeName = "dark" | "light" | undefined;

export const getTheme = (): ThemeName => {
  let theme;
  try {
    theme = localStorage.getItem(themeStorageKey);
  } catch {
    //
  }
  if (theme) {
    return theme as ThemeName;
  } else {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
};

let currentThemeSignal: Signal<ThemeName>;
export const getThemeSignal = () => {
  if (!isBrowser) {
    throw new Error("getThemeSignal is only available in the browser");
  }
  if (!currentThemeSignal) {
    currentThemeSignal = createSignal(getTheme());
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", () => {
        currentThemeSignal.value = getTheme();
      });
  }
  return currentThemeSignal;
};

export const setTheme = (theme: ThemeName) => {
  if (!theme) {
    localStorage.removeItem(themeStorageKey);
    theme = getTheme();
  } else {
    localStorage.setItem(themeStorageKey, theme);
  }
  document.firstElementChild?.setAttribute("data-theme", theme!);
  if (currentThemeSignal) {
    currentThemeSignal.value = theme;
  }
};

export const ThemeToggle = component$(() => {
  const onClick$ = event$(() => {
    const currentTheme = getTheme();
  
    setTheme(currentTheme === "dark" ? "light" : "dark");
  });
  return (
    <button
      onClick$={onClick$}
      class="hover:bg-accent/10 flex h-8 w-8 items-center justify-center rounded-md bg-background text-foreground"
    >
      {true ? (
        <HiSunMini class="h-5 w-5" />
      ) : (
        <HiMoonMini class="h-5 w-5" />
      )}
    </button>
  );
});
