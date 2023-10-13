import {
  component$,
  createContextId,
  useContext,
  useContextProvider,
  useStore,
} from '@builder.io/qwik';
import { Panel } from './Panel';
import { QwikIcon } from './QwikIcon';

interface DevToolsStore {
  open: boolean;
}

export const DevToolsContext = createContextId<DevToolsStore>('DevToolsStore');

export const DevTools = component$(() => {
  const devToolsStore = useStore<DevToolsStore>({ open: false });
  useContextProvider(DevToolsContext, devToolsStore);
  return (
    <div
      style="position: fixed;
  z-index: 999999;
  top: 24px;
  left: 50%;
display: flex; justify-content: center;"
    >
      <div
        style="
 tab-size: 4;
 line-height: inherit;
 font-family: Arial, Helvetica, sans-serif;
 font-size: 15px !important;
 pointer-events: auto;
 box-sizing: border-box;
 position: absolute;
 left: 0;
 top: 0;
 display: flex;
 justify-content: flex-start;
 overflow: hidden;
 align-items: center;
 gap: 2px;
 height: 30px;
 padding: 2px 2px 2px 2.5px;
 border: 1px solid #3336;
 border-radius: 100px;
 background-color: #111;
 backdrop-filter: blur(10px);
 color: #F5F5F5;
 box-shadow: 2px 2px 8px rgba(0,0,0,0.3);
 user-select: none;
 touch-action: none;
 max-width: 150px;
 transition: all 0.6s ease, max-width 0.6s ease, padding 0.5s ease, transform 0.4s ease, opacity 0.2s ease;
 transform: translate(-50%, -50%);padding: 15px"
        onClick$={() => {
          devToolsStore.open = !devToolsStore.open;
        }}
      >
        <div style="margin: 5px 10px 0 0">
        <QwikIcon width={18} height={18} />
        </div>

        <div
          style="
            border-left: 1px solid rgba(136, 136, 136, 0.2);
            width: 1px;
            height: 10px;"
        ></div>

        <div
          style="
            tab-size: 4;
            font-family: Arial, Helvetica, sans-serif;
            pointer-events: auto;
            color: #F5F5F5;
            user-select: none;
            border-width: 0;
            border-style: solid;
            border-color: #e0e0e0;
            box-sizing: border-box;
            padding: 0 7px 0 8px;
            font-size: 0.8em;
            line-height: 1em;
            display: flex;
            gap: 3px;
            justify-items: center;
            align-items: center;
            transition: opacity 0.4s ease;"
        >
          1.2{' '}
          <span
            style="
                  tab-size: 4;
                  font-family: Arial, Helvetica, sans-serif;
                  pointer-events: auto;
                  color:  #F5F5F5
                  user-select: none;
                  border-width: 0;
                  border-style: solid;
                  border-color: #e0e0e0;
                  box-sizing: border-box;
                  font-size: 0.8em;
                  line-height: 0.6em;
                  opacity: 0.5;"
          >
            s
          </span>
        </div>
      </div>
      {devToolsStore.open && <Panel />}
    </div>
  );
});
