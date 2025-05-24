import { $, isServer, QRL, Signal, useTask$, type ReadonlySignal, } from "@qwik.dev/core";

import { useSignal } from "@qwik.dev/core";



export type DarkModeSetting = 'light' | 'dark' | 'auto';

export interface UseDarkOptions {
  selector?: string;
  darkClassName?: string;
  lightClassName?: string;
  storageKey?: string;
  initialValue?: DarkModeSetting;
  onChanged?: QRL<(isDark: boolean, mode: DarkModeSetting, newMode?: DarkModeSetting) => void>;
}

export interface UseDarkReturn {
  isDark: Readonly<Signal<boolean>>;
  mode: Signal<DarkModeSetting>;
  setMode: QRL<(newMode: DarkModeSetting) => void>;
  toggleDark: QRL<() => void>;
}

const DEFAULT_OPTIONS = {
  selector: 'html',
  darkClassName: 'dark',
  lightClassName: 'light',
  storageKey: 'qwik-theme-appearance',
  initialValue: 'auto' as DarkModeSetting,
};

export function useDark(options?: UseDarkOptions): UseDarkReturn {
  const resolvedOptions = { ...DEFAULT_OPTIONS, ...options };
  const {
    selector,
    darkClassName,
    lightClassName,
    storageKey,
    initialValue,
    onChanged,
  } = resolvedOptions;

  const mode = useSignal<DarkModeSetting>(initialValue);
  const isDark = useSignal<boolean>(false);

  const updateDOMAndSignal = $((currentSetting: DarkModeSetting, systemPrefersDark: boolean) => {
    let newIsDarkValue = false;
    if (currentSetting === 'auto') {
      newIsDarkValue = systemPrefersDark;
    } else {
      newIsDarkValue = currentSetting === 'dark';
    }

    const D = document;
    const targetElement = D.querySelector(selector) || D.documentElement;

    if (isDark.value !== newIsDarkValue) {
      isDark.value = newIsDarkValue;
    }

    if (newIsDarkValue) {
      targetElement.classList.add(darkClassName);
      if (lightClassName) targetElement.classList.remove(lightClassName);
      (targetElement as HTMLElement).style.setProperty('color-scheme', 'dark');
    } else {
      targetElement.classList.remove(darkClassName);
      if (lightClassName) targetElement.classList.add(lightClassName);
      (targetElement as HTMLElement).style.setProperty('color-scheme', 'light');
    }

    if (onChanged) {
      onChanged(isDark.value, currentSetting);
    }
  });


  const setMode = $((newMode: DarkModeSetting) => {
    if (mode.value !== newMode) {
        mode.value = newMode;
        // The task below will handle localStorage and DOM update
    }
  });

  const toggleDark = $(() => {
    if (mode.value === 'auto') {
      // If auto, switch to the opposite of current visual state
      setMode(isDark.value ? 'light' : 'dark');
    } else {
      // Toggle between light and dark
      setMode(mode.value === 'light' ? 'dark' : 'light');
    }
  });

  useTask$(() => {
    if (isServer) {
      return;
    }

    // 1. Initialize mode from localStorage if available
    const storedMode = localStorage.getItem(storageKey) as DarkModeSetting | null;
    if (storedMode && storedMode !== mode.value) {
      mode.value = storedMode; // This will trigger the next task if value changes
    } else if (!storedMode) {
      // If nothing in storage, and initialValue is different from current mode, save it.
      // This ensures the initialValue (e.g. 'auto') is stored if nothing was there.
      localStorage.setItem(storageKey, mode.value);
    }
  })
  
  // Ensures DOM is ready for querySelector
  useTask$(({ cleanup, track }) => {
    if (isServer) {
      return;
    }

    // 2. Media query for system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Initial update based on current mode and system preference
    updateDOMAndSignal(mode.value, mediaQuery.matches);


    // 3. Watch for changes in mode signal (user-triggered or from localStorage init)
    // This task is separate to ensure localStorage is updated *after* mode signal changes.
    track(() => mode.value); // Track the mode signal
    localStorage.setItem(storageKey, mode.value);
    updateDOMAndSignal(mode.value, mediaQuery.matches); // Re-evaluate and update DOM


    // 4. Listen to system preference changes
    const onMediaChange = $(() => {
      if (mode.value === 'auto') { // Only update if mode is 'auto'
        updateDOMAndSignal('auto', window.matchMedia('(prefers-color-scheme: dark)').matches);
      }
    });

    mediaQuery.addEventListener('change', onMediaChange);

    cleanup(() => {
      mediaQuery.removeEventListener('change', onMediaChange);
    });
  }); // Ensures DOM is ready for querySelector

  return {
    isDark: isDark as ReadonlySignal<boolean>,
    mode,
    setMode,
    toggleDark,
  };
}