import { component$, event$, isServer, useStyles$ } from '@qwik.dev/core';
import { themeStorageKey } from '../router-head/theme-script';
import { HiSunOutline, HiMoonOutline } from '@qwikest/icons/heroicons';
import { BsBrilliance } from '@qwikest/icons/bootstrap';
import themeTogglecss from './themToggle.css?inline';

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
  return (theme as ThemeName) || 'auto';
};

export const setTheme = (theme: ThemeName) => {
  if (theme === 'auto') {
    document.firstElementChild?.removeAttribute('data-theme');
  } else {
    document.firstElementChild?.setAttribute('data-theme', theme!);
  }

  localStorage.setItem(themeStorageKey, theme);
};

export const ThemeToggle = component$(() => {
  useStyles$(themeTogglecss);
  const onClick$ = event$(() => {
    let currentTheme = getTheme();
    if (currentTheme === 'dark') {
      currentTheme = 'light';
    } else if (currentTheme === 'light') {
      currentTheme = 'auto';
    } else if (currentTheme === 'auto') {
      currentTheme = 'dark';
    }
    setTheme(currentTheme);
  });

  return (
    <>
      <button
        onClick$={onClick$}
        class="group relative flex h-8 w-8 items-center justify-center rounded-md bg-background text-foreground hover:opacity-60"
      >
        <div class="absolute inset-0 grid place-items-center transition-transform duration-200 ease-out group-hover:scale-110 group-active:scale-75">
          <HiSunOutline class="themeIcon light col-start-1 row-start-1" />
          <HiMoonOutline class="themeIcon dark col-start-1 row-start-1" />
          <BsBrilliance class="themeIcon auto col-start-1 row-start-1" />
        </div>
      </button>
    </>
  );
});
