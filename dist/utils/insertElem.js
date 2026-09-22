export const insertElem = (position, elem, relativeElem) => {
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
