import { parse } from '@babel/parser';
import { visit } from 'ast-types';

export interface ComponentNode {
  name: string;
  children: ComponentNode[];
  filePath: string;
}

function createComponentTreePlugin() {
  const componentTree: ComponentNode = {
    name: 'Root',
    children: [],
    filePath: 'root',
  };

  return {
    name: 'qwik-component-tree',
    transform(code: string, id: string) {
      if (id.endsWith('.tsx') || id.endsWith('.jsx')) {
        try {
          const ast = parse(code, {
            sourceType: 'module',
            plugins: ['jsx', 'typescript'],
          });

          const fileComponents: ComponentNode[] = [];

          visit(ast, {
            visitJSXElement(path: any) {
              const elementName = path.node.openingElement.name.name;

              // Only process custom components (uppercase)
              if (/^[A-Z]/.test(elementName)) {
                const component: ComponentNode = {
                  name: elementName,
                  children: [],
                  filePath: id,
                };

                // Process children
                path.node.children.forEach((child) => {
                  if (
                    child.type === 'JSXElement' &&
                    /^[A-Z]/.test(child.openingElement.name.name)
                  ) {
                    component.children.push({
                      name: child.openingElement.name.name,
                      children: [],
                      filePath: id,
                    });
                  }
                });

                fileComponents.push(component);
              }

              return false;
            },
          });

          // Update the main tree
          componentTree.children.push(...fileComponents);
        } catch (error) {
          console.error(`Error parsing ${id}:`, error);
        }
        return code;
      }
    },
    configureServer(server) {
      server.middlewares.use('/__qwik-component-tree', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(componentTree, null, 2));
      });
    },
  };
}
