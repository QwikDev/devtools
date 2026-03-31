---
'@qwik.dev/devtools': patch
---

feat: add preload/build analysis tooling and richer devtools instrumentation

- Added new `Preloads` and `Build Analysis` panels, plus an improved `Inspect` view that resolves correctly from the app base URL on deep routes.
- Added runtime instrumentation for SSR/CSR performance and preload tracking, including SSR preload snapshots, QRL-to-resource correlation, and richer diagnostics surfaced in DevTools.
- Expanded the plugin and RPC layer to generate and serve build-analysis reports, expose the new preload/performance data to the UI, and add server-side guards around build-analysis execution.
