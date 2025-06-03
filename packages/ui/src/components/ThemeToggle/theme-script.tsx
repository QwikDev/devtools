import { themeStorageKey } from "../router-head/theme-script";

export const ThemeScript = () => {
  const themeScript = `
        try {
          document.firstElementChild
              .setAttribute('data-theme',
                  localStorage.getItem('${themeStorageKey}') ??
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
              );
        } catch (err) { }`;
  return <script dangerouslySetInnerHTML={themeScript} />;
}