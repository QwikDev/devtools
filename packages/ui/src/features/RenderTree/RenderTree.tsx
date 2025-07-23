import {
  component$,
  useVisibleTask$,
  useComputed$,
  $,
  useSignal,
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

export const RenderTree = component$(() => {
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
      return;
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
                    label === 'useStore' ||
                    label === 'useSignal' ||
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
              {codes.value.map((item) => {
                return (
                  <>
                    <div
                      class="mb-4 rounded-xl p-4 shadow-lg"
                      style={{
                        background: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <div
                        class="mb-2 break-all text-base font-semibold"
                        style={{
                          color: 'var(--color-primary)',
                        }}
                      >
                        {item.pathId}
                      </div>
                      <pre
                        class="custom-scrollbar overflow-x-auto whitespace-pre-wrap break-words rounded-md p-3 font-mono text-sm"
                        style={{
                          background: 'var(--color-card-item-bg)',
                          color: 'var(--color-foreground)',
                          border: '1px solid var(--color-border)',
                        }}
                      >
                        {item?.modules?.code}
                      </pre>
                    </div>
                  </>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
