---
name: qwik
description: Workflow and pitfall checklist for Qwik core development (packages/qwik). Use when the user mentions Qwik, packages/qwik, Signal/AsyncSignalImpl, reactive-primitives, serialization/hydration (serialize/inflate), or cursor queue; it enforces running unit tests immediately after any implementation change, following signal/async-signal patterns, and running build/E2E/API validations before finishing.
---

# Qwik Core Development Guide (Skill)

## Scope
- Only for the Qwik core package: `packages/qwik` (especially `src/core/**`, `reactive-primitives/**`).

## Mandatory workflow (must do)
### 0. Run tests immediately after any implementation change
- After changing any implementation file, **immediately** run the relevant unit tests (don’t wait for CI, don’t wait to be asked):

```bash
pnpm vitest run <test-file-path>
```

- Typical example (signals):

```bash
pnpm vitest run packages/qwik/src/core/reactive-primitives/impl/signal.unit.tsx
```

- If tests fail, fix and re-run until they pass. Only then proceed with anything else (docs/refactors/cleanup).

## Implementation essentials (high-signal rules)
- **Constructor parameter plumbing**: when adding params to signal/async-signal constructors, keep parent calls and parameter order stable; extract options in factories (e.g. `signal-api.ts`) before passing into constructors.
- **AsyncSignal promise branches**: `.then()` and `.catch()` must be symmetric (same side-effects / scheduling). Errors should not “stop” polling.
- **invalidate cleanup order**: clear timeouts/resources first, then clear cached data and call `super.invalidate()` to avoid leaks and test interference.
- **SSR vs browser**: guard browser APIs (`setTimeout`, etc.) with `isBrowser`; still persist configuration on the instance for hydration.
- **Subscriber checks**: async signals may have separate subscribers for `.value`, `.loading`, and `.error`; any “has subscribers” logic must consider all three sets.
- **Serialization/hydration alignment**: when adding new serializable fields, array positions in `serialize.ts` and `inflate.ts` must match exactly.

## Testing conventions (high-signal rules)
- Prefer `$()` for QRLs; avoid manually constructing QRLs (e.g. `inlinedQrl()`).
- In `$()` tests that need mutable state, use object refs (e.g. `{ count: 0 }`). Don’t capture and mutate outer-scope primitives (can trigger “Assignment to constant variable”).
- First computation may “throw a promise” to trigger suspense behavior; in tests, use helpers like `retryOnPromise()` / `withContainer()` around first reads/creation.

## Required validations before finishing
When the task is complete / ready to ship (especially core changes), run as appropriate:

```bash
pnpm build --qwik --qwikrouter --dev
pnpm run test.e2e.chromium
pnpm api.update
```

## Detailed reference
- For deeper patterns, examples, pitfall tables, and full checklists, read `[AGENTS.md](AGENTS.md)` in the same folder.

