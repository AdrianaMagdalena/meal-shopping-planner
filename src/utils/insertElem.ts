export const insertElem = (
  position: string,
  elem: HTMLElement,
  relativeElem: HTMLElement,
): void => {
  switch (position) {
    case "prepend":
      relativeElem.prepend(elem);
      break;
    case "append":
      relativeElem.append(elem);
      break;
    case "before":
      relativeElem.before(elem);
      break;
    case "after":
      relativeElem.after(elem);
      break;
  }
};
