import { loadComponentGraph } from './utils';
import { runQwikJsonDebug, qwikJsonDebug } from './vendor/index';

const sendIsQwikAppMessage = () => {
  const isQwikApp = !!document.querySelector('#qwikloader');
  chrome.runtime.sendMessage({ type: 'EVENT_IS_QWIK_APP', isQwikApp });
};

window.addEventListener('onload', (event) => {
  console.log('event', event);
  sendIsQwikAppMessage();
});


document.addEventListener('DOMContentLoaded', (event) => {
  sendIsQwikAppMessage();
  console.log(runQwikJsonDebug(document, qwikJsonDebug));
  console.log('loadComponentGraph', loadComponentGraph());
});

