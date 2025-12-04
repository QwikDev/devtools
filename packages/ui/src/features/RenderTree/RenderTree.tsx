import {
  component$,
  useVisibleTask$,
  useComputed$,
  $,
  useSignal,
  useStyles$,
  useResource$,
  Resource,
} from '@qwik.dev/core';
import { Tree, TreeNode } from '../../components/Tree/Tree';
import { vnode_toObject } from '../../components/Tree/filterVnode';
import { htmlContainer } from '../../utils/location';
import { ISDEVTOOL } from '../../components/Tree/type';
import { removeNodeFromTree } from '../../components/Tree/vnode';
import { isListen } from '../../utils/type';
import debug from 'debug';
import { getHookStore, QrlUtils, type HookType } from './formatTreeData';
import { unwrapStore } from '@qwik.dev/core/internal';
import {
  getViteClientRpc,
  ParsedStructure,
  QPROPS,
  QRENDERFN,
  QSEQ,
} from '@devtools/kit';
import { getHighlighter } from '../../utils/shiki';
import { getQwikState, returnQrlData } from './data';
import { HiChevronUpMini } from '@qwikest/icons/heroicons';

const log = debug('qwik:devtools:renderTree');

function getValueColorClass(node: TreeNode, valueText: string): string {
  switch (node.elementType) {
    case 'string':
      return 'text-red-400';
    case 'number':
      return 'text-green-400';
    case 'boolean':
      return 'text-amber-400';
    case 'function':
      return 'text-purple-400';
    case 'array':
      return 'text-muted-foreground';
    case 'object':
      return /(Array\[|Object\s\{|Class\s\{)/.test(valueText)
        ? 'text-muted-foreground'
        : 'text-foreground';
    default:
      return 'text-foreground';
  }
}

export const RenderTree = component$(() => {
  const hookStore = useSignal(getHookStore());
  useStyles$(`
    pre.shiki {
      overflow: auto;
      padding: 10px;
    }
  `);
  const codes = useSignal<{ pathId: string; modules: any; error?: string }[]>(
    [],
  );
  const data = useSignal<TreeNode[]>([]);

  const stateTree = useSignal<TreeNode[]>([]);
  const hookFilters = useSignal<{ key: HookType; display: boolean }[]>([]);
  const hooksOpen = useSignal(true);

  const qwikContainer = useComputed$(() => {
    try {
      return htmlContainer();
    } catch (error) {
      log('get html container failed: %O', error);
      return null;
    }
  });

  const highlightedCodesResource = useResource$(async ({ track }) => {
    track(() => codes.value);
    if (!codes.value.length) {
      return [] as string[];
    }
    const highlighter = await getHighlighter();
    return codes.value.map((item) => {
      let lang = 'tsx';
      if (item.pathId.endsWith('.js')) lang = 'js';
      if (item.pathId.endsWith('.ts')) lang = 'ts';
      if (item.pathId.endsWith('.jsx')) lang = 'jsx';
      if (item.pathId.endsWith('.tsx')) lang = 'tsx';
      return item?.modules?.code
        ? highlighter.codeToHtml(item.modules.code, { lang, theme: 'nord' })
        : '';
    });
  });

  useVisibleTask$(() => {
    data.value = removeNodeFromTree(
      vnode_toObject(qwikContainer.value!.rootVNode)!,
      (node) => {
        return node.name === ISDEVTOOL;
      },
    );
  });

  const onNodeClick = $(async (node: TreeNode) => {
    log(' current node clicked: %O', node);
    const rpc = getViteClientRpc();
    let parsed: ParsedStructure[] = [];

    // reset previous collected hook data before new node aggregation
    hookStore.value.clear();

    if (node.props?.[QRENDERFN]) {
      hookStore.value.add('render', { data: { render: node.props[QRENDERFN] } });
      const qrl = QrlUtils.getChunkName(node.props[QRENDERFN]);
      parsed = getQwikState(qrl);
    }

    if (Array.isArray(node.props?.[QSEQ]) && parsed.length > 0) {
      const normalizedData = [...parsed, ...returnQrlData(node.props?.[QSEQ])];
      normalizedData.forEach((item) => {
        hookStore.value.add(item.hookType as HookType, item);
      });
    }

    if (node.props?.[QPROPS]) {
      const props = unwrapStore(node.props[QPROPS]);
      Object.entries(props).forEach(([key, value]) => {
        hookStore.value.add(isListen(key) ? 'listens' : 'props', {
          data: { [key]: value },
        });
      });
    }

    codes.value = [];

    const res = await rpc?.getModulesByPathIds(hookStore.value.findAllQrlPaths());
    log('getModulesByPathIds return: %O', res);
    codes.value = res.filter((item) => item.modules);
    stateTree.value = hookStore.value.buildTree() as TreeNode[];
    hookFilters.value = hookStore.value.getFilterList();
  });

  const currentTab = useSignal<'state' | 'code'>('state');

  return (
    <div class="border-border bg-background h-full w-full flex-1 overflow-hidden rounded-md border">
      <div class="flex h-full w-full">
        <div class="w-1/2 overflow-hidden p-4" style={{ minWidth: '400px' }}>
          <Tree data={data} onNodeClick={onNodeClick}></Tree>
        </div>
        <div class="border-border border-l"></div>
        <div class="flex h-full min-h-0 w-1/2 flex-col overflow-hidden p-4">
          <div class="border-border border-b">
            <div class="border-border flex space-x-4 border-b">
              <button
                onClick$={() => (currentTab.value = 'state')}
                style={
                  currentTab.value === 'state'
                    ? { borderBottom: '2px solid var(--color-primary-active)' }
                    : {}
                }
                class="text-muted-foreground hover:text-foreground border-b-2 border-b-transparent px-4 py-3 text-sm font-medium transition-all duration-300 ease-in-out"
              >
                State
              </button>
              <button
                onClick$={() => (currentTab.value = 'code')}
                style={
                  currentTab.value === 'code'
                    ? { borderBottom: '2px solid var(--color-primary-active)' }
                    : {}
                }
                class="text-muted-foreground hover:text-foreground border-b-2 border-b-transparent px-4 py-3 text-sm font-medium transition-all duration-300 ease-in-out"
              >
                Code
              </button>
            </div>
          </div>

          {currentTab.value === 'state' && (
            <div class="mt-5 flex min-h-0 flex-1 flex-col">
              <div class="border-border bg-card-item-bg rounded-lg border shadow-sm">
                <div class="border-border flex items-center justify-between border-b px-2 py-2">
                  <span class="text-muted-foreground text-xs font-medium">
                    Hooks
                  </span>
                  <div class="flex items-center space-x-2">
                    <button
                      class="text-primary px-2 py-1 text-xs hover:underline"
                      onClick$={$(() => {
                        hookFilters.value = hookFilters.value.map((item) => {
                          item.display = true;
                          return item;
                        });
                        stateTree.value = hookStore.value.buildTree().filter((item) =>
                          hookFilters.value.some(
                            (hook) => hook.key === item?.label && hook.display,
                          ),
                        ) as TreeNode[];
                      })}
                    >
                      Select all
                    </button>
                    <button
                      class="text-muted-foreground hover:text-foreground px-2 py-1 text-xs hover:underline"
                      onClick$={$(() => {
                        hookFilters.value = hookFilters.value.map((item) => {
                          item.display = false;
                          return item;
                        });
                        stateTree.value = hookStore.value.buildTree().filter((item) =>
                          hookFilters.value.some(
                            (hook) => hook.key === item?.label && hook.display,
                          ),
                        ) as TreeNode[];
                      })}
                    >
                      Clear
                    </button>
                    <button
                      aria-label="toggle hooks"
                      onClick$={$(() => (hooksOpen.value = !hooksOpen.value))}
                      class="text-muted-foreground hover:text-foreground rounded p-1"
                    >
                      <HiChevronUpMini
                        class={`h-4 w-4 transition-transform duration-200 ${
                          hooksOpen.value ? 'rotate-180' : '-rotate-90'
                        }`}
                      />
                    </button>
                  </div>
                </div>
                <div
                  class="grid grid-cols-2 gap-x-6 gap-y-3 overflow-hidden px-3 py-2 text-sm sm:grid-cols-3 lg:grid-cols-4"
                  style={{
                    maxHeight: hooksOpen.value ? '800px' : '0px',
                    opacity: hooksOpen.value ? '1' : '0',
                    transition: 'max-height 200ms ease, opacity 200ms ease',
                  }}
                >
                  {hookFilters.value.map((item, idx) => (
                    <label key={idx} class="flex items-center">
                      <input
                        class="border-border focus:ring-primary-active h-4 w-4 rounded-full focus:ring-offset-0 dark:border-[#374151] dark:bg-[#1F2937]"
                        style={{ accentColor: 'var(--color-primary-active)' }}
                        type="checkbox"
                        checked={item.display}
                        onChange$={(ev: InputEvent) => {
                          const target = ev.target as HTMLInputElement;
                          hookFilters.value[idx].display = target.checked;
                          stateTree.value = hookStore.value.buildTree().filter((item) =>
                            hookFilters.value.some(
                              (hook) =>
                                hook.key === item?.label && hook.display,
                            ),
                          ) as TreeNode[];
                        }}
                      />
                      <span class="ml-2 select-none">{item.key}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div class="mt-4 min-h-0 flex-1 overflow-y-auto p-2">
                <Tree
                  data={stateTree}
                  gap={10}
                  animate
                  animationDuration={200}
                  isHover
                  renderNode={$((node: TreeNode) => {
                    const label = node.label || node.name || '';
                    const parts = label.split(':');
                    if (node.children && parts.length === 1) {
                      return (
                        <span class="font-semibold text-pink-400">{label}</span>
                      );
                    }
                    if (parts.length > 1) {
                      const key = parts[0];
                      const value = parts.slice(1).join(':').trim();
                      const valueClass = getValueColorClass(node, value);
                      return (
                        <>
                          <span class="text-blue-400">{key}</span>
                          <span class="text-foreground/70"> : </span>
                          <span class={valueClass}>{value}</span>
                        </>
                      );
                    }
                    return <span>{label}</span>;
                  })}
                ></Tree>
              </div>
            </div>
          )}

          {currentTab.value === 'code' && (
            <div class="border-border mt-5 min-h-0 flex-1 overflow-y-auto rounded-lg border p-2 shadow-sm">
              <Resource
                value={highlightedCodesResource}
                onPending={() => (
                  <div class="text-muted-foreground p-2 text-sm">
                    Loading code highlights…
                  </div>
                )}
                onResolved={(highlighted) => (
                  <>
                    {codes.value.map((item, idx) => (
                      <>
                        <div class="border-border bg-card-item-bg hover:bg-card-item-hover-bg mb-4 rounded-xl border p-4 shadow-sm transition-colors">
                          <div class="text-primary mb-2 break-all text-base font-semibold">
                            {item.pathId}
                          </div>
                          <pre
                            class="overflow-hidden"
                            dangerouslySetInnerHTML={highlighted[idx] || ''}
                          />
                        </div>
                      </>
                    ))}
                  </>
                )}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
