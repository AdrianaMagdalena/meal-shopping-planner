import { insertElem } from "../../utils/insertElem.js";
import { isSelectorString } from "../../utils/typeGuards.js";
import { ShoppingItemComponent } from "./shoppingItemComponent.js";
export class ShoppingCategoryComponent {
    constructor(category, items) {
        this._items = [];
        this._categoryElem = document.createElement("div");
        this._categoryElem.classList.add("shopping-list__group");
        const heading = document.createElement("h3");
        heading.textContent = category;
        this._categoryElem.appendChild(heading);
        this._listElem = document.createElement("ul");
        items.forEach((item) => {
            const itemComponent = new ShoppingItemComponent(item);
            itemComponent.render(this._listElem, "append");
            this._items.push(itemComponent);
        });
        this._categoryElem.appendChild(this._listElem);
    }
    get checkedItemIds() {
        return this._items.filter((i) => i.isChecked).map((i) => i.itemId);
    }
    get allItems() {
        return this._items.map((i) => i.item);
    }
    render(parentSelector, position) {
        const parentElement = isSelectorString(parentSelector)
            ? document.querySelector(parentSelector)
            : parentSelector;
        if (!parentElement) {
            throw new Error("parentElement not found in template");
        }
        insertElem(position, this._categoryElem, parentElement);
    }
}
