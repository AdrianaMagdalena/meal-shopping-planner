import { ISavedShoppingItem } from "../../interfaces/iSavedShopping.js";
import { insertElem } from "../../utils/insertElem.js";
import { isSelectorString } from "../../utils/typeGuards.js";
import { ShoppingItemComponent } from "./shoppingItemComponent.js";

export class ShoppingCategoryComponent {
  private readonly _categoryElem: HTMLDivElement;
  private readonly _listElem: HTMLUListElement;
  private readonly _items: ShoppingItemComponent[] = [];

  constructor(category: string, items: ISavedShoppingItem[]) {
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

  get checkedItemIds(): string[] {
    return this._items.filter((i) => i.isChecked).map((i) => i.itemId);
  }

  get allItems(): ISavedShoppingItem[] {
    return this._items.map((i) => i.item);
  }

  render(parentSelector: string | HTMLElement, position: string): void {
    const parentElement = isSelectorString(parentSelector)
      ? document.querySelector<HTMLElement>(parentSelector)
      : parentSelector;
    if (!parentElement) {
      throw new Error("parentElement not found in template");
    }

    insertElem(position, this._categoryElem, parentElement);
  }
}
