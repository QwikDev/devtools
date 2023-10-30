import { runQwikJsonDebug, qwikJsonDebug } from './vendor/index';

const sendIsQwikAppMessage = () => {
  const isQwikApp = !!document.querySelector('#qwikloader');
  chrome.runtime.sendMessage({ type: 'EVENT_IS_QWIK_APP', isQwikApp });
};

window.addEventListener('onload', (event) => {
  console.log('event', event);
  sendIsQwikAppMessage();
  extractQwikJson();
});

const extractQwikJson = async () => {
  const qwikJson = runQwikJsonDebug(window, document, qwikJsonDebug);
  console.log('qwikJson', qwikJson);
};
