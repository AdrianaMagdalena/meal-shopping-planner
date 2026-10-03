import { insertElem } from "../../utils/insertElem.js";
import { isSelectorString } from "../../utils/typeGuards.js";
import { FavoriteItemComponent } from "./favoriteItemComponent.js";
const template = document.createElement("template");
const templateHTML = `<li class="favorites-list__letter"></li>`;
template.innerHTML = templateHTML.trim();
export class FavoriteGroupComponent {
    constructor(letter, groupItems) {
        const fragment = template.content.cloneNode(true);
        const favoriteGroupHeader = fragment.querySelector(".favorites-list__letter");
        if (!favoriteGroupHeader)
            throw new Error("favoriteGroupHeader does not exist on template");
        this._headerElem = favoriteGroupHeader;
        this._headerElem.textContent = letter.toUpperCase();
        let lastInserted = this._headerElem;
        groupItems.forEach((i) => {
            const item = new FavoriteItemComponent(i);
            item.render(this._headerElem);
            lastInserted = item.favoriteItem;
        });
    }
    get headerElem() {
        return this._headerElem;
    }
    render(parentSelector) {
        const parentElement = isSelectorString(parentSelector)
            ? document.querySelector(parentSelector)
            : parentSelector;
        if (!parentElement) {
            throw new Error("parentElement not found in template");
        }
        insertElem("append", this._headerElem, parentElement);
    }
}
