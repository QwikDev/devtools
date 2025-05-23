import { component$, useSignal, useTask$, $, useOnWindow } from "@qwik.dev/core";
import { HiMoonMini, HiSunMini } from "@qwikest/icons/heroicons";

export const ThemeToggle = component$(() => {
  const isDarkMode = useSignal(false);
  const isBrowser = useSignal(false);

  // Set isBrowser to true when component is mounted
  useOnWindow('load', $(() => {
    isBrowser.value = true;
  }));

  // Initialize theme based on system preference or stored preference
  useTask$(({ track }) => {
    // Track the isBrowser signal to ensure this runs only in the browser
    const browser = track(() => isBrowser.value);
    if (!browser) return;
    
    // Check for stored preference
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme === 'dark') {
      isDarkMode.value = true;
      document.documentElement.classList.add('dark');
    } else if (storedTheme === 'light') {
      isDarkMode.value = false;
      document.documentElement.classList.remove('dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      isDarkMode.value = prefersDark;
      
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  });

  const toggleTheme = $(() => {
    isDarkMode.value = !isDarkMode.value;
    
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  });

  return (
    <button
      onClick$={toggleTheme}
      class="flex h-8 w-8 items-center justify-center rounded-md bg-background text-foreground hover:bg-accent/10"
      aria-label={isDarkMode.value ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode.value ? (
        <HiSunMini class="h-5 w-5" />
      ) : (
        <HiMoonMini class="h-5 w-5" />
      )}
    </button>
  );
});