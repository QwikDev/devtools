## Qwik DevTools

![Qwik DevTools](https://raw.github.com/QwikDev/devtools/main/assets/screenshot.png)

## Installation

> Qwik DevTools requires **Qwik v2.0.0-alpha.4 or higher**.

```bash copy
npm install @qwik.dev/devtools
```

```bash copy
pnpm add @qwik.dev/devtools
```

```bash copy
yarn add @qwik.dev/devtools
```

## Setup

Add the plugin to your `vite.config.ts`:

```ts copy
import { qwikDevtools } from '@qwik.dev/devtools';

export default defineConfig({
  plugins: [
    qwikRouter(),
    qwikVite(),
    tsconfigPaths(),
    qwikDevtools(), // 👈 Add the plugin here
  ],
});
```

## Contribution Guide

Please refer to the [Contribution Guide](./CONTRIBUTING.md).

## Community

- Ping us at [@QwikDev](https://twitter.com/QwikDev)
- Join our [Discord](https://qwik.dev/chat) community
- Join all the [other community groups](https://qwik.dev/ecosystem/#community)

## Related

- [Qwik Docs](https://qwik.dev/)
- [Discord](https://qwik.dev/chat)
- [Qwik GitHub](https://github.com/QwikDev/qwik)
- [@QwikDev](https://twitter.com/QwikDev)
- [Vite](https://vitejs.dev/)

