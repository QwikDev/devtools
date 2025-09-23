const useCollectHooks = `import { $, useSignal, useVisibleTask$ } from "@qwik.dev/core"
export const useCollectHooks = (src) => {
  const hooksList = useSignal([])
  useVisibleTask$(({ track }) => {
    const newdata  = track(() => hooksList.value);
    if(!window.QWIK_DEVTOOLS_GLOBAL_STATE) {
      window.QWIK_DEVTOOLS_GLOBAL_STATE = {}
      window.QWIK_DEVTOOLS_GLOBAL_STATE[src] = newdata || []
    }else {
      window.QWIK_DEVTOOLS_GLOBAL_STATE[src] = newdata
    }
  })
  return $((args) => {
    hooksList.value.push(args)
  })
}
`

export default useCollectHooks