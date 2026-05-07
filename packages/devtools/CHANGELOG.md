# @qwik.dev/devtools

## 0.3.0

### Minor Changes

- a748bb5: feat: add browser extension for Chrome and Firefox

  New browser extension package that brings Qwik DevTools to the browser's DevTools panel. Features real-time component tree, state inspection, element picker, hover highlight, live render events, and SPA navigation support. Works standalone or alongside the Vite plugin overlay.

### Patch Changes

- ade318a: feat: add preload/build analysis tooling and richer devtools instrumentation

  - Added new `Preloads` and `Build Analysis` panels, plus an improved `Inspect` view that resolves correctly from the app base URL on deep routes.
  - Added runtime instrumentation for SSR/CSR performance and preload tracking, including SSR preload snapshots, QRL-to-resource correlation, and richer diagnostics surfaced in DevTools.
  - Expanded the plugin and RPC layer to generate and serve build-analysis reports, expose the new preload/performance data to the UI, and add server-side guards around build-analysis execution.

## 0.2.8

### Patch Changes

- a337ab5: refactor: Update iframe theme styles and improve Inspect iframe source handling

## 0.2.7

### Patch Changes

- 73144dc: refactor: Improve UI aesthetics with updated tab and card styles, and refactor RenderTree data formatting for hooks.

## 0.2.6

### Patch Changes

- ed594a2: feat: add ESLint configuration and update dependencies

## 0.2.5

### Patch Changes

- ea23e81: fix: run everyplugins only in development environment

## 0.2.4

### Patch Changes

- b42ee41: style: update color palette in global.css and enhance author handling

## 0.2.3

### Patch Changes

- 9265c38: fix(plugin): preserve Qwik lazy render metadata when wrapping components

## 0.2.2

### Patch Changes

- 64805a3: CHORE: add debug log and format
- 394278e: feat: add performance tab

## 0.2.1

### Patch Changes

- 0dc1be6: fix: update type definitions and improve theme script import in devtools
- 321b929: chore: update package versions and add CodeBreack feature
- 4f78e51: chore: update Tailwind CSS packages and improve theme toggle functionality in UI

## 0.2.0

### Minor Changes

- 99a81b1: FEAT: new UI and features

## 0.1.1

### Patch Changes

- Auto import fix

## 0.1.0

### Minor Changes

- c7710aa: Adds the npm package installation feature and Tailwind

### Patch Changes

- c7710aa: Changeset is added to the project

## 0.0.6

### Patch Changes

- Changeset is added to the project
