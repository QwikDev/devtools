export const loadComponentGraph = () => {
  let node: Comment | null = null;
  const elements: { id: number; parentId: number | null; children?: any }[] =
    [];
  const parents: number[] = [];
  // Collect all virtual elements
  const elementWalker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_COMMENT
  );
  while ((node = elementWalker.nextNode() as Comment)) {
    const data = node.data;
    // if (container === 0) {
    if (data.startsWith('qv ')) {
      const id = getID(data); // TODO: remove
      if (id >= 0) {
        elements.push({ id, parentId: parents[parents.length - 1] || null });
        parents.push(id);
      }
    } else if (data.startsWith('/qv')) {
      parents.pop();
    }

    // else if (data.startsWith('t=')) {
    //   const id = data.slice(2);
    //   const index = strToInt(id);
    //   const textNode = getTextNode(node);
    //   elements.set(index, textNode);
    //   text.set(index, textNode.data);
    // }
    // }
    // if (data === 'cq') {
    //   container++;
    // } else if (data === '/cq') {
    //   container--;
    // }
  }

  const idMapping = elements.reduce((acc: Record<number, number>, el, i) => {
    acc[el.id] = i;
    return acc;
  }, {});

  const root: Record<number, any> = {};
  elements.forEach((el) => {
    // Handle the root element
    if (el.parentId === null) {
      root[el.id] = el;
      return;
    }
    // Use our mapping to locate the parent element in our data array
    const parentEl = elements[idMapping[el.parentId]];
    // Add our current el to its parent's `children` array
    parentEl.children = [...(parentEl.children || []), el];
  });
  console.log(root)
};

export const getID = (stuff: string) => {
  const index = stuff.indexOf('q:id=');
  if (index > 0) {
    return strToInt(stuff.slice(index + 5));
  }
  return -1;
};

export const strToInt = (nu: string) => {
  return parseInt(nu, 36);
};

const getTextNode = (mark: Comment) => {
  const nextNode = mark.nextSibling!;
  if (isText(nextNode)) {
    return nextNode;
  } else {
    const textNode = mark.ownerDocument.createTextNode('');
    mark.parentElement!.insertBefore(textNode, mark);
    return textNode;
  }
};

export const isText = (value: Node): value is Text => {
  return value.nodeType === 3;
};
