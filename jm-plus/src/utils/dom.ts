export const q = (sel: string, root: Document | Element = document): Element | null =>
  root.querySelector(sel);

export const qa = (sel: string, root: Document | Element = document): NodeListOf<Element> =>
  root.querySelectorAll(sel);
