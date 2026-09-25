import { insertElem } from "../utils/insertElem.js";
import { isSelectorString } from "../utils/typeGuards.js";
import { AmountInput } from "./amountInput.js";
const template = document.createElement("template");
const templateHTML = `
<div class="day-menu__entry">
    <button class="button button--sec button--icon-only 
        button--mini button--trash"
        aria-label="Remove entry"></button>
    <p class="day-menu__recipe-title"></p>
</div>
`;
template.innerHTML = templateHTML.trim();
export class MenuEntry {
    constructor(entry, onRemove) {
        const entryServings = String(entry.servingsAmount);
        const fragment = template.content.cloneNode(true);
        const entryElem = fragment.querySelector(".day-menu__entry");
        if (!entryElem)
            throw new Error("entry not found in template");
        this._entryElem = entryElem;
        const removeBtn = this._entryElem.querySelector(".button--trash");
        if (!removeBtn)
            throw new Error("removeBtn not found in template");
        this._removeButton = removeBtn;
        const title = this._entryElem.querySelector(".day-menu__recipe-title");
        if (!title)
            throw new Error("title not found in template");
        this._recipeTitle = title;
        this._recipeTitle.textContent = entry.recipeTitle;
        const entryServingsInput = new AmountInput("day-menu__servings", "numeric", "[0-9]*", entryServings, "", "Recipe servings", "", "Remove amout of servings", "Add amount of servings");
        this._servingsInput = entryServingsInput;
        this._servingsInput.render(this._entryElem, "append");
        this._removeButton.addEventListener("click", () => {
            onRemove(entry.id);
        });
    }
    render(parentSelector, position) {
        const parentElement = isSelectorString(parentSelector)
            ? document.querySelector(parentSelector)
            : parentSelector;
        if (!parentElement) {
            throw new Error("parentElement not found in template");
        }
        insertElem(position, this._entryElem, parentElement);
    }
}
