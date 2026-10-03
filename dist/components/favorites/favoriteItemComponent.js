import { insertElem } from "../../utils/insertElem.js";
import { isSelectorString } from "../../utils/typeGuards.js";
const template = document.createElement("template");
const templateHTML = `
<li class="favorites-list__recipe">
    <a></a>
    <div class="favorites-list__button-wrap">
        <button 
            class="button button--prim button--icon-only button--mini  button--plan favorites-list__add-to-plan" aria-label="Add to plan">
        </button>
        <button
            class="button button--sec button--icon-only button--mini button--clear favorites-list__remove" aria-label="Remove entry">
        </button>
    </div>
</li>
`;
template.innerHTML = templateHTML.trim();
export class FavoriteItemComponent {
    constructor(favorite, onRemove, onAddToPlan) {
        const fragment = template.content.cloneNode(true);
        const favoriteItem = fragment.querySelector(".favorites-list__recipe");
        if (!favoriteItem)
            throw new Error("favoriteItem does not exist on template");
        this._favoriteItem = favoriteItem;
        const linkToRecipe = this._favoriteItem.querySelector("a");
        if (!linkToRecipe)
            throw new Error("linkToRecipe does not exist on template");
        this._linkToRecipe = linkToRecipe;
        const addToPlanButton = this._favoriteItem.querySelector(".favorites-list__add-to-plan");
        if (!addToPlanButton)
            throw new Error("addToPlanButton does not exist on template");
        this._addToPlanButton = addToPlanButton;
        const removeFromFavsButton = this._favoriteItem.querySelector(".favorites-list__remove");
        if (!removeFromFavsButton)
            throw new Error("removeFromFavsButton does not exist on template");
        this._removeFromFavsButton = removeFromFavsButton;
        this._linkToRecipe.textContent = favorite.recipeTitle;
        this._linkToRecipe.href = `./recipe-details.html?id=${favorite.recipeId}`;
        this.addToPlanBtn.addEventListener("click", () => onAddToPlan(favorite.recipeId));
        this._removeFromFavsButton.addEventListener("click", () => onRemove(favorite.recipeId));
    }
    get addToPlanBtn() {
        return this._addToPlanButton;
    }
    get removeFromFavsButton() {
        return this._removeFromFavsButton;
    }
    get favoriteItem() {
        return this._favoriteItem;
    }
    render(prevSiblingSelector) {
        const prevSiblingElem = isSelectorString(prevSiblingSelector)
            ? document.querySelector(prevSiblingSelector)
            : prevSiblingSelector;
        if (!prevSiblingElem) {
            throw new Error("prevSiblingElem not found in template");
        }
        insertElem("after", this._favoriteItem, prevSiblingElem);
    }
}
