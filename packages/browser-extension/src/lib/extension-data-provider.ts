import type { DataProvider } from '../../../ui/src/devtools/data-provider';
import type { PageDataSource } from '../../../ui/src/devtools/page-data-source';
import type { DevtoolsState } from '../../../ui/src/devtools/state';
import type {
  QwikPerfStoreRemembered,
  QwikPreloadStoreRemembered,
} from '@devtools/kit';

// -- Eval helpers --------------------------------------------------------

/** Evaluate a script in the inspected page and return the result. */
function evalInPage<T>(script: string, timeoutMs = 5000): Promise<T | null> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), timeoutMs);
    chrome.devtools.inspectedWindow.eval(script, (result, exceptionInfo) => {
      clearTimeout(timer);
      if (exceptionInfo) {
        console.debug('[Qwik DevTools] eval error:', exceptionInfo);
        resolve(null);
      } else {
        resolve(result as T);
      }
    });
  });
}

/**
 * Ensure the VNode bridge is installed on the page.
 * Uses dynamic import() in the page context where Vite resolves bare specifiers.
 * Since inspectedWindow.eval can't await, we fire-and-forget then poll.
 */
function ensureVNodeBridge(): Promise<boolean> {
  return evalInPage<boolean>(
    `!!(window.__QWIK_DEVTOOLS_HOOK__ && typeof window.__QWIK_DEVTOOLS_HOOK__.getVNodeTree === 'function')`,
  ).then((ready) => {
    if (ready) return true;

    // Fire-and-forget: kick off the async bridge setup via .then()
    evalInPage<string>(EVAL_INSTALL_BRIDGE);

    // Poll until bridge is ready (import() is async)
    return new Promise<boolean>((resolve) => {
      let attempts = 0;
      const check = () => {
        evalInPage<boolean>(
          `!!(window.__QWIK_DEVTOOLS_HOOK__ && typeof window.__QWIK_DEVTOOLS_HOOK__.getVNodeTree === 'function')`,
        ).then((ok) => {
          if (ok) { resolve(true); return; }
          if (++attempts >= 20) { resolve(false); return; }
          setTimeout(check, 250);
        });
      };
      setTimeout(check, 300);
    });
  });
}

/** Eval script that installs the VNode bridge via dynamic import(). */
const EVAL_INSTALL_BRIDGE = `(function() {
  var hook = window.__QWIK_DEVTOOLS_HOOK__;
  if (!hook) return 'no-hook';
  if (typeof hook.getVNodeTree === 'function') return 'already';
  // Find the exact URL Vite used to load Qwik core (reuses cached module, no duplicate)
  var qwikUrl = null;
  var entries = performance.getEntriesByType('resource');
  for (var i = 0; i < entries.length; i++) {
    var n = entries[i].name;
    if (n.indexOf('core.mjs') > -1 && n.indexOf('qwik') > -1 && n.indexOf('.dev/core') > -1) {
      qwikUrl = n; break;
    }
  }
  // Fallback to direct Vite node_modules path
  var importUrl = qwikUrl || '/node_modules/@qwik.dev/core/dist/core.mjs';
  import(importUrl).then(function(m) {
    var _getDomContainer = m._getDomContainer;
    var _vnode_getFirstChild = m._vnode_getFirstChild;
    var _vnode_isVirtualVNode = m._vnode_isVirtualVNode;
    var _vnode_isMaterialized = m._vnode_isMaterialized;
    var _vnode_getAttrKeys = m._vnode_getAttrKeys;
    var QRENDERFN = 'q:renderFn', QPROPS = 'q:props', QTYPE = 'q:type';
    var _idx = 0, _vnodeMap = {};
    function serializeProps(v,d){if(d>4)return'[depth]';if(v===null||v===undefined)return v;var t=typeof v;if(t==='string'||t==='number'||t==='boolean')return v;if(t==='function')return'[Function]';try{if(Array.isArray(v))return v.map(function(i){return serializeProps(i,d+1)});if(t==='object'){if('$chunk$'in v||'$symbol$'in v)return'[QRL]';if('$untrackedValue$'in v)return serializeProps(v.$untrackedValue$,d+1);var r={},ks=Object.keys(v);for(var i=0;i<ks.length;i++){var k=ks[i];if(k.startsWith('$')&&k.endsWith('$'))continue;try{r[k]=serializeProps(v[k],d+1)}catch(_){r[k]='[error]'}}return r}}catch(_){}return String(v)}
    function normalizeName(s){var p=s.split('_');var n=p[0]||'';return n.charAt(0).toUpperCase()+n.slice(1).toLowerCase()}
    function buildTree(c,vn){if(!vn)return[];var res=[];var cur=vn;while(cur){var isV=_vnode_isVirtualVNode(cur);var rF=isV?c.getHostProp(cur,QRENDERFN):null;var isCmp=isV&&typeof rF==='function';if(isCmp){var nm='Component',qId='',colId='';try{var ks=_vnode_getAttrKeys(c,cur);for(var i=0;i<ks.length;i++){if(ks[i]===QTYPE)continue;if(ks[i]==='q:id')qId=String(c.getHostProp(cur,'q:id')||'');if(ks[i]===':')colId=String(c.getHostProp(cur,':')||'')}if(rF.getSymbol)nm=normalizeName(rF.getSymbol());else if(rF.$symbol$)nm=normalizeName(rF.$symbol$)}catch(_){}var qC='';try{var ch=rF.$chunk$||'';var sp='_component';var ix=ch.indexOf(sp);qC=ix>0?ch.substring(0,ix):ch}catch(_){}var ch2=[];var fc=_vnode_getFirstChild(cur);if(fc)ch2=buildTree(c,fc);var np=qId?{'q:id':qId}:{};if(colId)np.__colonId=colId;if(qC)np.__qrlChunk=qC;var nId=qId?('q-'+qId):('vnode-'+(_idx++));_vnodeMap[nId]={vnode:cur,container:c};res.push({name:nm,id:nId,label:nm,props:np,children:ch2.length>0?ch2:undefined})}else if(_vnode_isMaterialized(cur)||(isV&&!isCmp)){var f=_vnode_getFirstChild(cur);if(f){var ns=buildTree(c,f);for(var j=0;j<ns.length;j++)res.push(ns[j])}}cur=cur.nextSibling||null}return res}
    function filterDT(ns){var r=[];for(var i=0;i<ns.length;i++){var n=ns[i];if(n.name==='Qwikdevtools'||n.name==='Devtoolscontainer')continue;if(n.children){n={name:n.name,id:n.id,label:n.label,props:n.props,children:filterDT(n.children)};if(n.children.length===0)delete n.children}r.push(n)}return r}
    function getTree(){try{_idx=0;_vnodeMap={};var c=_getDomContainer(document.documentElement);if(!c||!c.rootVNode)return null;return filterDT(buildTree(c,c.rootVNode))}catch(e){return null}}
    hook.getVNodeTree=getTree;
    hook.resolveElementToComponent=function(el){if(!el)return null;var cur=el;while(cur){var ins=cur.getAttribute?cur.getAttribute('data-qwik-inspector'):null;if(ins){var pts=ins.split('/');var fn=(pts[pts.length-1]||'').split(':')[0];var cn=fn.replace(/\\.(tsx|ts|jsx|js)$/,'');if(cn){for(var id in _vnodeMap){var en=_vnodeMap[id];try{var rf=en.container.getHostProp(en.vnode,QRENDERFN);if(typeof rf==='function'){var sy=rf.getSymbol?rf.getSymbol():(rf.$symbol$||'');if(normalizeName(sy).toLowerCase()===cn.toLowerCase())return id}}catch(_){}}}}cur=cur.parentElement}return null};
    function findEl(vn){if(!vn)return null;if(!_vnode_isVirtualVNode(vn)||vn.node)return vn.node||null;var c=_vnode_getFirstChild(vn);while(c){var e=findEl(c);if(e)return e;c=c.nextSibling||null}return null}
    hook.getElementRect=function(nId){var en=_vnodeMap[nId];if(!en)return null;try{var e=findEl(en.vnode);if(!e)return null;var r=e.getBoundingClientRect();return{top:r.top,left:r.left,width:r.width,height:r.height}}catch(_){return null}};
    hook.highlightNode=function(nId,nm){var en=_vnodeMap[nId];if(!en)return false;try{var e=findEl(en.vnode);if(!e)return false;var ov=document.getElementById('__qwik_dt_hover_ov');if(!ov){ov=document.createElement('div');ov.id='__qwik_dt_hover_ov';ov.style.cssText='position:fixed;pointer-events:none;border:2px solid #8b5cf6;background:rgba(139,92,246,0.08);z-index:2147483646;border-radius:4px;transition:all 0.15s ease';var lb=document.createElement('div');lb.id='__qwik_dt_hover_lbl';lb.style.cssText='position:absolute;top:-20px;left:-2px;background:#8b5cf6;color:#fff;font-size:10px;padding:1px 6px;border-radius:3px 3px 0 0;white-space:nowrap;font-family:system-ui,sans-serif';ov.appendChild(lb);document.body.appendChild(ov)}var r=e.getBoundingClientRect();ov.style.display='block';ov.style.top=r.top+'px';ov.style.left=r.left+'px';ov.style.width=r.width+'px';ov.style.height=r.height+'px';var lb2=document.getElementById('__qwik_dt_hover_lbl');if(lb2)lb2.textContent='<'+(nm||'Component')+' />';return true}catch(_){return false}};
    hook.unhighlightNode=function(){var ov=document.getElementById('__qwik_dt_hover_ov');if(ov)ov.style.display='none'};
    hook.getNodeProps=function(nId){var en=_vnodeMap[nId];if(!en)return null;try{var p=en.container.getHostProp(en.vnode,QPROPS);if(!p)return null;var r={},ks=Object.keys(p);for(var i=0;i<ks.length;i++){var k=ks[i];if(k.startsWith('on:')||k.startsWith('on$:'))continue;try{r[k]=serializeProps(p[k],0)}catch(_){r[k]='[error]'}}return r}catch(_){return null}};
    var dt=null;function pushTree(){var t=getTree();if(!t)return;window.postMessage({source:'qwik-devtools',type:'COMPONENT_TREE_UPDATE',tree:t},'*')}
    var obs=new MutationObserver(function(){if(dt)clearTimeout(dt);dt=setTimeout(pushTree,100)});
    obs.observe(document.documentElement,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['q:id','q:key',':']});
    pushTree();
    // Bridge render events to extension via postMessage
    if (typeof hook.onRender === 'function') {
      hook.onRender(function(evt) {
        window.postMessage({source:'qwik-devtools',type:'RENDER_EVENT',event:evt},'*');
      });
    }
  }).catch(function(e){console.debug('[Qwik DevTools] VNode bridge not available:', e.message)});
  return 'installing';
})()`;

/** Check whether a Qwik app is present (plugin, hook, or container). */
function isDevModeActive(): Promise<boolean> {
  return evalInPage<boolean>(
    `typeof window.QWIK_DEVTOOLS_GLOBAL_STATE !== 'undefined' ||
     typeof window.__QWIK_PERF__ !== 'undefined' ||
     typeof window.__QWIK_DEVTOOLS_HOOK__ !== 'undefined' ||
     !!document.querySelector('[q\\\\:container]')`,
  ).then((r) => r === true);
}

/** Check whether the devtools hook is installed. */
function isHookAvailable(): Promise<boolean> {
  return evalInPage<boolean>(
    `!!(window.__QWIK_DEVTOOLS_HOOK__)`,
  ).then((r) => r === true);
}

// -- Eval scripts --------------------------------------------------------
// Executed in the inspected page context via inspectedWindow.eval().
// Must use ES5 syntax (no arrow functions, no const/let).

/** Read component tree from the hook. */
const EVAL_READ_COMPONENTS = `(function() {
  var hook = window.__QWIK_DEVTOOLS_HOOK__;
  if (hook && typeof hook.getComponentTreeSnapshot === 'function') {
    return hook.getComponentTreeSnapshot();
  }
  return null;
})()`;

/** Read signal values snapshot from the hook. */
const EVAL_READ_SIGNALS = `(function() {
  var hook = window.__QWIK_DEVTOOLS_HOOK__;
  if (hook && typeof hook.getSignalsSnapshot === 'function') {
    return hook.getSignalsSnapshot();
  }
  return null;
})()`;

/** Read VNode component tree from the hook bridge. */
const EVAL_READ_VNODE_TREE = `(function() {
  var hook = window.__QWIK_DEVTOOLS_HOOK__;
  if (hook && typeof hook.getVNodeTree === 'function') {
    return hook.getVNodeTree();
  }
  return null;
})()`;

/** Read detailed hook data for a specific component. */
function evalComponentDetail(name: string, qrlChunk?: string): Promise<Array<{
  hookType: string;
  variableName: string;
  data: unknown;
}> | null> {
  const escapedName = name.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const escapedChunk = (qrlChunk || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  return evalInPage(`(function() {
  var hook = window.__QWIK_DEVTOOLS_HOOK__;
  if (hook && typeof hook.getComponentDetail === 'function') {
    return hook.getComponentDetail('${escapedName}', '${escapedChunk}');
  }
  return null;
})()`);
}

/** Detect Qwik packages from container attributes and runtime globals. */
const EVAL_READ_PACKAGES = `(function() {
  var el = document.querySelector('[q\\\\:container]');
  if (!el) return [];
  var pkgs = [];
  var version = el.getAttribute('q:version') || '';
  if (version) {
    pkgs.push(['@qwik.dev/core', version]);
    // Detect router: check for Qwik router provider in the component tree
    var hasRouter = !!document.querySelector('[data-qwik-inspector*="router"]')
      || !!(window.__QWIK_DEVTOOLS_HOOK__ && window.__QWIK_DEVTOOLS_HOOK__.getVNodeTree
        && JSON.stringify(window.__QWIK_DEVTOOLS_HOOK__.getVNodeTree() || []).indexOf('routerprovider') > -1);
    if (hasRouter) pkgs.push(['@qwik.dev/router', version]);
  }
  return pkgs;
})()`;

const EVAL_READ_PERF = `(function() {
  var p = window.__QWIK_PERF__;
  if (!p) return null;
  return { ssr: p.ssr || [], csr: p.csr || [] };
})()`;

const EVAL_READ_PRELOADS = `(function() {
  var s = window.__QWIK_PRELOADS__;
  if (!s) return null;
  return {
    entries: s.entries || [],
    qrlRequests: s.qrlRequests || [],
    startedAt: s.startedAt || 0,
    _id: s._id || 0,
    _initialized: !!s._initialized,
    _byHref: s._byHref || {},
    _byId: s._byId || {}
  };
})()`;

const EVAL_CLEAR_PRELOADS = `(function() {
  var s = window.__QWIK_PRELOADS__;
  if (s && typeof s.clear === 'function') s.clear();
  return true;
})()`;

// -- RemotePageDataSource ------------------------------------------------

const POLL_INTERVAL_MS = 2000;

/**
 * {@link PageDataSource} for the browser extension panel.
 *
 * Reads page globals via `chrome.devtools.inspectedWindow.eval()`.
 * Preload updates use polling since cross-document event listeners
 * are not possible.
 */
class RemotePageDataSource implements PageDataSource {
  readPerfData(): Promise<QwikPerfStoreRemembered | null> {
    return evalInPage(EVAL_READ_PERF);
  }

  readPreloadStore(): Promise<QwikPreloadStoreRemembered | null> {
    return evalInPage(EVAL_READ_PRELOADS);
  }

  async clearPreloadStore(): Promise<void> {
    await evalInPage(EVAL_CLEAR_PRELOADS);
  }

  subscribePreloadUpdates(cb: () => void): (() => void) | null {
    const id = setInterval(cb, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }

  readComponentTree(): Promise<Array<{
    path: string;
    name: string;
    signals: Array<{ name: string; hookType: string; value: unknown }>;
    hooks: Array<{ variableName: string; hookType: string; category: string }>;
  }> | null> {
    return evalInPage(EVAL_READ_COMPONENTS);
  }

  readSignals(): Promise<Record<
    string,
    Array<{ name: string; hookType: string; value: unknown }>
  > | null> {
    return evalInPage(EVAL_READ_SIGNALS);
  }

  readVNodeTree(): Promise<Array<{
    name?: string;
    id: string;
    label?: string;
    props?: Record<string, unknown>;
    children?: any[];
  }> | null> {
    return evalInPage(EVAL_READ_VNODE_TREE);
  }

  async readNodeProps(nodeId: string): Promise<Record<string, unknown> | null> {
    const escaped = nodeId.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    return evalInPage<Record<string, unknown>>(`(function() {
  var hook = window.__QWIK_DEVTOOLS_HOOK__;
  if (hook && typeof hook.getNodeProps === 'function') {
    return hook.getNodeProps('${escaped}');
  }
  return null;
})()`);
  }

  async setSignalValue(componentName: string, qrlChunk: string | undefined, variableName: string, newValue: unknown): Promise<boolean> {
    const escapedName = componentName.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const escapedChunk = (qrlChunk || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const escapedVar = variableName.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const serializedValue = JSON.stringify(newValue);
    return (await evalInPage<boolean>(`(function() {
  var hook = window.__QWIK_DEVTOOLS_HOOK__;
  if (hook && typeof hook.setSignalValue === 'function') {
    return hook.setSignalValue('${escapedName}', '${escapedChunk}', '${escapedVar}', ${serializedValue});
  }
  return false;
})()`)) ?? false;
  }

  async highlightElement(nodeId: string, componentName: string): Promise<void> {
    const eNodeId = nodeId.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const eName = componentName.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    await evalInPage(`(function() {
  var hook = window.__QWIK_DEVTOOLS_HOOK__;
  if (hook && typeof hook.highlightNode === 'function') {
    return hook.highlightNode('${eNodeId}', '${eName}');
  }
  return false;
})()`);
  }

  async unhighlightElement(): Promise<void> {
    await evalInPage(`(function() {
  var hook = window.__QWIK_DEVTOOLS_HOOK__;
  if (hook && typeof hook.unhighlightNode === 'function') {
    hook.unhighlightNode();
  }
})()`);
  }

  readComponentDetail(componentName: string, qrlChunk?: string): Promise<Array<{
    hookType: string;
    variableName: string;
    data: unknown;
  }> | null> {
    return evalComponentDetail(componentName, qrlChunk);
  }

  subscribeTreeUpdates(cb: (tree: Array<{
    name?: string;
    id: string;
    label?: string;
    props?: Record<string, unknown>;
    children?: any[];
  }>) => void): (() => void) | null {
    const port = (window as any).__devtools_port as chrome.runtime.Port | undefined;
    if (!port) return null;
    const handler = (msg: any) => {
      if (msg?.type === 'COMPONENT_TREE_UPDATE' && Array.isArray(msg.payload)) {
        cb(msg.payload);
      }
    };
    port.onMessage.addListener(handler);
    return () => port.onMessage.removeListener(handler);
  }

  subscribeRenderEvents(cb: (event: {
    component: string;
    phase: string;
    duration: number;
    timestamp: number;
  }) => void): (() => void) | null {
    const port = (window as any).__devtools_port as chrome.runtime.Port | undefined;
    if (!port) return null;
    const handler = (msg: any) => {
      if (msg?.type === 'RENDER_EVENT' && msg.payload) {
        cb(msg.payload);
      }
    };
    port.onMessage.addListener(handler);
    return () => port.onMessage.removeListener(handler);
  }
}

// -- Component snapshot type (matches hook's getComponentTreeSnapshot) ----

interface ComponentSnapshot {
  path: string;
  name: string;
  signals: Array<{ name: string; hookType: string; value: unknown }>;
  hooks: Array<{
    variableName: string;
    hookType: string;
    category: string;
  }>;
}

// -- DataProvider --------------------------------------------------------

/**
 * {@link DataProvider} for the browser extension.
 *
 * When `__QWIK_DEVTOOLS_HOOK__` is available, reads component tree and
 * signal data from it. Falls back to `QWIK_DEVTOOLS_GLOBAL_STATE` for
 * basic component listing.
 *
 * Performance and preload data is handled by {@link RemotePageDataSource}.
 *
 * Features requiring Vite server access (packages, dependencies, routes,
 * assets, build analysis, code inspection) are not available.
 */
export function createExtensionDataProvider(): DataProvider {
  return {
    async loadData(state: DevtoolsState) {
      if (!(await isDevModeActive())) return;

      const hookAvailable = await isHookAvailable();

      // Ensure VNode bridge is installed (injects via dynamic import if needed)
      const bridgeReady = await ensureVNodeBridge();

      // Detect Vite plugin overlay
      const hasVitePlugin = await evalInPage<boolean>(
        `typeof window.QWIK_DEVTOOLS_GLOBAL_STATE === 'object' && window.QWIK_DEVTOOLS_GLOBAL_STATE !== null`,
      );
      state.vitePluginDetected = hasVitePlugin === true;

      // Load packages from container attributes
      const pkgs = await evalInPage<Array<[string, string]>>(EVAL_READ_PACKAGES);
      if (pkgs && pkgs.length > 0) {
        state.npmPackages = pkgs;
      }

      if (hookAvailable) {
        const snapshots = await evalInPage<ComponentSnapshot[]>(
          EVAL_READ_COMPONENTS,
        );

        if (snapshots && snapshots.length > 0) {
          state.components = snapshots.map((c) => ({
            name: c.name,
            fileName: c.name,
            file: c.path,
          }));
        }
      }

      // Fallback: count components from VNode tree if snapshot was empty
      if (state.components.length === 0 && bridgeReady) {
        const tree = await evalInPage<Array<{ name?: string; children?: any[] }>>(EVAL_READ_VNODE_TREE);
        if (tree) {
          const names: string[] = [];
          const walk = (nodes: any[]) => {
            for (const n of nodes) {
              if (n.name) names.push(n.name);
              if (n.children) walk(n.children);
            }
          };
          walk(tree);
          state.components = names.map((name) => ({
            name,
            fileName: name,
            file: name,
          }));
        }
      }
    },
  };
}

/** Read signal values from the hook. Returns null if hook unavailable. */
export async function readSignalsSnapshot(): Promise<Record<
  string,
  Array<{ name: string; hookType: string; value: unknown }>
> | null> {
  return evalInPage(EVAL_READ_SIGNALS);
}

/** Create a {@link PageDataSource} backed by `inspectedWindow.eval()`. */
export function createRemotePageDataSource(): PageDataSource {
  return new RemotePageDataSource();
}
