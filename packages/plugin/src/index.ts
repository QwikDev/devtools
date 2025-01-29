// @ts-nocheck
import { ResolvedConfig, type Plugin } from 'vite';
import { getServerFunctions } from './rpc';
import { createServerRpc, setViteServerContext } from '@devtools/kit';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
import _generate from '@babel/generator';
import * as t from '@babel/types';

// @ts-expect-error any
const traverse = _traverse.default;
// @ts-expect-error any
const generate = _generate.default;

export function qwikDevtools(): Plugin {
  let _config: ResolvedConfig;
  return {
    name: 'vite-plugin-qwik-devtools',
    apply: 'serve',
    configResolved(viteConfig) {
      _config = viteConfig;
    },
    transform: {
      order: 'pre',
      handler(code, id) {
        const mode = process.env.MODE;
        // Only transform the root component file
        if (id.endsWith('root.tsx')) {
          const importPath =
            mode === 'dev' ? '@devtools/ui' : '@qwik.dev/devtools/ui';
          // Check if QwikDevtools import already exists
          if (!code.includes(importPath)) {
            // Add import for QwikDevtools using the correct package name
            code = `import { QwikDevtools } from '${importPath}';\n${code}`;
          }

          // Find the closing body tag and inject the QwikDevtools component before it
          const match = code.match(/<body[^>]*>([\s\S]*?)<\/body>/);
          if (match) {
            const bodyContent = match[1];
            const newBodyContent = bodyContent.replace(
              /{!isDev && <ServiceWorkerRegister \/>}/,
              `{!isDev && <ServiceWorkerRegister />}\n        {isDev && <QwikDevtools />}`,
            );
            code = code.replace(bodyContent, newBodyContent);
          }

          return {
            code,
            map: null,
          };
        }

        return test(code, id);
      },
    },
    configureServer(server) {
      setViteServerContext(server);

      const rpcFunctions = getServerFunctions({ server, config: _config });

      createServerRpc(rpcFunctions);
    },
  };
}

function test(code: string, id: string) {
  if (!id.endsWith('.tsx') || !code.includes('component$')) return;
  if (id.includes('router-head') || id.endsWith('layout.tsx')) return;

  const ast = parse(code, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx'],
  });

  const signalsAndStores: { name: string; type: 'signal' | 'store' }[] = [];
  let lastDeclarationPath = null;
  const componentPath = id.split('/src/')[1] || id;
  const childComponents: Array<{ name: string; path: string }> = [];

  // Track import paths
  const importPaths: Record<string, string> = {};
  traverse(ast, {
    // @ts-expect-error any
    ImportDeclaration(path) {
      const source = path.node.source.value;
      path.node.specifiers.forEach((specifier) => {
        if (
          t.isImportDefaultSpecifier(specifier) ||
          t.isImportSpecifier(specifier)
        ) {
          const name = specifier.local.name;
          if (/^[A-Z]/.test(name)) {
            // Only track components (uppercase)
            importPaths[name] = source;
          }
        }
      });
    },
  });

  // Find child components with paths
  traverse(ast, {
    // @ts-expect-error any
    JSXElement(path) {
      const openingElement = path.node.openingElement;
      const elementName = openingElement.name;

      if (t.isJSXIdentifier(elementName)) {
        if (/^[A-Z]/.test(elementName.name)) {
          const componentName = elementName.name;
          const importPath = importPaths[componentName];
          childComponents.push({
            name: componentName,
            path: importPath || 'built-in', // built-in for components like Link
          });
        }
      }
    },
  });

  traverse(ast, {
    // @ts-expect-error any
    VariableDeclarator(path) {
      const init = path.node.init;
      if (t.isCallExpression(init)) {
        const callee = init.callee;
        if (t.isIdentifier(callee)) {
          if (callee.name === 'useSignal' || callee.name === 'useStore') {
            signalsAndStores.push({
              name: (path.node.id as t.Identifier).name,
              type: callee.name === 'useSignal' ? 'signal' : 'store',
            });
            lastDeclarationPath = path.parentPath;
          }
        }
      }
    },
  });

  // Always add imports and tracking code
  traverse(ast, {
    // @ts-expect-error any
    Program(path) {
      const imports = [
        t.importSpecifier(
          t.identifier('useOnDocument'),
          t.identifier('useOnDocument'),
        ),
        t.importSpecifier(t.identifier('$'), t.identifier('$')),
      ];

      let qwikImport = path.node.body.find(
        // @ts-expect-error any
        (node) =>
          t.isImportDeclaration(node) && node.source.value === '@qwik.dev/core',
      ) as t.ImportDeclaration;

      if (qwikImport) {
        qwikImport.specifiers.push(...imports);
      } else {
        qwikImport = t.importDeclaration(
          imports,
          t.stringLiteral('@qwik.dev/core'),
        );
        path.node.body.unshift(qwikImport);
      }
    },
  });

  const trackingCode = t.expressionStatement(
    t.callExpression(t.identifier('useOnDocument'), [
      t.stringLiteral('qinit'),
      t.callExpression(t.identifier('$'), [
        t.arrowFunctionExpression(
          [],
          t.blockStatement([
            // Initialize __QWIK_DEVTOOLS__ if it doesn't exist
            t.ifStatement(
              t.unaryExpression(
                '!',
                t.memberExpression(
                  t.identifier('window'),
                  t.identifier('__QWIK_DEVTOOLS__'),
                ),
              ),
              t.blockStatement([
                t.expressionStatement(
                  t.assignmentExpression(
                    '=',
                    t.memberExpression(
                      t.identifier('window'),
                      t.identifier('__QWIK_DEVTOOLS__'),
                    ),
                    t.objectExpression([
                      t.objectProperty(
                        t.identifier('appState'),
                        t.objectExpression([]),
                      ),
                    ]),
                  ),
                ),
              ]),
            ),
            // Set component state with children
            t.expressionStatement(
              t.assignmentExpression(
                '=',
                t.memberExpression(
                  t.memberExpression(
                    t.memberExpression(
                      t.identifier('window'),
                      t.identifier('__QWIK_DEVTOOLS__'),
                    ),
                    t.identifier('appState'),
                  ),
                  t.stringLiteral(componentPath),
                  true,
                ),
                t.objectExpression([
                  t.objectProperty(
                    t.identifier('path'),
                    t.stringLiteral(componentPath),
                  ),
                  t.objectProperty(
                    t.identifier('children'),
                    t.objectExpression(
                      childComponents.map(({ name, path }) =>
                        t.objectProperty(
                          t.identifier(name),
                          t.stringLiteral(path),
                        ),
                      ),
                    ),
                  ),
                  t.objectProperty(
                    t.identifier('state'),
                    t.objectExpression(
                      signalsAndStores.map(({ name, type }) =>
                        t.objectProperty(
                          t.identifier(name),
                          t.objectExpression([
                            t.objectProperty(
                              t.identifier('value'),
                              t.identifier(name),
                            ),
                            t.objectProperty(
                              t.identifier('type'),
                              t.stringLiteral(type),
                            ),
                          ]),
                        ),
                      ),
                    ),
                  ),
                ]),
              ),
            ),
          ]),
        ),
      ]),
    ]),
  );

  // Insert tracking code after the last declaration or at the start of the component if no declarations
  if (lastDeclarationPath) {
    lastDeclarationPath.insertAfter(trackingCode);
  } else {
    // Find the component function and insert at the start of its body
    traverse(ast, {
      // @ts-expect-error any
      CallExpression(path) {
        if (
          t.isIdentifier(path.node.callee) &&
          path.node.callee.name === 'component$'
        ) {
          const arrowFunction = path.node.arguments[0];
          if (t.isArrowFunctionExpression(arrowFunction)) {
            const body = arrowFunction.body;
            if (t.isBlockStatement(body)) {
              body.body.unshift(trackingCode);
            }
          }
        }
      },
    });
  }

  const output = generate(ast);

  console.log(output.code);
  return {
    code: output.code,
    map: output.map,
  };
}
