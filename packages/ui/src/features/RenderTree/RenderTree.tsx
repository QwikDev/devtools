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
  isComputed,
  isListen,
  isPureSignal,
  isStore,
  isTask,
} from '../../utils/type';
import { findAllQrl, formatData, getData } from './formatTreeData';
import { unwrapStore } from '@qwik.dev/core/internal';
import { getViteClientRpc } from '@devtools/kit';
import { createHighlighter } from 'shiki';

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

  const onNodeClick = $((node: TreeNode) => {
    const typeMap = [
      { check: isPureSignal, type: 'UseSignal' },
      { check: isTask, type: 'Task' },
      { check: isComputed, type: 'Computed' },
      { check: isStore, type: 'UseStore', unwrap: true },
    ];

    if (Array.isArray(node.props?.[QSEQ])) {
      node.props[QSEQ].forEach((item: any) => {
        for (const { check, type, unwrap } of typeMap) {
          if (check(item)) {
            formatData(type as any, unwrap ? unwrapStore(item) : item);
            break;
          }
        }
      });
    }

    if (node.props?.[QRENDERFN]) {
      formatData('Render', node.props[QRENDERFN]);
    }

    if (node.props?.[QPROPS]) {
      const props = unwrapStore(node.props[QPROPS]);
      Object.entries(props).forEach(([key, value]) => {
        formatData(isListen(key) ? 'Listens' : 'Props', { [key]: value });
      });
    }

    const rpc = getViteClientRpc();
    codes.value = [];
    rpc?.getModulesByPathIds(findAllQrl()).then((res) => {
      codes.value = res.filter((item) => item.modules);
    });
   
    stateTree.value = getData() as TreeNode[];
  });

  const currentTab = useSignal<'state' | 'code'>('state');

  return (
    <div class="h-full w-full flex-1 overflow-hidden rounded-md border  border-border">
      <div class="flex h-full w-full">
        <div class="w-[50%] overflow-hidden p-4">
          <Tree data={data} onNodeClick={onNodeClick}></Tree>
        </div>
        <div class="border-l border-border"></div>
        <div class="flex h-full w-[50%] flex-col p-4">
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
            <div class="mt-5 flex-1 overflow-y-auto rounded-lg border border-border bg-card-item-bg p-2 shadow-sm">
              <Tree
                data={stateTree}
                gap={10}
                isHover={false}
                renderNode={$((node) => {
                  const label = node.label || node.name || '';
                  const isProperty = label.split(':');
                  if (
                    label === 'UseStore' ||
                    label === 'UseSignal' ||
                    label === 'Computed' ||
                    label === 'Task' ||
                    label === 'Props' ||
                    label === 'Listens'
                  ) {
                    return (
                      <span class="text-gray-500 dark:text-gray-300">
                        {label}
                      </span>
                    );
                  }

                  return isProperty.length > 1 ? (
                    <>
                      <span class="text-red-300 dark:text-red-500">
                        {isProperty[0]}
                      </span>
                      <span class="text-gray-400">: {isProperty[1]}</span>
                    </>
                  ) : (
                    <span>{label}</span>
                  );
                })}
              ></Tree>
            </div>
          )}

          {currentTab.value === 'code' && (
            <div class="mt-5 flex-1 overflow-y-auto rounded-lg border  border-border p-2 shadow-sm">
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
                  </>                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
