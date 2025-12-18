import perfRuntime from './perfRuntime';

/**
 * Preamble injected into Qwik-generated lazy render function modules (`_component_...`).
 *
 * It defines `__qwik_wrap__` that wraps each exported render function and records perf entries.
 */
const perfLazyWrapperPreamble = `${perfRuntime}

// [qwik-component-proxy] Render function wrapper
const __qwik_wrap__ = (fn, name, viteId) => {
  let renderCount = 0;
  return function (...args) {
    renderCount += 1;
    const phase = __qwik_perf_is_server__() ? 'ssr' : 'csr';
    const start = performance.now();

    try {
      const result = fn.apply(this, args);
      const duration = performance.now() - start;
      __qwik_perf_commit__({
        component: name,
        phase,
        duration,
        start,
        end: start + duration,
        viteId,
        renderCount,
      });
      return result;
    } catch (err) {
      const duration = performance.now() - start;
      __qwik_perf_commit__({
        component: name,
        phase,
        duration,
        start,
        end: start + duration,
        error: __qwik_perf_to_error__(err),
        viteId,
        renderCount,
      });
      throw err;
    }
  };
};
`;

export default perfLazyWrapperPreamble;


