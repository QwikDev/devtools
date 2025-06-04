import { themeStorageKey } from "../router-head/theme-script";

export const ThemeScript = () => {
  const themeScript = `
        try {
          const getItem = localStorage.getItem('${themeStorageKey}')
          if(getItem !== 'auto'){
              document.firstElementChild
              .setAttribute('data-theme',
                  getItem ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
              );
          }
          
        } catch (err) { }`;
  return <script dangerouslySetInnerHTML={themeScript} />;
}