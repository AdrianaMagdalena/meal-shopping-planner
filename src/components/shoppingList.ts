import { ISavedShoppingItem } from "../interfaces/iSavedShopping.js";
import { SHOPPING_LIST_STORAGE_KEY } from "../services/plannerManager.js";
import { generateId } from "../utils/generateId.js";
import { insertElem } from "../utils/insertElem.js";
import { isSelectorString } from "../utils/typeGuards.js";
import { ErrorScreen } from "./errorScreen.js";

const CATEGORY_ORDER = [
  "vegetables",
  "fruit",
  "dairy",
  "meat",
  "fish",
  "seeds & nuts",
  "canned & dry goods",
  "seasoning",
  "alcohol",
  "other",
];

export const CHECKED_ITEMS_STORAGE_KEY = "checkedShoppingItems";
export const REMOVED_ITEMS_STORAGE_KEY = "removedShoppingItems";

const loadRemovedIds = (): string[] => {
  const rawData = localStorage.getItem(REMOVED_ITEMS_STORAGE_KEY);
  if (!rawData) return [];

  try {
    const parsedData: unknown = JSON.parse(rawData);
    if (!Array.isArray(parsedData)) return [];
    return parsedData.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
};

const saveRemovedIds = (ids: string[]): void => {
  localStorage.setItem(REMOVED_ITEMS_STORAGE_KEY, JSON.stringify(ids));
};

const loadCheckedIds = (): string[] => {
  const rawData = localStorage.getItem(CHECKED_ITEMS_STORAGE_KEY);
  if (!rawData) return [];

  try {
    const parsedData: unknown = JSON.parse(rawData);
    if (!Array.isArray(parsedData)) return [];
    return parsedData.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
};

const saveCheckedIds = (ids: string[]): void => {
  localStorage.setItem(CHECKED_ITEMS_STORAGE_KEY, JSON.stringify(ids));
};

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

const listItemTemplate = document.createElement("template");
const listItemTemplateHtml = `
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

listItemTemplate.innerHTML = listItemTemplateHtml.trim();

export class ShoppingList {
  private readonly _shoppingListWrap: HTMLDivElement;
  private readonly _removeItemsBtn: HTMLButtonElement;
  private readonly _shoppingListContainer: HTMLDivElement;

  constructor() {
    const fragment = template.content.cloneNode(true) as DocumentFragment;

    const shoppingListWrap = fragment.querySelector<HTMLDivElement>(
      ".weekly-list__shopping-list",
    );
    if (!shoppingListWrap)
      throw new Error("shoppingListWrap not found on template");
    this._shoppingListWrap = shoppingListWrap;

    const removeItemsBtn = fragment.querySelector<HTMLButtonElement>(
      ".shopping-list__button",
    );
    if (!removeItemsBtn)
      throw new Error("removeItemsBtn not found on template");
    this._removeItemsBtn = removeItemsBtn;

    const shoppingListContainer = fragment.querySelector<HTMLDivElement>(
      ".shopping-list__container",
    );
    if (!shoppingListContainer)
      throw new Error("shoppingListContainer not found on template");
    this._shoppingListContainer = shoppingListContainer;

    this._removeItemsBtn.addEventListener("click", () => {
      const checkedIds = loadCheckedIds();
      if (checkedIds.length === 0) return;

      const removedIds = loadRemovedIds();
      checkedIds.forEach((id) => {
        if (!removedIds.includes(id)) {
          removedIds.push(id);
        }
      });
      saveRemovedIds(removedIds);

      saveCheckedIds([]);

      const items = this._shoppingListContainer.querySelectorAll<HTMLLIElement>(
        ".shopping-list__item",
      );

      items.forEach((item) => {
        const checkbox =
          item.querySelector<HTMLInputElement>(".checkbox__input");
        const itemsParentUl = item?.parentElement;
        const categoryTitle = itemsParentUl?.previousElementSibling;

        if (checkbox?.checked) {
          item.remove();
          if (itemsParentUl?.children.length === 0) {
            itemsParentUl?.remove();
            categoryTitle?.remove();
          }
        }
      });

      const remainigItems = this._shoppingListContainer.querySelectorAll(
        ".shopping-list__item",
      );
      if (remainigItems.length === 0) {
        localStorage.removeItem(SHOPPING_LIST_STORAGE_KEY);
        this.renderList([]);
      }
    });
  }

  get shoppingListContainer() {
    return this._shoppingListContainer;
  }

  render(parentSelector: string | HTMLElement, position: string): void {
    const parentElement = isSelectorString(parentSelector)
      ? document.querySelector<HTMLElement>(parentSelector)
      : parentSelector;
    if (!parentElement) {
      throw new Error("parentElement not found in template");
    }

    insertElem(position, this._shoppingListWrap, parentElement);
  }

  groupByCategory(
    items: ISavedShoppingItem[],
  ): Map<string, ISavedShoppingItem[]> {
    const grouped = new Map<string, ISavedShoppingItem[]>();

    items.forEach((item) => {
      if (!grouped.has(item.category)) {
        grouped.set(item.category, []);
      }
      grouped.get(item.category)!.push(item);
    });

    return grouped;
  }

  sortByFixedOrder(
    grouped: Map<string, ISavedShoppingItem[]>,
  ): Map<string, ISavedShoppingItem[]> {
    const sortedItems = Array.from(grouped.entries()).sort(
      ([categoryA], [categoryB]) => {
        const indexA = CATEGORY_ORDER.indexOf(categoryA);
        const indexB = CATEGORY_ORDER.indexOf(categoryB);
        const safeIndexA = indexA === -1 ? CATEGORY_ORDER.length : indexA;
        const safeIndexB = indexB === -1 ? CATEGORY_ORDER.length : indexB;
        return safeIndexA - safeIndexB;
      },
    );
    return new Map(sortedItems);
  }

  async renderList(items: ISavedShoppingItem[]): Promise<void> {
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
      errorScreen.render(".shopping-list__container");
      return;
    }

    const grouped = this.groupByCategory(displayedItems);
    const sortedGroup = this.sortByFixedOrder(grouped);
    const initialCheckedIds = loadCheckedIds();

    sortedGroup.forEach((categoryItems, category) => {
      const categoryTitle = document.createElement("h3");
      categoryTitle.textContent = category;
      this._shoppingListContainer.appendChild(categoryTitle);

      const list = document.createElement("ul");

      categoryItems.forEach((item) => {
        const itemFragment = listItemTemplate.content.cloneNode(
          true,
        ) as DocumentFragment;

        const shoppingItem = itemFragment.querySelector<HTMLLIElement>("li");
        if (!shoppingItem)
          throw new Error("shoppingItem not found on template");
        const checkboxItem =
          shoppingItem.querySelector<HTMLLabelElement>(".checkbox__label");
        if (!checkboxItem)
          throw new Error("checkboxItem not found on template");
        const checkboxInput =
          shoppingItem.querySelector<HTMLInputElement>(".checkbox__input");
        if (!checkboxInput)
          throw new Error("checkboxInput not found on template");
        const quantitySpan = shoppingItem.querySelector<HTMLSpanElement>(
          ".checkbox__quantity",
        );
        if (!quantitySpan)
          throw new Error("quantitySpan not found on template");
        const nameSpan =
          shoppingItem.querySelector<HTMLSpanElement>(".checkbox__name");
        if (!nameSpan) throw new Error("nameSpan not found on template");

        const uniqueID = generateId("shoppingitem", 8);
        checkboxItem.setAttribute("for", uniqueID);
        checkboxInput.id = uniqueID;
        checkboxInput.checked = initialCheckedIds.includes(item.id);
        quantitySpan.textContent = `${item.quantity} ${item.unit}`;
        nameSpan.textContent = item.name;

        list.appendChild(shoppingItem);

        checkboxInput.addEventListener("change", () => {
          let checkedIds = loadCheckedIds();

          if (checkboxInput.checked) {
            if (!checkedIds.includes(item.id)) {
              checkedIds.push(item.id);
            }
            saveCheckedIds(checkedIds);
          } else {
            saveCheckedIds(checkedIds.filter((id) => id !== item.id));
          }
        });
      });
      this._shoppingListContainer.appendChild(list);
    });
  }
}
