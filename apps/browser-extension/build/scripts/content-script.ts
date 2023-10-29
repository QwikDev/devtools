const sendIsQwikAppMessage = () => {
  const isQwikApp = !!document.querySelector('#qwikloader');
  chrome.runtime.sendMessage({ type: 'EVENT_IS_QWIK_APP', isQwikApp });
};

document.addEventListener('DOMContentLoaded', () => {
  sendIsQwikAppMessage();
});