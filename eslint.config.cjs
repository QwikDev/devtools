const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const qwikPlugin = require('eslint-plugin-qwik');

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  {
    ignores: [
      '**/dist/**',
      '**/lib/**',
      '**/lib-types/**',
      '**/.cache/**',
      '**/.rollup.cache/**',
      '**/node_modules/**',
    ],
  },
  {
    files: ['**/*.{ts,tsx,js,jsx,mts,cts,cjs,mjs}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      qwik: qwikPlugin,
    },
    rules: {
      // Keep the intent of the legacy configs with minimal friction.
      'no-console': 'off',
      'no-case-declarations': 'off',

      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],

      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
];

