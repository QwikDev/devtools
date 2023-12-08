const setIcon = (isQwikApp: boolean) => {
  chrome.action.setIcon({
    path: {
      19: `./icons/qwik-logo${isQwikApp ? '' : '-disabled'}-19.png`,
    },
  });
};

const checkIsQwikApp = () => {
  setIcon(false);
  chrome.tabs.query({ active: true }, (tabs) => {
    if (tabs[0]?.url.includes('chrome://')) {
      setIcon(false);
      return;
    }

    if (tabs[0]?.id) {
      try {
        chrome.scripting
          .executeScript({
            target: { tabId: tabs[0].id },
            func: () => ({
              isQwikApp: !!document.querySelector('#qwikloader'),
            }),
          })
          .then((response) => setIcon(response[0].result.isQwikApp));
      } catch (err) {
        setIcon(false);
        console.error(`failed to execute script: ${err}`);
      }
    }
  });
};

chrome.tabs.onCreated.addListener(() => {
  checkIsQwikApp();
});

chrome.tabs.onActivated.addListener(() => {
  checkIsQwikApp();
});

chrome.tabs.onUpdated.addListener(() => {
  checkIsQwikApp();
});

chrome.runtime.onMessage.addListener((message) => {
  switch (message.type) {
    case 'EVENT_IS_QWIK_APP': {
      checkIsQwikApp();
      break;
    }
  }
});

// let devToolsConnection;
// chrome.runtime.onConnect.addListener(function (_devToolsConnection) {
//   devToolsConnection = _devToolsConnection;
//   // chrome.runtime.onMessage.addListener((message) => {
//   //   switch (message.type) {
//   //     case 'QWIK_COMPONENT_GRAPH': {
//   //       devToolsConnection.postMessage('gioboa');
//   //       break;
//   //     }
//   //   }
//   // });
// });

// chrome.runtime.onConnect.addListener(function (devToolsConnection) {
//   chrome.runtime.onMessage.addListener((message) => {
//     switch (message.type) {
//       case 'QWIK_COMPONENT_GRAPH': {
//         devToolsConnection.postMessage('gioboa');
//         break;
//       }
//     }
//   });
// });
