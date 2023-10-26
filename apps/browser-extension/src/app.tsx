import { $, component$, useSignal } from '@builder.io/qwik';

import qwikLogo from './assets/qwik.svg';
import './app.css';

export const App = component$(() => {
	const count = useSignal(0);

	const create = $(() => {
		chrome.devtools.panels.create(
			'⚛️ Components',
			'icons/production.svg',
			'<div>ciao</div>',
			(createdPanel) => {
				createdPanel.onShown.addListener((portal) => {
					console.log('createdPanel.onShown.addListener', portal);
				});

				// TODO: we should listen to createdPanel.onHidden to unmount some listeners
				// and potentially stop highlighting
			}
		);
	});

	return (
		<>
			<div>
				<a href='https://vitejs.dev' target='_blank'>
				</a>
				<a href='https://qwik.builder.io' target='_blank'>
					<img src={qwikLogo} class='logo qwik' alt='Qwik logo' />
				</a>
			</div>
			<h1>Vite + Qwik</h1>
			<div class='card'>
				<button onClick$={() => count.value++}>count is {count.value}</button>

				<button onClick$={create}>create</button>
			</div>
			<p class='read-the-docs'>
				Click on the Vite and Qwik logos to learn more
			</p>
		</>
	);
});
