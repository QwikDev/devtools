document.addEventListener('DOMContentLoaded', () => {
  const isQwikApp = !!document.querySelector('#qwikloader');
  if (isQwikApp) {
    console.log('isQwikApp', isQwikApp);
  }
});
