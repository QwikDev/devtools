export const themeStorageKey = "theme-preference";
export const ThemeScript = () => {
  const themeScript = `
        try {
          const p = localStorage.getItem('${themeStorageKey}');
          if (p) {
            document.documentElement.setAttribute('data-theme', p);
          }
        } catch (e) { }`.replace(/\s+/g, "");
  return themeScript;
};
