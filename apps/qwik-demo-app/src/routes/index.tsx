import { component$ } from '@builder.io/qwik';
import { Example } from '../components/exmaple';

export default component$(() => {
  return (
    <div style="height: 1200px; width: 100%; background-color: black">
      <Example />
			<Example />
			<Example />
    </div>
  );
});
