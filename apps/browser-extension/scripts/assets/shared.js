document.addEventListener('DOMContentLoaded', function() {
  const scripts = document.getElementsByTagName('script');
  
  for (let i = 0; i < scripts.length; i++) {
      const scriptContent = scripts[i].textContent || scripts[i].innerText;
      if (scriptContent.includes('window.qwikevents')) {
          console.log('window.qwikevents exists.');
          break;
      } 
  }
});