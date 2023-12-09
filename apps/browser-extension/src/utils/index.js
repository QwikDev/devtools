const qwikJsonDebug = (qwikJson, derivedFns) => {
  class Base {
    constructor(__id, __backRefs = []) {
      this.__id = __id;
      this.__backRefs = __backRefs;
    }
  }
  class number_ extends Base {
    constructor(__id, __value) {
      super(__id);
      this.__id = __id;
      this.__value = __value;
    }
  }
  class boolean_ extends Base {
    constructor(__id, __value) {
      super(__id);
      this.__id = __id;
      this.__value = __value;
    }
  }
  class string_ extends Base {
    constructor(__id, __value) {
      super(__id);
      this.__id = __id;
      this.__value = __value;
    }
  }
  class undefined_ extends Base {
    constructor(__id) {
      super(__id);
      this.__id = __id;
    }
  }
  class Object_ extends Base {
    constructor(__id) {
      super(__id);
      this.__id = __id;
    }
  }
  class Array_ extends Array {
    constructor(__id) {
      super();
      this.__backRefs = [];
      this.__id = __id;
    }
  }
  class Task2 extends Base {
    constructor(__id, flags, index2, obj) {
      super(__id);
      this.__id = __id;
      this.flags = flags;
      this.index = index2;
      this.obj = obj;
    }
  }
  class Listener {
    constructor(event, qrl) {
      this.event = event;
      this.qrl = qrl;
    }
  }
  class QContext {
    constructor() {
      this.element = null;
      this.props = null;
      this.componentQrl = null;
      this.listeners = [];
      this.seq = [];
      this.tasks = null;
      this.contexts = null;
      this.scopeIds = null;
    }
  }
  class QRefs {
    constructor(element, refMap, listeners) {
      this.element = element;
      this.refMap = refMap;
      this.listeners = listeners;
    }
  }
  class Component extends Base {
    constructor(__id, qrl) {
      super(__id);
      this.__id = __id;
      this.qrl = qrl;
    }
  }
  class SignalWrapper2 extends Base {
    constructor(__id, id2, prop) {
      super(__id);
      this.__id = __id;
      this.id = id2;
      this.prop = prop;
    }
  }
  class DerivedSignal extends Base {
    constructor(__id, fn, args) {
      super(__id);
      this.__id = __id;
      this.fn = (fn || '').toString();
      this.args = args;
    }
  }
  class QRL extends Base {
    constructor(__id, chunk, symbol, capture) {
      super(__id);
      this.__id = __id;
      this.chunk = chunk;
      this.symbol = symbol;
      this.capture = capture;
    }
  }
  const nodeMap = getNodeMap();
  const refs = {};
  const contexts = {};
  const objs = [];
  const subs = [];
  qwikJson.objs.forEach((_2, idx) => getObject(idx, null));
  Object.keys(qwikJson.ctx).forEach((idx) => getContext2(idx));
  Object.keys(qwikJson.refs).forEach((idx) => getRef(idx));
  qwikJson.subs;
  return {
    refs,
    ctx: contexts,
    objs,
    subs,
  };
  function getContext2(idx) {
    const rawCtx = qwikJson.ctx[idx];
    const ctx = (contexts[idx] = new QContext());
    const node2 = (ctx.element = nodeMap.get(idx) || null);
    if (isElement2(node2)) {
      const rawRefs = qwikJson.refs[idx];
      const refMap = splitParse(rawRefs, ' ', (id2) => getObject(id2, node2));
      ctx.listeners = getDomListeners2(refMap, node2);
    } else if (isComment2(node2)) {
      const attrs = /* @__PURE__ */ new Map();
      node2.textContent.split(' ').forEach((keyValue) => {
        const [key, value] = keyValue.split('=');
        attrs.set(key, value);
      });
      const sstyle = attrs.get('q:sstyle');
      if (sstyle) ctx.scopeIds = sstyle.split('|');
    }
    if (rawCtx.h) {
      const [qrl, props] = rawCtx.h
        .split(' ')
        .map((h2) => (h2 ? getObject(h2, ctx) : null));
      ctx.componentQrl = qrl;
      ctx.props = props;
    }
    if (rawCtx.c) {
      const contexts2 = (ctx.contexts = /* @__PURE__ */ new Map());
      for (const part of rawCtx.c.split(' ')) {
        const [key, value] = part.split('=');
        contexts2.set(key, getObject(value, ctx));
      }
    }
    if (rawCtx.s)
      ctx.seq = rawCtx.s
        .split(' ')
        .map((s2) => getObject(parseNumber(s2), ctx));
    if (rawCtx.w)
      ctx.tasks = rawCtx.w
        .split(' ')
        .map((s2) => getObject(parseNumber(s2), ctx));
  }
  function getRef(idx) {
    const rawRefs = qwikJson.refs[idx];
    const node2 = nodeMap.get(idx) || null;
    if (isElement2(node2)) {
      const refMap = splitParse(rawRefs, ' ', (id2) => getObject(id2, node2));
      const listeners = getDomListeners2(refMap, node2);
      refs[idx] = new QRefs(node2, refMap, listeners);
    }
  }
  function getObject(idx, parent) {
    if (typeof idx == 'string') {
      if (idx.startsWith('#')) {
        const node2 = nodeMap.get(idx.substring(1));
        if (!node2.__backRefs) node2.__backRefs = [];
        if (node2.__backRefs.indexOf(parent) === -1)
          node2.__backRefs.push(parent);
        return node2;
      }
      const num = parseNumber(idx);
      if (isNaN(num)) throw new Error('Invalid index: ' + idx);
      idx = num;
    }
    while (objs.length < idx) objs.push(null);
    let obj = objs[idx];
    if (!obj) {
      const rawValue = qwikJson.objs[idx];
      let value = rawValue;
      if (typeof value === 'number') obj = new number_(idx, value);
      else if (typeof value === 'boolean') obj = new boolean_(idx, value);
      else if (typeof value === 'undefined') obj = new undefined_(idx);
      else if (typeof value === 'object') {
        obj = Array.isArray(value) ? new Array_(idx) : new Object_(idx);
        for (const key in value)
          if (Object.prototype.hasOwnProperty.call(value, key))
            obj[key] = getObject(parseNumber(value[key]), obj);
      } else if (typeof rawValue === 'string') {
        const data2 = rawValue.substring(1);
        switch (rawValue.charCodeAt(0)) {
          case 1:
            value = new undefined_(idx);
            break;
          case 2:
            const [chunk, symbol, ...capture] = data2.split(/[#[\]\s]/);
            obj = new QRL(
              idx,
              chunk,
              symbol,
              capture.map((id22) => getObject(parseNumber(id22), parent))
            );
            break;
          case 3:
            const [flags, index2, objId] = data2.split(' ');
            const flagString = [
              parseNumber(flags) & 1 ? 'Visible' : '',
              parseNumber(flags) & 2 ? 'Task' : '',
              parseNumber(flags) & 4 ? 'Resource' : '',
              parseNumber(flags) & 8 ? 'Computed' : '',
              parseNumber(flags) & 16 ? 'Dirty' : '',
              parseNumber(flags) & 32 ? 'Cleanup' : '',
            ]
              .filter(Boolean)
              .join('|');
            obj = new Task2(
              idx,
              flagString,
              parseNumber(index2),
              getObject(objId, parent)
            );
            break;
          case 18:
            obj = getObject(data2, parent);
            break;
          case 17:
            const fnParts = data2.split(' ');
            const fn = derivedFns[parseNumber(fnParts.pop().substring(1))];
            obj = new DerivedSignal(
              idx,
              fn,
              fnParts.map((id22) => getObject(id22, parent))
            );
            break;
          case 5:
            obj = new URL(data2);
            obj.__id = idx;
            obj.__backRefs = [];
            break;
          case 16:
            obj = new Component(idx, data2);
            break;
          case 19:
            const [id2, prop] = data2.split(' ');
            obj = new SignalWrapper2(idx, id2, prop);
            break;
          case 4:
          case 6:
          case 22:
          case 7:
          case 14:
          case 21:
          case 20:
          case 23:
          case 24:
          case 25:
          case 26:
          case 15:
            throw new Error(
              'Not Implemented: ' +
              rawValue.charCodeAt(0).toString(16) +
              ' ' +
              JSON.stringify(rawValue)
            );
          default:
            obj = new string_(idx, rawValue);
        }
      } else throw new Error('Unexpected type: ' + JSON.stringify(rawValue));
      objs[idx] = obj;
    }
    if (parent && obj && obj.__backRefs.indexOf(parent) === -1)
      obj.__backRefs.push(parent);
    return obj;
  }
  function getNodeMap() {
    const map = /* @__PURE__ */ new Map();
    const walker = document.createTreeWalker(
      document.firstElementChild,
      NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_ELEMENT
    );
    for (
      let node2 = walker.firstChild();
      node2 !== null;
      node2 = walker.nextNode()
    ) {
      const id2 = getId(node2);
      id2 && map.set(id2, node2);
    }
    return map;
  }
  function getId(node2) {
    if (isElement2(node2)) return node2.getAttribute('q:id');
    else if (isComment2(node2)) {
      const text = node2.nodeValue || '';
      if (text.startsWith('t=')) return text.substring(2);
      else if (text.startsWith('qv ')) {
        const parts = text.split(' ');
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          if (part.startsWith('q:id=')) return part.substring(5);
        }
      }
      return null;
    } else throw new Error('Unexpected node type: ' + node2.nodeType);
  }
  function isElement2(node2) {
    return (
      node2 && typeof node2 == 'object' && node2.nodeType === Node.ELEMENT_NODE
    );
  }
  function isComment2(node2) {
    return (
      node2 && typeof node2 == 'object' && node2.nodeType === Node.COMMENT_NODE
    );
  }
  function splitParse(text, sep, fn) {
    if (!text) return [];
    return text.split(sep).map(fn);
  }
  function getDomListeners2(refMap, containerEl) {
    const attributes = containerEl.attributes;
    const listeners = [];
    for (let i = 0; i < attributes.length; i++) {
      const { name: name2, value } = attributes.item(i);
      if (
        name2.startsWith('on:') ||
        name2.startsWith('on-window:') ||
        name2.startsWith('on-document:')
      ) {
        const urls = value.split('\n');
        for (const url of urls) {
          const [chunk, symbol, capture] = url.split(/[#[\]]/);
          const qrl = new QRL(
            -1,
            chunk,
            symbol,
            (capture || '').split(' ').map((id2) => refMap[parseInt(id2, 10)])
          );
          listeners.push(new Listener(name2, qrl));
        }
      }
    }
    return listeners;
  }
  function parseNumber(value) {
    return parseInt(value, 36);
  }
}

export const runQwikJsonDebug = () => {
  const parseQwikJSON = () => {
    var _a2;
    const el = document.querySelector('script[type="qwik/json"]');
    const rawData = JSON.parse(el.textContent);
    const derivedFns =
      ((_a2 = document.querySelector('script[q\\:func="qwik/json"]')) == null
        ? void 0
        : _a2.qFuncs) || [];
    return qwikJsonDebug(rawData, derivedFns);
  };
  return parseQwikJSON();
}
