export const enum VNodeProps {
  flags = 0,
  parent = 1,
  previousSibling = 2,
  nextSibling = 3,
}

export const enum VNodeFlags {
  Element /* ****************** */ = 0b00_000001,
  Virtual /* ****************** */ = 0b00_000010,
  ELEMENT_OR_VIRTUAL_MASK /* ** */ = 0b00_000011,
  ELEMENT_OR_TEXT_MASK /* ***** */ = 0b00_000101,
  TYPE_MASK /* **************** */ = 0b00_000111,
  INFLATED_TYPE_MASK /* ******* */ = 0b00_001111,
  Text /* ********************* */ = 0b00_000100,
  /// Extra flag which marks if a node needs to be inflated.
  Inflated /* ***************** */ = 0b00_001000,
  /// Marks if the `ensureProjectionResolved` has been called on the node.
  Resolved /* ***************** */ = 0b00_010000,
  /// Marks if the vnode is deleted.
  Deleted /* ****************** */ = 0b00_100000,
  /// Flags for Namespace
  NAMESPACE_MASK /* *********** */ = 0b11_000000,
  NEGATED_NAMESPACE_MASK /* ** */ = ~0b11_000000,
  NS_html /* ****************** */ = 0b00_000000, // http://www.w3.org/1999/xhtml
  NS_svg /* ******************* */ = 0b01_000000, // http://www.w3.org/2000/svg
  NS_math /* ****************** */ = 0b10_000000, // http://www.w3.org/1998/Math/MathML
}

export const enum ElementVNodeProps {
  firstChild = 4,
  lastChild = 5,
  element = 6,
  elementName = 7,
  PROPS_OFFSET = 8,
}

export const DEBUG_TYPE = 'q:type';
export const RENDER_TYPE = 'q:renderFn'
export const ISDEVTOOL = 'Qwikdevtools'

export const enum VirtualVNodeProps {
  firstChild = ElementVNodeProps.firstChild,
  lastChild = ElementVNodeProps.lastChild,
  PROPS_OFFSET = 6,
}

export const Q_PROPS_SEPARATOR = ':';

export const QContainerAttr = 'q:container';

export const enum QContainerValue {
  PAUSED = 'paused',
  RESUMED = 'resumed',
  // these values below are used in the qwik loader as a plain text for the q:container selector
  // standard dangerouslySetInnerHTML
  HTML = 'html',
  // textarea
  TEXT = 'text',
}
