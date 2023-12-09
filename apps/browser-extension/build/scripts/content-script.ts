import { getComponents } from "../../src/utils/utils";

window.addEventListener('onload', (event) => {
  console.log('event', event);
  chrome.runtime.sendMessage({ type: 'EVENT_IS_QWIK_APP' });
});

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
  // console.log("message", request);
  console.log('Components object',JSON.stringify(getComponents()));
  sendResponse({components: JSON.stringify(getComponents()), success: true});
});