## Qwik DevTools

![Qwik DevTools](https://raw.github.com/QwikDev/devtools/main/assets/screenshot.png)

Enhance your Qwik development experience with DevTools that provide real-time insights into your application's state, components, and performance.

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
import { qwikDevtools } from '@qwik.dev/devtools/vite';

export default defineConfig({
  plugins: [
    qwikCity(),
    qwikVite(),
    qwikDevtools(), // 👈 Add the plugin here
  ],
});
```

## Features

- 🔍 Component Explorer
- ⚡️ Real-time State Management
- 📊 Performance Metrics
- 🐞 Debug Tools

## Contribution Guide

Please refer to the [Contribution Guide](./CONTRIBUTING.md).

## Community

Join our vibrant community:

- 🐦 Follow [@QwikDev](https://twitter.com/QwikDev) on Twitter
- 💬 Join our [Discord](https://qwik.dev/chat) community
- 🌐 Check out [other community groups](https://qwik.dev/ecosystem/#community)

## Related Links

- [📚 Qwik Documentation](https://qwik.dev/)
- [💬 Discord Chat](https://qwik.dev/chat)
- [⭐️ Qwik GitHub](https://github.com/QwikDev/qwik)
- [🐦 @QwikDev](https://twitter.com/QwikDev)
- [⚡️ Vite](https://vitejs.dev/)

