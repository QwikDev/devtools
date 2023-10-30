import { runQwikJsonDebug, qwikJsonDebug } from './vendor/index';

const sendIsQwikAppMessage = () => {
  const isQwikApp = !!document.querySelector('#qwikloader');
  chrome.runtime.sendMessage({ type: 'EVENT_IS_QWIK_APP', isQwikApp });
};

document.addEventListener('DOMContentLoaded', (event) => {
  if (window.location.href.includes('chrome://')) {
    return;
  }

  console.log('event', event);
  sendIsQwikAppMessage();
  extractQwikJson();
});

const extractQwikJson = async () => {
  const qwikJson = runQwikJsonDebug(window, document, qwikJsonDebug);
  console.log('qwikJson', qwikJson);
};
