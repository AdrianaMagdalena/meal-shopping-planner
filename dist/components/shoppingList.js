import { generateId } from "../utils/generateId.js";
import { insertElem } from "../utils/insertElem.js";
import { isSelectorString } from "../utils/typeGuards.js";
import { ErrorScreen } from "./errorScreen.js";
const template = document.createElement("template");
const templateHtml = `
<div class="weekly-list__shopping-list">
    <button class="shopping-list__button button button--prim button--icon-before button--check">Remove checked items</button>
    <ul></ul>
</div>
`;
template.innerHTML = templateHtml.trim();
const listItemTemplate = document.createElement("template");
const listItemTemplateHtml = `
<li class="shopping-list__item">
<label class="checkbox__label">
    <div class="checkbox__marker"></div>
    <input class="checkbox__input" type="checkbox" />
    <span>
        <span class="checkbox__quantity"></span>
        <span class="checkbox__unit"></span>
        <span class="checkbox__name"></span>
    </span>
</label>
</li>
`;
listItemTemplate.innerHTML = listItemTemplateHtml.trim();
export class ShoppingList {
    constructor() {
        const fragment = template.content.cloneNode(true);
        const shoppingListWrap = fragment.querySelector(".weekly-list__shopping-list");
        if (!shoppingListWrap)
            throw new Error("shoppingListWrap not found on template");
        this._shoppingListWrap = shoppingListWrap;
        const removeItemsBtn = fragment.querySelector(".shopping-list__button");
        if (!removeItemsBtn)
            throw new Error("removeItemsBtn not found on template");
        this._removeItemsBtn = removeItemsBtn;
        const shoppingList = fragment.querySelector("ul");
        if (!shoppingList)
            throw new Error("shoppingList not found on template");
        this._shoppingList = shoppingList;
        this.render("main", "append");
    }
    render(parentSelector, position) {
        const parentElement = isSelectorString(parentSelector)
            ? document.querySelector(parentSelector)
            : parentSelector;
        if (!parentElement) {
            throw new Error("parentElement not found in template");
        }
        insertElem(position, this._shoppingListWrap, parentElement);
    }
    async renderList(items) {
        console.log(items[0]);
        if (items.length === 0) {
            if (!document.querySelector(".error-screen")) {
                const errorScreen = new ErrorScreen("../src/assets/illustrations/search.svg", "No shopping list to display!", "Finalize the weekly meal plan to generate a shopping list");
                errorScreen.render("main");
            }
            return;
        }
        items.forEach((item) => {
            const itemFragment = listItemTemplate.content.cloneNode(true);
            const shoppingItem = itemFragment.querySelector("li");
            if (!shoppingItem)
                throw new Error("shoppingItem not found on template");
            const checkboxItem = shoppingItem.querySelector(".checkbox__label");
            if (!checkboxItem)
                throw new Error("checkboxItem not found on template");
            const checkboxInput = shoppingItem.querySelector(".checkbox__input");
            if (!checkboxInput)
                throw new Error("checkboxInput not found on template");
            const quantitySpan = shoppingItem.querySelector(".checkbox__quantity");
            if (!quantitySpan)
                throw new Error("quantitySpan not found on template");
            const unitSpan = shoppingItem.querySelector(".checkbox__unit");
            if (!unitSpan)
                throw new Error("unitSpan not found on template");
            const nameSpan = shoppingItem.querySelector(".checkbox__name");
            if (!nameSpan)
                throw new Error("nameSpan not found on template");
            const uniqueID = generateId("shoppingitem", 8);
            checkboxItem.setAttribute("for", uniqueID);
            checkboxInput.id = uniqueID;
            quantitySpan.textContent = `${item.quantity} ${item.unit}`;
            nameSpan.textContent = item.name;
            this._shoppingList.appendChild(shoppingItem);
        });
    }
}
