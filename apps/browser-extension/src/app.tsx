import { $, component$, useSignal, useStyles$ } from '@builder.io/qwik';
import styles from './app.css?inline';
import { Header } from './components/Header';
import { LeftPanel } from './components/LeftPanel';
import { RightPanel } from './components/RightPanel';
import { getComponentGraph } from './utils/utils';
import { runQwikJsonDebug } from './utils';
// import { runQwikJsonDebug } from './utils';
// import { getComponentGraph } from './utils/utils';

// export const componentGraph = {
//   "6": {
//       "id": "6",
//       "parentId": null,
//       "children": [
//           {
//               "id": "7",
//               "parentId": "6",
//               "children": [
//                   {
//                       "id": "9",
//                       "parentId": "7",
//                       "children": [
//                           {
//                               "id": "b",
//                               "parentId": "9",
//                               "children": [
//                                   {
//                                       "id": "ref=b",
//                                       "parentId": "b",
//                                       "children": [
//                                           {
//                                               "id": "d",
//                                               "parentId": "ref=b"
//                                           }
//                                       ]
//                                   }
//                               ]
//                           },
//                           {
//                               "id": "f",
//                               "parentId": "9"
//                           },
//                           {
//                               "id": "g",
//                               "parentId": "9",
//                               "children": [
//                                   {
//                                       "id": "ref=g",
//                                       "parentId": "g"
//                                   }
//                               ]
//                           },
//                           {
//                               "id": "i",
//                               "parentId": "9",
//                               "children": [
//                                   {
//                                       "id": "ref=i",
//                                       "parentId": "i"
//                                   }
//                               ]
//                           },
//                           {
//                               "id": "l",
//                               "parentId": "9",
//                               "children": [
//                                   {
//                                       "id": "ref=l",
//                                       "parentId": "l"
//                                   }
//                               ]
//                           },
//                           {
//                               "id": "o",
//                               "parentId": "9",
//                               "children": [
//                                   {
//                                       "id": "ref=o",
//                                       "parentId": "o"
//                                   }
//                               ]
//                           },
//                           {
//                               "id": "r",
//                               "parentId": "9"
//                           },
//                           {
//                               "id": "t",
//                               "parentId": "9"
//                           },
//                           {
//                               "id": "u",
//                               "parentId": "9"
//                           }
//                       ]
//                   },
//                   {
//                       "id": "v",
//                       "parentId": "7"
//                   },
//                   {
//                       "id": "w",
//                       "parentId": "7"
//                   }
//               ]
//           },
//           {
//               "id": "ref=7",
//               "parentId": "6",
//               "children": [
//                   {
//                       "id": "x",
//                       "parentId": "ref=7",
//                       "children": [
//                           {
//                               "id": "37",
//                               "parentId": "x"
//                           },
//                           {
//                               "id": "y",
//                               "parentId": "x",
//                               "children": [
//                                   {
//                                       "id": "z",
//                                       "parentId": "y",
//                                       "children": [
//                                           {
//                                               "id": "ref=z",
//                                               "parentId": "z",
//                                               "children": [
//                                                   {
//                                                       "id": "2p",
//                                                       "parentId": "ref=z"
//                                                   }
//                                               ]
//                                           }
//                                       ]
//                                   }
//                               ]
//                           },
//                           {
//                               "id": "12",
//                               "parentId": "x",
//                               "children": [
//                                   {
//                                       "id": "13",
//                                       "parentId": "12",
//                                       "children": [
//                                           {
//                                               "id": "ref=13",
//                                               "parentId": "13",
//                                               "children": [
//                                                   {
//                                                       "id": "2r",
//                                                       "parentId": "ref=13"
//                                                   }
//                                               ]
//                                           }
//                                       ]
//                                   }
//                               ]
//                           },
//                           {
//                               "id": "16",
//                               "parentId": "x",
//                               "children": [
//                                   {
//                                       "id": "17",
//                                       "parentId": "16",
//                                       "children": [
//                                           {
//                                               "id": "ref=17",
//                                               "parentId": "17",
//                                               "children": [
//                                                   {
//                                                       "id": "2t",
//                                                       "parentId": "ref=17"
//                                                   }
//                                               ]
//                                           }
//                                       ]
//                                   }
//                               ]
//                           },
//                           {
//                               "id": "1a",
//                               "parentId": "x",
//                               "children": [
//                                   {
//                                       "id": "1b",
//                                       "parentId": "1a",
//                                       "children": [
//                                           {
//                                               "id": "ref=1b",
//                                               "parentId": "1b",
//                                               "children": [
//                                                   {
//                                                       "id": "2v",
//                                                       "parentId": "ref=1b"
//                                                   }
//                                               ]
//                                           }
//                                       ]
//                                   }
//                               ]
//                           },
//                           {
//                               "id": "1e",
//                               "parentId": "x",
//                               "children": [
//                                   {
//                                       "id": "1f",
//                                       "parentId": "1e",
//                                       "children": [
//                                           {
//                                               "id": "ref=1f",
//                                               "parentId": "1f",
//                                               "children": [
//                                                   {
//                                                       "id": "2x",
//                                                       "parentId": "ref=1f"
//                                                   }
//                                               ]
//                                           }
//                                       ]
//                                   }
//                               ]
//                           },
//                           {
//                               "id": "1i",
//                               "parentId": "x",
//                               "children": [
//                                   {
//                                       "id": "1j",
//                                       "parentId": "1i",
//                                       "children": [
//                                           {
//                                               "id": "ref=1j",
//                                               "parentId": "1j",
//                                               "children": [
//                                                   {
//                                                       "id": "2z",
//                                                       "parentId": "ref=1j"
//                                                   }
//                                               ]
//                                           }
//                                       ]
//                                   }
//                               ]
//                           },
//                           {
//                               "id": "1m",
//                               "parentId": "x",
//                               "children": [
//                                   {
//                                       "id": "1n",
//                                       "parentId": "1m",
//                                       "children": [
//                                           {
//                                               "id": "ref=1n",
//                                               "parentId": "1n",
//                                               "children": [
//                                                   {
//                                                       "id": "31",
//                                                       "parentId": "ref=1n"
//                                                   }
//                                               ]
//                                           }
//                                       ]
//                                   }
//                               ]
//                           },
//                           {
//                               "id": "1q",
//                               "parentId": "x",
//                               "children": [
//                                   {
//                                       "id": "1r",
//                                       "parentId": "1q",
//                                       "children": [
//                                           {
//                                               "id": "ref=1r",
//                                               "parentId": "1r",
//                                               "children": [
//                                                   {
//                                                       "id": "33",
//                                                       "parentId": "ref=1r"
//                                                   }
//                                               ]
//                                           }
//                                       ]
//                                   }
//                               ]
//                           },
//                           {
//                               "id": "1u",
//                               "parentId": "x",
//                               "children": [
//                                   {
//                                       "id": "1v",
//                                       "parentId": "1u",
//                                       "children": [
//                                           {
//                                               "id": "ref=1v",
//                                               "parentId": "1v",
//                                               "children": [
//                                                   {
//                                                       "id": "35",
//                                                       "parentId": "ref=1v"
//                                                   }
//                                               ]
//                                           }
//                                       ]
//                                   }
//                               ]
//                           }
//                       ]
//                   }
//               ]
//           },
//           {
//               "id": "1y",
//               "parentId": "6",
//               "children": [
//                   {
//                       "id": "1z",
//                       "parentId": "1y",
//                       "children": [
//                           {
//                               "id": "ref=1z",
//                               "parentId": "1z"
//                           }
//                       ]
//                   },
//                   {
//                       "id": "22",
//                       "parentId": "1y",
//                       "children": [
//                           {
//                               "id": "ref=22",
//                               "parentId": "22"
//                           }
//                       ]
//                   },
//                   {
//                       "id": "25",
//                       "parentId": "1y",
//                       "children": [
//                           {
//                               "id": "ref=25",
//                               "parentId": "25"
//                           }
//                       ]
//                   },
//                   {
//                       "id": "28",
//                       "parentId": "1y",
//                       "children": [
//                           {
//                               "id": "ref=28",
//                               "parentId": "28"
//                           }
//                       ]
//                   },
//                   {
//                       "id": "2a",
//                       "parentId": "1y",
//                       "children": [
//                           {
//                               "id": "ref=2a",
//                               "parentId": "2a"
//                           }
//                       ]
//                   },
//                   {
//                       "id": "2c",
//                       "parentId": "1y",
//                       "children": [
//                           {
//                               "id": "ref=2c",
//                               "parentId": "2c"
//                           }
//                       ]
//                   },
//                   {
//                       "id": "2e",
//                       "parentId": "1y",
//                       "children": [
//                           {
//                               "id": "ref=2e",
//                               "parentId": "2e"
//                           }
//                       ]
//                   },
//                   {
//                       "id": "2g",
//                       "parentId": "1y",
//                       "children": [
//                           {
//                               "id": "ref=2g",
//                               "parentId": "2g"
//                           }
//                       ]
//                   },
//                   {
//                       "id": "2i",
//                       "parentId": "1y",
//                       "children": [
//                           {
//                               "id": "ref=2i",
//                               "parentId": "2i"
//                           }
//                       ]
//                   },
//                   {
//                       "id": "2k",
//                       "parentId": "1y",
//                       "children": [
//                           {
//                               "id": "ref=2k",
//                               "parentId": "2k"
//                           }
//                       ]
//                   },
//                   {
//                       "id": "2m",
//                       "parentId": "1y",
//                       "children": [
//                           {
//                               "id": "ref=2m",
//                               "parentId": "2m"
//                           }
//                       ]
//                   },
//                   {
//                       "id": "2o",
//                       "parentId": "1y"
//                   }
//               ]
//           }
//       ]
//   },
// }

export const App = component$(() => {
  useStyles$(styles);

  const documentSig = useSignal<Document>();
  const qwikJsonSig = useSignal<any>();
  const componentsSig = useSignal<any>();
  const isReadySig = useSignal(false);

  const setDocument = $((outerHTML: string) => {
    const doc = document.implementation.createHTMLDocument('devtool');
    doc.documentElement.innerHTML = outerHTML;
    documentSig.value = doc;
    qwikJsonSig.value = runQwikJsonDebug(documentSig.value);
    componentsSig.value = documentSig.value
      ? getComponentGraph(documentSig.value)
      : {};
    console.log('a');
    isReadySig.value = true;
  });

  if (!isReadySig.value) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      chrome.tabs.sendMessage(tabs[0].id, { data: '123' }, function (response) {
        setDocument(response.outerHTML);
      });
    });
  }

  return (
    <>
      {isReadySig.value && (
        <div class="devtools-root">
          <div
            class="h-full w-full overflow-hidden grid text-base font-sans bg-panel-bg text-text"
            style="grid-template-rows: 2.5rem 1fr;"
          >
            <Header />
            <div class="overflow-hidden">
              <div
                class="grid grid-auto-flow-col h-full w-full"
                style="grid-template-columns: minmax(8rem, 50%) 1px minmax(8rem, 1fr);"
              >
                <LeftPanel componentGraph={componentsSig.value} />
                <div class="relative bg-panel-border">
                  <div class="absolute z-9999 select-none cursor-row-resize sm:cursor-col-resize -inset-y-3px inset-x-0 sm:inset-y-0 sm:-inset-x-3px bg-panel-border transition opacity-0"></div>
                </div>
                <RightPanel />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});
