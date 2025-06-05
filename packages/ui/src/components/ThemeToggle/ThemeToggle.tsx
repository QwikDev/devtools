import {
  component$,
  createSignal,
  Signal,
  event$,
  isServer,
} from '@qwik.dev/core';
import { themeStorageKey } from '../router-head/theme-script';

type ThemeName = 'dark' | 'light' | 'auto';

export const getTheme = (): ThemeName => {
  if (isServer) {
    return 'auto';
  }
  let theme;
  try {
    theme = localStorage.getItem(themeStorageKey);
  } catch {
    //
  }
  if (theme) {
    return theme as ThemeName;
  } else {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
};

let currentThemeSignal: Signal<ThemeName>;
export const getThemeSignal = () => {
  if (isServer) {
    throw new Error('getThemeSignal is only available in the browser');
  }
  if (!currentThemeSignal) {
    currentThemeSignal = createSignal(getTheme());
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        currentThemeSignal.value = getTheme();
      });
  }
  return currentThemeSignal;
};

export const setTheme = (theme: ThemeName) => {
  if (theme === 'auto') {
    document.firstElementChild?.removeAttribute('data-theme');
  } else {
    document.firstElementChild?.setAttribute('data-theme', theme!);
  }

  localStorage.setItem(themeStorageKey, theme);

  if (currentThemeSignal) {
    currentThemeSignal.value = theme;
  }
};

export const ThemeToggle = component$(() => {
  const themeValue = createSignal(getTheme());
  const onClick$ = event$((_: any, e: any) => {
    setTheme(e.value);
    themeValue.value = e.value;
  });

  return (
    <div class="theme-control">
      <label for="theme-select" class="sr-only">
        Choose a theme
      </label>
      <select
        class="w-10 rounded-lg border border-border bg-background px-1 py-2 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-ring"
        onInput$={onClick$}
      >
        <option value="dark" selected={themeValue.value === 'dark'}>
          Dark
        </option>
        <option value="light" selected={themeValue.value === 'light'}>
          Light
        </option>
        <option value="auto" selected={themeValue.value === 'auto'}>
          Auto
        </option>
      </select>
    </div>
  );
});
