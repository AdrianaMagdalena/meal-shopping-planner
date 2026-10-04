import { generateId } from "../../utils/generateId.js";
import { insertElem } from "../../utils/insertElem.js";
import { loadCheckedIds, markChecked } from "../../utils/shoppinItemState.js";
import { isSelectorString } from "../../utils/typeGuards.js";
const template = document.createElement("template");
const templateHtml = `
<li class="shopping-list__item">
  <label class="checkbox__label">
    <div class="checkbox__marker"></div>
    <input class="checkbox__input" type="checkbox" />
    <span class="checkbox__text">
      <span class="checkbox__quantity"></span>
      <span class="checkbox__name"></span>
    </span>
  </label>
</li>
`;
template.innerHTML = templateHtml.trim();
export class ShoppingItemComponent {
    constructor(item) {
        this._item = item;
        const fragment = template.content.cloneNode(true);
        const itemElem = fragment.querySelector("li");
        if (!itemElem)
            throw new Error("itemElem not found in template");
        this._itemElem = itemElem;
        const checkboxItem = this._itemElem.querySelector(".checkbox__label");
        if (!checkboxItem)
            throw new Error("checkboxItem not found in template");
        const checkboxInput = this._itemElem.querySelector(".checkbox__input");
        if (!checkboxInput)
            throw new Error("checkboxInput not found in template");
        this._checkboxInput = checkboxInput;
        const quantitySpan = this._itemElem.querySelector(".checkbox__quantity");
        if (!quantitySpan)
            throw new Error("quantitySpan not found in template");
        const nameSpan = this._itemElem.querySelector(".checkbox__name");
        if (!nameSpan)
            throw new Error("nameSpan not found in template");
        const uniqueId = generateId("shoppingitem", 8);
        checkboxItem.setAttribute("for", uniqueId);
        this._checkboxInput.id = uniqueId;
        this._checkboxInput.checked = loadCheckedIds().includes(item.id);
        quantitySpan.textContent = `${item.quantity} ${item.unit}`;
        nameSpan.textContent = item.name;
        this._checkboxInput.addEventListener("change", () => {
            markChecked(this._item.id, this._checkboxInput.checked);
        });
    }
    get itemElem() {
        return this._itemElem;
    }
    get isChecked() {
        return this._checkboxInput.checked;
    }
    get itemId() {
        return this._item.id;
    }
    get item() {
        return this._item;
    }
    render(parentSelector, position) {
        const parentElement = isSelectorString(parentSelector)
            ? document.querySelector(parentSelector)
            : parentSelector;
        if (!parentElement) {
            throw new Error("parentElement not found in template");
        }
        insertElem(position, this._itemElem, parentElement);
    }
}
