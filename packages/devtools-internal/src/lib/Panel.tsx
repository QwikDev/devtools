import { component$ } from '@builder.io/qwik';
import { QwikIcon } from './QwikIcon';

export const Panel = component$(() => {
  return (
    <div style="position: fixed; top: 60px; width: 80%; min-height: 300px; display: flex; background-color:#161616;border-radius: 10px; border: 1px solid #9ca3af33;">
      <div style="display: flex; flex-direction: column;min-height:100%; width: 40px;border-right: 1px solid #9ca3af33;">
        <div style="padding: 10px 10px 5px 10px;">
          <QwikIcon width={22} height={22} />
        </div>
        <div style="border-bottom: 2px solid #9ca3af33;" />
      </div>
      <div style="width: 100%; min-height:100%;"></div>
    </div>
  );
});
