import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { loadComponentGraph } from '../utils';

export const DevTools = component$(() => {
  useVisibleTask$(() => {
    const cmpGraph = loadComponentGraph();
    console.log('cmpGraph', cmpGraph);
  });
  return <div>Qwik DevTools</div>;
});
