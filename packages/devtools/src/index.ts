import { ResolvedConfig, type Plugin } from 'vite';
import { getServerFunctions } from './rpc';
import { createServerRpc, setViteServerContext } from '@qwik/devtools-kit';
import { ComponentNode } from './components';
import { parse } from '@babel/parser';
import { visit, namedTypes as n } from 'ast-types';
import fs from 'node:fs';

function QwikDevtools(): Plugin {
  const componentTree: ComponentNode = {
    name: 'Root',
    children: [],
    filePath: 'root',
  };
  const processedFiles = new Set<string>();

  let _config: ResolvedConfig;
  return {
    name: 'qwik-devtools',
    apply: 'serve',
    configResolved(viteConfig) {
      _config = viteConfig;
    },
    transform(code: string, id: string) {
      if (id.endsWith('.tsx') || id.endsWith('.jsx')) {
        analyzeFile(id);
        function analyzeFile(filePath: string) {
          if (processedFiles.has(filePath)) {
            return;
          }

          try {
            const code = fs.readFileSync(filePath, 'utf-8');
            const ast = parse(code, {
              sourceType: 'module',
              plugins: ['jsx', 'typescript'],
            });

            const fileComponents: ComponentNode[] = [];

            visit(ast, {
              visitJSXElement(path: any) {
                const elementName = path.node.openingElement.name;
                console.log(elementName);

                if (
                  n.JSXIdentifier.check(elementName) &&
                  /^[A-Z]/.test(elementName.name)
                ) {
                  const component: ComponentNode = {
                    name: elementName.name,
                    children: [],
                    filePath: filePath,
                  };

                  path.node.children.forEach((child: any) => {
                    if (
                      n.JSXElement.check(child) &&
                      n.JSXIdentifier.check(child.openingElement.name) &&
                      /^[A-Z]/.test(child.openingElement.name.name)
                    ) {
                      component.children.push({
                        name: child.openingElement.name.name,
                        children: [],
                        filePath: filePath,
                      });
                    }
                  });

                  fileComponents.push(component);
                }

                return false;
              },
            });

            componentTree.children.push(...fileComponents);
            processedFiles.add(filePath);
          } catch (error) {
            console.error(`Error analyzing ${filePath}:`, error);
          }
        }
      }
    },
    configureServer(server) {
      setViteServerContext(server);

      const rpcFunctions = getServerFunctions({ server, config: _config });

      createServerRpc(rpcFunctions);
    },
  };
}

export default QwikDevtools;
