window.addEventListener('onload', (event) => {
  console.log('event', event);
  chrome.runtime.sendMessage({ type: 'EVENT_IS_QWIK_APP' });
});

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
  console.log("something happening from the extension", request);
  sendResponse({outerHTML: document.documentElement.outerHTML, success: true});
});