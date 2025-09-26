const useCollectHooks = `import { $, useSignal, useVisibleTask$ } from "@qwik.dev/core"
export const useCollectHooks = (src) => {
  const hooksList = useSignal(new Set())
  useVisibleTask$(({ track }) => {
    const newdata  = track(() => hooksList.value);
    if(!window.QWIK_DEVTOOLS_GLOBAL_STATE) {
      window.QWIK_DEVTOOLS_GLOBAL_STATE = {}
      window.QWIK_DEVTOOLS_GLOBAL_STATE[src] = [...newdata]
    }else {
      window.QWIK_DEVTOOLS_GLOBAL_STATE[src] = [...newdata]
    }
  }, { strategy: 'document-ready'})
  return $((args) => {
    if(hooksList.value.has(args)) {
      return
    }
    hooksList.value.add(args)
  })
}
`

export default useCollectHooks