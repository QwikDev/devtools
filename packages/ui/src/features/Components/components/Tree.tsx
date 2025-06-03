/** @jsxImportSource react */
//@ts-nocheck
import { qwikify$ } from '@qwik.dev/react';
import {
  UncontrolledTreeEnvironment,
  Tree,
  StaticTreeDataProvider,
} from 'react-complex-tree';

const readTemplate = (template: any, data: any = { items: {} }) => {
  for (const [key, value] of Object.entries(template)) {
    data.items[key] = {
      index: key,
      canMove: true,
      isFolder: value !== null,
      children: value !== null ? Object.keys(value as object) : undefined,
      data: key,
      canRename: true,
    };

    if (value !== null) {
      readTemplate(value, data);
    }
  }
  return data;
};

const longTree = {
  root: {
    '<QwikRouterProvider />': {
      '<RouterHead />': null,
      '<RouterOutlet />': null,
    },
  },
};

// Create React component standard way
function Greetings() {
  return (
    <UncontrolledTreeEnvironment
      dataProvider={
        new StaticTreeDataProvider(
          readTemplate(longTree).items,
          (item, data) => ({
            ...item,
            data,
          }),
        )
      }
      getItemTitle={(item) => item.data}
      canDragAndDrop={false}
      canReorderItems={false}
      canDropOnFolder={false}
      canDropOnNonFolder={false}
      viewState={{
        'tree-1': {
          expandedItems: [],
        },
      }}
    >
      <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
    </UncontrolledTreeEnvironment>
  );
}

// Convert React component to Qwik component
export const QGreetings = qwikify$(Greetings, { eagerness: 'load' });
