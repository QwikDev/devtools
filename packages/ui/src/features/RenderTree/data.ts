import { CHUNK_KEY, COMPUTED_QRL_KEY, INNER_USE_HOOK, ParsedStructure, QRL_KEY } from "@devtools/kit";

// const findInnerHook = (allSeq:Record<any,any>[]) => {
//   return allSeq.filter(isInnerHook)

// }

const isInnerHook = (seq:Record<any,any>) => {
  return (seq[QRL_KEY] || seq[COMPUTED_QRL_KEY])?.[CHUNK_KEY].includes(INNER_USE_HOOK)
}


const IsCustomHook = (seq:Record<any,any>, name:string) => {
   return (seq[QRL_KEY] || seq[COMPUTED_QRL_KEY])?.[CHUNK_KEY].includes(name)
}