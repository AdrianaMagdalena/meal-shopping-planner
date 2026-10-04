import { ISavedShoppingItem } from "../../interfaces/iSavedShopping.js";
import { insertElem } from "../../utils/insertElem.js";
import { isSelectorString } from "../../utils/typeGuards.js";
import { SHOPPING_LIST_STORAGE_KEY } from "../../utils/constants.js";
import { ErrorScreen } from "../errorScreen.js";
import { ShoppingCategoryComponent } from "./shoppingGroupComponent.js";
import { loadRemovedIds, markRemoved } from "../../utils/shoppinItemState.js";
import {
  groupByCategory,
  sortByFixedOrder,
} from "../../services/shoppingListManager.js";

const template = document.createElement("template");
const templateHtml = `
<div class="weekly-list__shopping-list">
  <div class="shopping-list__header">
    <h2>Shopping list</h2>
    <button class="shopping-list__button button button--prim button--icon-before button--check">Remove checked items</button>
  </div>
  <div class="shopping-list__container"></div>
</div>
`;
template.innerHTML = templateHtml.trim();

export class ShoppingListComponent {
  private readonly _wrapElem: HTMLDivElement;
  private readonly _removeItemsBtn: HTMLButtonElement;
  private readonly _containerElem: HTMLDivElement;
  private _categories: ShoppingCategoryComponent[] = [];

  constructor() {
    const fragment = template.content.cloneNode(true) as DocumentFragment;

    const wrapElem = fragment.querySelector<HTMLDivElement>(
      ".weekly-list__shopping-list",
    );
    if (!wrapElem) throw new Error("wrapElem not found in template");
    this._wrapElem = wrapElem;

    const removeItemsBtn = this._wrapElem.querySelector<HTMLButtonElement>(
      ".shopping-list__button",
    );
    if (!removeItemsBtn)
      throw new Error("removeItemsBtn not found in template");
    this._removeItemsBtn = removeItemsBtn;

    const containerElem = this._wrapElem.querySelector<HTMLDivElement>(
      ".shopping-list__container",
    );
    if (!containerElem) throw new Error("containerElem not found in template");
    this._containerElem = containerElem;

    this._removeItemsBtn.addEventListener("click", () =>
      this.handleRemoveChecked(),
    );
  }

  private handleRemoveChecked(): void {
    const checkedIds = this._categories.flatMap((c) => c.checkedItemIds);
    if (checkedIds.length === 0) return;
    console.log(checkedIds);
    markRemoved(checkedIds);

    if (
      this._containerElem.querySelectorAll(".shopping-list__item").length ===
      checkedIds.length
    ) {
      localStorage.removeItem(SHOPPING_LIST_STORAGE_KEY);
      this.renderList([]);
      return;
    }

    const remainingItems = this._categories
      .flatMap((c) => c.allItems)
      .filter((item) => !checkedIds.includes(item.id));

    this.renderList(remainingItems);
  }

  render(parentSelector: string | HTMLElement, position: string): void {
    const parentElement = isSelectorString(parentSelector)
      ? document.querySelector<HTMLElement>(parentSelector)
      : parentSelector;
    if (!parentElement) throw new Error("parentElement not found in template");

    insertElem(position, this._wrapElem, parentElement);
  }

  renderList(items: ISavedShoppingItem[]): void {
    this._containerElem.innerHTML = "";
    this._categories = [];

    const removedIds = loadRemovedIds();
    const displayedItems = items.filter(
      (item) => !removedIds.includes(item.id),
    );

    if (displayedItems.length === 0) {
      const errorScreen = new ErrorScreen(
        "../src/assets/illustrations/shopping-basket.svg",
        "Empty shopping list!",
        "You're done with all your shopping!",
      );
      errorScreen.render(this._containerElem);
      return;
    }

    const grouped = groupByCategory(displayedItems);
    const sorted = sortByFixedOrder(grouped);

    sorted.forEach((categoryItems, category) => {
      const categoryComponent = new ShoppingCategoryComponent(
        category,
        categoryItems,
      );
      categoryComponent.render(this._containerElem, "append");
      this._categories.push(categoryComponent);
    });
  }
}
