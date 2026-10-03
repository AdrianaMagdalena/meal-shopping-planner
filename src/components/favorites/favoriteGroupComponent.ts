import { IFavoriteItem } from "../../interfaces/iFavorites.js";
import { Recipe } from "../../models/recipe.js";
import { insertElem } from "../../utils/insertElem.js";
import { isSelectorString } from "../../utils/typeGuards.js";
import { FavoriteItemComponent } from "./favoriteItemComponent.js";

const template = document.createElement("template");
const templateHTML = `<li class="favorites-list__letter"></li>`;
template.innerHTML = templateHTML.trim();

export class FavoriteGroupComponent {
  private _headerElem: HTMLLIElement;
  private _groupItems: IFavoriteItem[];
  private _onRemove: (recipeId: string) => void;
  private _onAddToPlan: (recipeId: string) => void;

  constructor(
    letter: string,
    groupItems: IFavoriteItem[],
    onRemove: (recipeId: string) => void,
    onAddToPlan: (recipeId: string) => void,
  ) {
    const fragment = template.content.cloneNode(true) as DocumentFragment;

    const favoriteGroupHeader = fragment.querySelector<HTMLLIElement>(
      ".favorites-list__letter",
    );
    if (!favoriteGroupHeader)
      throw new Error("favoriteGroupHeader does not exist on template");
    this._headerElem = favoriteGroupHeader;

    this._headerElem.textContent = letter.toUpperCase();
    this._groupItems = groupItems;
    this._onRemove = onRemove;
    this._onAddToPlan = onAddToPlan;
  }

  get headerElem() {
    return this._headerElem;
  }

  render(parentSelector: string | HTMLElement): void {
    const parentElement = isSelectorString(parentSelector)
      ? document.querySelector<HTMLElement>(parentSelector)
      : parentSelector;
    if (!parentElement) {
      throw new Error("parentElement not found in template");
    }

    insertElem("append", this._headerElem, parentElement);

    let lastInserted: HTMLElement = this._headerElem;
    this._groupItems.forEach((i) => {
      const item = new FavoriteItemComponent(
        i,
        this._onRemove,
        this._onAddToPlan,
      );
      item.render(lastInserted);
      lastInserted = item.favoriteItem;
    });
  }
}
