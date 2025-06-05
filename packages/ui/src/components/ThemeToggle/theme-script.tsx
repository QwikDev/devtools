import { themeStorageKey } from '../router-head/theme-script';

export const ThemeScript = () => {
  const themeScript = `
        try {
          const getItem = localStorage.getItem('${themeStorageKey}')
          console.log(1111, getItem)
          if(getItem === 'light' || getItem === 'dark'){
              document.firstElementChild.setAttribute('data-theme', getItem);
          }
          
        } catch (err) { }`;
  return <script dangerouslySetInnerHTML={themeScript} />;
};
