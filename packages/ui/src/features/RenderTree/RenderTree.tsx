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
import { Tree } from '../../components/Tree/Tree';
import type { TreeNode } from '../../components/Tree/type';
import { vnode_toObject } from '../../components/Tree/filterVnode';
import { htmlContainer } from '../../utils/location';
import { ISDEVTOOL } from '../../components/Tree/type';
import { removeNodeFromTree } from '../../components/Tree/vnode';
import { isListen } from '../../utils/type';
import debug from 'debug';
import { getHookStore, QrlUtils, type HookType } from './formatTreeData';
import type { QRLInternal } from './types';
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
import { IconChevronUpMini } from '../../components/Icons/Icons';
import type { ParsedHookEntry } from './types';

const log = debug('qwik:devtools:renderTree');

interface CodeModule {
  pathId: string;
  modules: { code: string } | null;
  error?: string;
}

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
  const codes = useSignal<CodeModule[]>([]);
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
      const qrl = QrlUtils.getChunkName(node.props[QRENDERFN] as QRLInternal);
      parsed = getQwikState(qrl);
    }

    if (Array.isArray(node.props?.[QSEQ]) && parsed.length > 0) {
      const normalizedData = [...parsed, ...returnQrlData(node.props?.[QSEQ])];
      normalizedData.forEach((item) => {
        hookStore.value.add(item.hookType as HookType, item as ParsedHookEntry);
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

    const res =
      (await rpc?.getModulesByPathIds(hookStore.value.findAllQrlPaths())) ?? [];
    log('getModulesByPathIds return: %O', res);
    codes.value = res.filter(
      (item: CodeModule) => item.modules
    );
    stateTree.value = hookStore.value.buildTree();
    hookFilters.value = hookStore.value.getFilterList();
  });

  const currentTab = useSignal<'state' | 'code'>('state');

  return (
    <div class="h-full w-full flex-1 overflow-hidden rounded-2xl border border-glass-border bg-card-item-bg">
      <div class="flex h-full w-full">
        <div class="w-1/2 overflow-hidden p-3 custom-scrollbar" style={{ minWidth: '360px' }}>
          <Tree data={data} onNodeClick={onNodeClick}></Tree>
        </div>
        <div class="border-l border-glass-border"></div>
        <div class="flex h-full min-h-0 w-1/2 flex-col overflow-hidden p-4">
          <div class="">
            <div class="border-b border-glass-border flex space-x-2 pb-1">
              <button
                onClick$={() => (currentTab.value = 'state')}
                class={[
                  'px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                  currentTab.value === 'state'
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
                ]}
                style={currentTab.value === 'state' ? { boxShadow: 'inset 0 -2px 0 0 var(--color-primary)' } : {}}
              >
                State
              </button>
              <button
                onClick$={() => (currentTab.value = 'code')}
                class={[
                  'px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                  currentTab.value === 'code'
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
                ]}
                style={currentTab.value === 'code' ? { boxShadow: 'inset 0 -2px 0 0 var(--color-primary)' } : {}}
              >
                Code
              </button>
            </div>
          </div>

          {currentTab.value === 'state' && (
            <div class="mt-5 flex min-h-0 flex-1 flex-col">
              <div class="rounded-xl border border-glass-border bg-card-item-bg">
                <div class="border-b border-glass-border flex items-center justify-between px-2 py-2">
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
                        );
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
                        );
                      })}
                    >
                      Clear
                    </button>
                    <button
                      aria-label="toggle hooks"
                      onClick$={$(() => (hooksOpen.value = !hooksOpen.value))}
                      class="text-muted-foreground hover:text-foreground rounded p-1"
                    >
                      <IconChevronUpMini
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
                    <label key={idx} class="flex items-center gap-2 cursor-pointer">
                      <input
                        class="h-4 w-4 rounded focus:ring-0 cursor-pointer"
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
                          );
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
            <div class="mt-4 min-h-0 flex-1 overflow-y-auto rounded-xl border border-glass-border bg-card-item-bg p-2">
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
                        <div class="border-glass-border bg-card-item-bg hover:bg-card-item-hover-bg mb-4 rounded-xl border p-4 transition-colors">
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
