import { ALPHABET } from "../../utils/constants.js";
import { insertElem } from "../../utils/insertElem.js";
import { isSelectorString } from "../../utils/typeGuards.js";
import { ErrorScreen } from "../errorScreen.js";
import { FavoriteGroupComponent } from "./favoriteGroupComponent.js";
export class FavoritesListComponent {
    constructor(allFavorites) {
        const allFavs = allFavorites;
        const favoritesListElem = document.createElement("ul");
        this._listElem = favoritesListElem;
        this._listElem.classList.add("favorites-list__list");
        if (allFavs.length === 0) {
            const errorScreen = new ErrorScreen("../src/assets/illustrations/search.svg", "No saved favorites!", "Add recipes to favorites to see them here");
            errorScreen.render("main");
        }
        else {
            ALPHABET.forEach((letter) => {
                const groupList = allFavs
                    .filter((f) => f.recipeTitle[0].toLowerCase() === letter.toLowerCase())
                    .sort((a, b) => a.recipeTitle.localeCompare(b.recipeTitle));
                if (groupList.length === 0)
                    return;
                const groupElem = new FavoriteGroupComponent(letter, groupList);
                groupElem.render(this._listElem);
            });
            this.render("main");
        }
    }
    render(parentSelector) {
        const parentElement = isSelectorString(parentSelector)
            ? document.querySelector(parentSelector)
            : parentSelector;
        if (!parentElement) {
            throw new Error("parentElement not found in template");
        }
        insertElem("append", this._listElem, parentElement);
    }
}
