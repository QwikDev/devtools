import { runQwikJsonDebug } from ".";
import { Component } from "../app";

export const getComponents = () => {
	const qwikJson: any = runQwikJsonDebug();
	let node: Comment | null = null;
	const elements: Component[] = [];
	const parents: Node[] = [];
	const elementWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_ELEMENT);
	while ((node = elementWalker.nextNode() as Comment)) {
		if (isComment(node) && node.data.startsWith('/qv')) {
			parents.pop();
		} else {
			const id = getId(node);
			if (id) {
				let props: { key: string, value: string }[] = [];
				const qwikJsonCtx = qwikJson.ctx[id];
				if (qwikJsonCtx?.props) {
					props = Object.entries(qwikJsonCtx.props)
						.filter(([key]) => key !== '__id' && key !== '__backRefs')
						.map(([key, value]) => {
							return {
								key,
								value: (value as any)?.fn || (value as any).__value || '--',
							};
						});
				}
				let refs: string[] = [];
				const qwikJsonRefs = qwikJson.refs[id];
				if (qwikJsonRefs?.refMap) {
					refs = qwikJsonRefs.refMap.filter((p: {__value: string})=> !!p?.__value).map((p: {__value: string})=> p.__value);
				}
				elements.push({
					id,
					parentId: parents[parents.length - 1] ? getId(parents[parents.length - 1]) : null,
					props,
					refs,
				});
				if (isComment(node) && node.data.startsWith('qv ')) {
					parents.push(node);
				}
			}
		}
	}

	const idMapping = elements.reduce((acc: Record<string, number>, el, i) => {
		acc[el.id] = i;
		return acc;
	}, {});

	const root: Record<string, Component> = {};
	elements.forEach((el) => {
		if (el.parentId === null) {
			root[el.id] = el;
			return;
		}
		const parentEl = elements[idMapping[el.parentId]];
		parentEl.children = [...(parentEl.children || []), el];
	});
	return root;
};

const getId = (node: Node) => {
	if (isElement(node)) return (node as Element).getAttribute('q:id');
	else if (isComment(node)) {
		const text = node.nodeValue || '';
		if (text.startsWith('t=')) return text.substring(2);
		else if (text.startsWith('qv ')) {
			const parts = text.split(' ');
			for (let i = 0; i < parts.length; i++) {
				const part = parts[i];
				if (part.startsWith('q:id=')) return part.substring(5);
				if (part.startsWith('q:sref=')) return part.substring(7);
			}
		}
		return null;
	} else throw new Error('Unexpected node type: ' + node.nodeType);
}

export const isElement = (node: Node) => node && typeof node == 'object' && node.nodeType === Node.ELEMENT_NODE
export const isComment = (node: Node) => node && typeof node == 'object' && node.nodeType === Node.COMMENT_NODE
