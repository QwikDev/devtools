import {
  $,
  component$,
  createContextId,
  useContextProvider,
  useSignal,
  useStore,
  useStyles$,
} from '@builder.io/qwik';
import styles from './app.css?inline';
import { Header } from './components/Header';
import { LeftPanel } from './components/LeftPanel';
import { RightPanel } from './components/RightPanel';

export const mockComponents = {
	'6': {
		id: '6',
		parentId: null,
		props: [],
		children: [
			{
				id: '7',
				parentId: '6',
				props: [],
				children: [
					{
						id: '9',
						parentId: '7',
						props: [],
						children: [
							{
								id: 'b',
								parentId: '9',
								props: [
									{
										key: 'class',
										value: 'flex items-center space-x-1 pb-1 pr-2',
									},
									{ key: 'href', value: '/sign-in' },
								],
								children: [
									{
										id: 'ref=b',
										parentId: 'b',
										props: [],
										children: [{ id: 'd', parentId: 'ref=b', props: [] }],
									},
								],
							},
							{ id: 'f', parentId: '9', props: [] },
							{
								id: 'g',
								parentId: '9',
								props: [],
								children: [{ id: 'ref=g', parentId: 'g', props: [] }],
							},
							{
								id: 'i',
								parentId: '9',
								props: [
									{
										key: 'class',
										value:
											'text-sm md:text-base text-gray-200 hover:text-white',
									},
									{ key: 'href', value: '/collections/electronics' },
								],
								children: [{ id: 'ref=i', parentId: 'i', props: [] }],
							},
							{
								id: 'l',
								parentId: '9',
								props: [
									{
										key: 'class',
										value:
											'text-sm md:text-base text-gray-200 hover:text-white',
									},
									{ key: 'href', value: '/collections/home-garden' },
								],
								children: [{ id: 'ref=l', parentId: 'l', props: [] }],
							},
							{
								id: 'o',
								parentId: '9',
								props: [
									{
										key: 'class',
										value:
											'text-sm md:text-base text-gray-200 hover:text-white',
									},
									{ key: 'href', value: '/collections/sports-outdoor' },
								],
								children: [{ id: 'ref=o', parentId: 'o', props: [] }],
							},
							{ id: 'r', parentId: '9', props: [] },
							{ id: 't', parentId: '9', props: [] },
							{ id: 'u', parentId: '9', props: [] },
						],
					},
					{ id: 'v', parentId: '7', props: [] },
					{ id: 'w', parentId: '7', props: [] },
				],
			},
			{
				id: 'ref=7',
				parentId: '6',
				props: [],
				children: [
					{
						id: 'x',
						parentId: 'ref=7',
						props: [],
						children: [
							{ id: '37', parentId: 'x', props: [] },
							{
								id: 'y',
								parentId: 'x',
								props: [{ key: 'collection' }],
								children: [
									{
										id: 'z',
										parentId: 'y',
										props: [{ key: '$$href' }],
										children: [
											{
												id: 'ref=z',
												parentId: 'z',
												props: [],
												children: [
													{
														id: '2p',
														parentId: 'ref=z',
														props: [
															{ key: 'height', value: '300' },
															{ key: 'layout', value: 'fixed' },
															{ key: 'width', value: '300' },
															{ key: '$$src' },
															{ key: '$$alt' },
														],
													},
												],
											},
										],
									},
								],
							},
							{
								id: '12',
								parentId: 'x',
								props: [{ key: 'collection' }],
								children: [
									{
										id: '13',
										parentId: '12',
										props: [{ key: '$$href' }],
										children: [
											{
												id: 'ref=13',
												parentId: '13',
												props: [],
												children: [
													{
														id: '2r',
														parentId: 'ref=13',
														props: [
															{ key: 'height', value: '300' },
															{ key: 'layout', value: 'fixed' },
															{ key: 'width', value: '300' },
															{ key: '$$src' },
															{ key: '$$alt' },
														],
													},
												],
											},
										],
									},
								],
							},
							{
								id: '16',
								parentId: 'x',
								props: [{ key: 'collection' }],
								children: [
									{
										id: '17',
										parentId: '16',
										props: [{ key: '$$href' }],
										children: [
											{
												id: 'ref=17',
												parentId: '17',
												props: [],
												children: [
													{
														id: '2t',
														parentId: 'ref=17',
														props: [
															{ key: 'height', value: '300' },
															{ key: 'layout', value: 'fixed' },
															{ key: 'width', value: '300' },
															{ key: '$$src' },
															{ key: '$$alt' },
														],
													},
												],
											},
										],
									},
								],
							},
							{
								id: '1a',
								parentId: 'x',
								props: [{ key: 'collection' }],
								children: [
									{
										id: '1b',
										parentId: '1a',
										props: [{ key: '$$href' }],
										children: [
											{
												id: 'ref=1b',
												parentId: '1b',
												props: [],
												children: [
													{
														id: '2v',
														parentId: 'ref=1b',
														props: [
															{ key: 'height', value: '300' },
															{ key: 'layout', value: 'fixed' },
															{ key: 'width', value: '300' },
															{ key: '$$src' },
															{ key: '$$alt' },
														],
													},
												],
											},
										],
									},
								],
							},
							{
								id: '1e',
								parentId: 'x',
								props: [{ key: 'collection' }],
								children: [
									{
										id: '1f',
										parentId: '1e',
										props: [{ key: '$$href' }],
										children: [
											{
												id: 'ref=1f',
												parentId: '1f',
												props: [],
												children: [
													{
														id: '2x',
														parentId: 'ref=1f',
														props: [
															{ key: 'height', value: '300' },
															{ key: 'layout', value: 'fixed' },
															{ key: 'width', value: '300' },
															{ key: '$$src' },
															{ key: '$$alt' },
														],
													},
												],
											},
										],
									},
								],
							},
							{
								id: '1i',
								parentId: 'x',
								props: [{ key: 'collection' }],
								children: [
									{
										id: '1j',
										parentId: '1i',
										props: [{ key: '$$href' }],
										children: [
											{
												id: 'ref=1j',
												parentId: '1j',
												props: [],
												children: [
													{
														id: '2z',
														parentId: 'ref=1j',
														props: [
															{ key: 'height', value: '300' },
															{ key: 'layout', value: 'fixed' },
															{ key: 'width', value: '300' },
															{ key: '$$src' },
															{ key: '$$alt' },
														],
													},
												],
											},
										],
									},
								],
							},
							{
								id: '1m',
								parentId: 'x',
								props: [{ key: 'collection' }],
								children: [
									{
										id: '1n',
										parentId: '1m',
										props: [{ key: '$$href' }],
										children: [
											{
												id: 'ref=1n',
												parentId: '1n',
												props: [],
												children: [
													{
														id: '31',
														parentId: 'ref=1n',
														props: [
															{ key: 'height', value: '300' },
															{ key: 'layout', value: 'fixed' },
															{ key: 'width', value: '300' },
															{ key: '$$src' },
															{ key: '$$alt' },
														],
													},
												],
											},
										],
									},
								],
							},
							{
								id: '1q',
								parentId: 'x',
								props: [{ key: 'collection' }],
								children: [
									{
										id: '1r',
										parentId: '1q',
										props: [{ key: '$$href' }],
										children: [
											{
												id: 'ref=1r',
												parentId: '1r',
												props: [],
												children: [
													{
														id: '33',
														parentId: 'ref=1r',
														props: [
															{ key: 'height', value: '300' },
															{ key: 'layout', value: 'fixed' },
															{ key: 'width', value: '300' },
															{ key: '$$src' },
															{ key: '$$alt' },
														],
													},
												],
											},
										],
									},
								],
							},
							{
								id: '1u',
								parentId: 'x',
								props: [{ key: 'collection' }],
								children: [
									{
										id: '1v',
										parentId: '1u',
										props: [{ key: '$$href' }],
										children: [
											{
												id: 'ref=1v',
												parentId: '1v',
												props: [],
												children: [
													{
														id: '35',
														parentId: 'ref=1v',
														props: [
															{ key: 'height', value: '300' },
															{ key: 'layout', value: 'fixed' },
															{ key: 'width', value: '300' },
															{ key: '$$src' },
															{ key: '$$alt' },
														],
													},
												],
											},
										],
									},
								],
							},
						],
					},
				],
			},
			{
				id: '1y',
				parentId: '6',
				props: [],
				children: [
					{
						id: '1z',
						parentId: '1y',
						props: [
							{
								key: 'class',
								value: 'text-base text-gray-500 hover:text-gray-600',
							},
							{ key: 'href', value: '/collections/electronics' },
						],
						children: [{ id: 'ref=1z', parentId: '1z', props: [] }],
					},
					{
						id: '22',
						parentId: '1y',
						props: [
							{
								key: 'class',
								value: 'text-base text-gray-500 hover:text-gray-600',
							},
							{ key: 'href', value: '/collections/home-garden' },
						],
						children: [{ id: 'ref=22', parentId: '22', props: [] }],
					},
					{
						id: '25',
						parentId: '1y',
						props: [
							{
								key: 'class',
								value: 'text-base text-gray-500 hover:text-gray-600',
							},
							{ key: 'href', value: '/collections/sports-outdoor' },
						],
						children: [{ id: 'ref=25', parentId: '25', props: [] }],
					},
					{
						id: '28',
						parentId: '1y',
						props: [],
						children: [{ id: 'ref=28', parentId: '28', props: [] }],
					},
					{
						id: '2a',
						parentId: '1y',
						props: [],
						children: [{ id: 'ref=2a', parentId: '2a', props: [] }],
					},
					{
						id: '2c',
						parentId: '1y',
						props: [],
						children: [{ id: 'ref=2c', parentId: '2c', props: [] }],
					},
					{
						id: '2e',
						parentId: '1y',
						props: [],
						children: [{ id: 'ref=2e', parentId: '2e', props: [] }],
					},
					{
						id: '2g',
						parentId: '1y',
						props: [],
						children: [{ id: 'ref=2g', parentId: '2g', props: [] }],
					},
					{
						id: '2i',
						parentId: '1y',
						props: [],
						children: [{ id: 'ref=2i', parentId: '2i', props: [] }],
					},
					{
						id: '2k',
						parentId: '1y',
						props: [],
						children: [{ id: 'ref=2k', parentId: '2k', props: [] }],
					},
					{
						id: '2m',
						parentId: '1y',
						props: [],
						children: [{ id: 'ref=2m', parentId: '2m', props: [] }],
					},
					{ id: '2o', parentId: '1y', props: [] },
				],
			},
		],
	},
};

export type Component = {
  id: string;
  parentId: string | null;
  props: { key: string, value: string }[];
  refs: string[];
  children?: Component[]
}

export type DevTool = {
  selectedComponent?: Component;
  components?: Record<string, Component>;
};
export const DevToolContext = createContextId<DevTool>('DevTool');

export const App = component$(() => {
  useStyles$(styles);
  const store = useStore<DevTool>({ });
  useContextProvider(DevToolContext, store);

  const isReadySig = useSignal(false);

  const setComponents = $((components: string) => {
    store.components = JSON.parse(components);
    isReadySig.value = true;
  });

  if (!isReadySig.value) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      chrome.tabs.sendMessage(tabs[0].id, { data: '123' }, function (response) {
        setComponents(response.components);
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
                style="grid-template-columns: 50% 1px 1fr"
              >
                <LeftPanel components={store.components} />
                <div class="relative bg-panel-border">
                  <div class="absolute z-9999 select-none -inset-y-3px inset-x-0 sm:inset-y-0 sm:-inset-x-3px bg-panel-border transition opacity-0"></div>
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
