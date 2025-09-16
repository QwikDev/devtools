import {
  component$,
  useVisibleTask$,
  useComputed$,
  $,
  useSignal,
  useStyles$
} from '@qwik.dev/core';
import { Tree, TreeNode } from '../../components/Tree/Tree';
import { vnode_toObject } from '../../components/Tree/filterVnode';
import { htmlContainer } from '../../utils/location';
import { ISDEVTOOL } from '../../components/Tree/type';
import { QPROPS, QRENDERFN, QSEQ } from './transfromqseq';
import { removeNodeFromTree } from '../../components/Tree/vnode';
import {
  isListen,
} from '../../utils/type';
import { findAllQrl, formatData, buildTree, clearAll, getHookFilterList, getQrlChunkName } from './formatTreeData';
import type { QSeqsList } from './formatTreeData';
import { unwrapStore } from '@qwik.dev/core/internal';
import { getViteClientRpc, ParsedStructure } from '@devtools/kit';
import { createHighlighter } from 'shiki';
import { getQwikState, returnQrlData } from './data';

export const RenderTree = component$(() => {

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
  const hookFilters = useSignal<{ key: QSeqsList; display: boolean }[]>([]);

  const qwikContainer = useComputed$(() => {
    try {
      return htmlContainer();
    } catch (error) {
      console.error(error);
      return null;
    }
  });

  const highlightedCodes = useSignal<string[]>([]);

  useVisibleTask$(async ({ track }) => {
    track(() => codes.value);
    if (!codes.value.length) {
      highlightedCodes.value = [];
      return;
    }
    const highlighter = await createHighlighter({
      themes: ['nord'], // v1+ 需要数组
      langs: ['tsx', 'js', 'ts', 'jsx'],
    });
    highlightedCodes.value = codes.value.map(item => {
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
    console.log('current node', node);
    const rpc = getViteClientRpc();
    let parsed: ParsedStructure[] = []

    // reset previous collected hook data before new node aggregation
    clearAll();

    if (node.props?.[QRENDERFN]) {
      formatData('render', {data: {render: node.props[QRENDERFN]}});
      const qrl = getQrlChunkName(node.props[QRENDERFN])
      parsed = getQwikState(qrl)
    }
1

    if (Array.isArray(node.props?.[QSEQ]) && parsed.length > 0) {
      const normalizedData = [...parsed,...returnQrlData(node.props?.[QSEQ])]
      //@ts-ignore
      normalizedData.forEach((item) => {
        formatData(item.hookType, item);
      });
    }

    

    if (node.props?.[QPROPS]) {
      const props = unwrapStore(node.props[QPROPS]);
      Object.entries(props).forEach(([key, value]) => {
          formatData(isListen(key) ? 'listens' : 'props', { data: {[key]: value} });
      });
    }

    
    codes.value = [];
    
    const res = await rpc?.getModulesByPathIds(findAllQrl())
    codes.value = res.filter((item) => item.modules);
    stateTree.value = buildTree() as TreeNode[]
    hookFilters.value = getHookFilterList()
  });

  const currentTab = useSignal<'state' | 'code'>('state');


  return (
    <div class="h-full w-full flex-1 overflow-hidden rounded-md border  border-border">
      <div class="flex h-full w-full">
        <div class="w-1/2 overflow-hidden p-4" style={{minWidth: '400px'}}>
          <Tree data={data} onNodeClick={onNodeClick}></Tree>
        </div>
        <div class="border-l border-border"></div>
        <div class="flex h-full w-1/2 flex-col p-4 min-h-0 overflow-hidden">
          <div class="border-b border-border">
            <div class="flex space-x-4 border-b border-border">
              <button
                onClick$={() => (currentTab.value = 'state')}
                style={
                  currentTab.value === 'state'
                    ? { borderBottom: '2px solid var(--color-primary-active)' }
                    : {}
                }
                class="border-b-2 border-b-transparent px-4 py-3 text-sm font-medium transition-all duration-300 ease-in-out"
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
                class="border-b-2 border-b-transparent px-4 py-3 text-sm font-medium  transition-all duration-300 ease-in-out"
              >
                Code
              </button>
            </div>
          </div>

          {currentTab.value === 'state' && (
            <div class="mt-5 flex flex-1 min-h-0 flex-col rounded-lg border border-border bg-card-item-bg shadow-sm">
              <div class="flex flex-wrap items-center gap-2 border-b border-border px-2 py-2">
                <span class="text-xs text-muted-foreground">Hooks:</span>
                {hookFilters.value.map((item, idx) => (
                    <label class="flex items-center space-x-1 rounded border border-border px-2 py-1 text-xs" key={idx}>
                      <input
                        type="checkbox"
                        checked={item.display}
                        onChange$={(ev) => {
                          const target = ev.target as HTMLInputElement;
  
                          hookFilters.value[idx].display = target.checked;
                          
                          stateTree.value = buildTree().filter((item) => hookFilters.value.some(hook => hook.key === item?.label && hook.display)) as TreeNode[]
                        }}
                      />
                      <span>{item.key}</span>
                    </label>
                  ))}
                <button
                  class="ml-auto rounded border border-border px-2 py-1 text-xs"
                  onClick$={$(() => {

                    hookFilters.value = hookFilters.value.map((item) => {
                      item.display = true;
                      return item
                    })
                    stateTree.value = buildTree().filter((item) => hookFilters.value.some(hook => hook.key === item?.label && hook.display)) as TreeNode[]

                  })}
                >
                  Select all
                </button>
                <button
                  class="rounded border border-border px-2 py-1 text-xs"
                  onClick$={$(() => {
                    hookFilters.value = hookFilters.value.map((item) => {
                      item.display = false;
                      return item
                    })
                    stateTree.value = buildTree().filter((item) => hookFilters.value.some(hook => hook.key === item?.label && hook.display)) as TreeNode[]
                  })}
                >
                  Clear
                </button>
              </div>
              <div class="flex-1 min-h-0 overflow-y-auto p-2">
                <Tree
                  data={stateTree}
                  gap={10}
                  animate
                  animationDuration={200}
                  isHover
                  renderNode={$((node) => {
                    const label = node.label || node.name || '';
                    const isProperty = label.split(':');
                    return isProperty.length > 1 ? (
                      <>
                        <span class="text-red-300 dark:text-red-500">
                          {isProperty[0]}
                        </span>
                        <span class="text-gray-700 dark:text-white"> : {isProperty[1]}</span>
                      </>
                    ) : (
                      <span>{label}</span>
                    );
                  })}
                ></Tree>
              </div>
            </div>
          )}

          {currentTab.value === 'code' && (
            <div class="mt-5 flex-1 min-h-0 overflow-y-auto rounded-lg border  border-border p-2 shadow-sm">
              {codes.value.map((item, idx) => {
                return (
                  <>
                  <div class="mb-4 p-4 rounded-xl shadow-lg bg-background border border-border">
                    <div class="text-base font-semibold mb-2 break-all text-primary">
                      {item.pathId}
                    </div>
                    <pre
                     class="overflow-hidden"
                      dangerouslySetInnerHTML={highlightedCodes.value[idx] || ''}
                    />
                  </div>
                  </> );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

