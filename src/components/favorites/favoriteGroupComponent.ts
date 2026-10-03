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

  constructor(letter: string, groupItems: IFavoriteItem[]) {
    const fragment = template.content.cloneNode(true) as DocumentFragment;

    const favoriteGroupHeader = fragment.querySelector<HTMLLIElement>(
      ".favorites-list__letter",
    );
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

  render(parentSelector: string | HTMLElement): void {
    const parentElement = isSelectorString(parentSelector)
      ? document.querySelector<HTMLElement>(parentSelector)
      : parentSelector;
    if (!parentElement) {
      throw new Error("parentElement not found in template");
    }

    insertElem("append", this._headerElem, parentElement);
  }
}
