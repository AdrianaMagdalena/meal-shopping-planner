import { WEEK_RECIPES_STORAGE_KEY } from "../services/plannerManager.js";
import { insertElem } from "../utils/insertElem.js";
import { isSavedPlannerEntry, isSelectorString } from "../utils/typeGuards.js";
import { ErrorScreen } from "./errorScreen.js";
const template = document.createElement("template");
const templateHtml = `
<div class="weekly-list__recipe-list">
    <div class="weekly-list__header-wrap">
        <h1>This week's recipes</h1>
        <button class="weekly-list__button button button--prim      button--icon-only button--show-recipes button--mini"></button>
    </div>
    <div class="weekly-list__wrap">
        <ul></ul>
    </div>
</div>
`;
template.innerHTML = templateHtml.trim();
export class WeekRecipeList {
    constructor() {
        const fragment = template.content.cloneNode(true);
        const recipeListCard = fragment.querySelector(".weekly-list__recipe-list");
        if (!recipeListCard)
            throw new Error("recipeListCard not found on template");
        this._recipeListCard = recipeListCard;
        const dropdownButton = this._recipeListCard.querySelector(".weekly-list__button");
        if (!dropdownButton)
            throw new Error("dropdownButto not found on template");
        this._dropdownButton = dropdownButton;
        const recipeListWrap = this._recipeListCard.querySelector(".weekly-list__wrap");
        if (!recipeListWrap)
            throw new Error("recipeListWrap not found on page");
        this._recipeListWrap = recipeListWrap;
        const recipeList = this._recipeListCard.querySelector("ul");
        if (!recipeList)
            throw new Error("recipeList not found on template");
        this._recipeList = recipeList;
        this._dropdownButton.addEventListener("click", () => {
            this._recipeListWrap.classList.toggle("open");
            this._dropdownButton.classList.toggle("open");
        });
        const rawData = localStorage.getItem(WEEK_RECIPES_STORAGE_KEY);
        if (!rawData) {
            const errorScreen = new ErrorScreen("../src/assets/illustrations/search.svg", "No data to display!", "Finalize the weeklu meal plan to generate recipe and shopping list");
            errorScreen.render("main");
        }
        else {
            const parsedData = JSON.parse(rawData);
            if (!Array.isArray(parsedData)) {
                throw new TypeError("Invalid format of saved weekly recipe list!");
            }
            parsedData.filter(isSavedPlannerEntry).forEach((r) => {
                console.log(r);
                const listItem = document.createElement("li");
                const anchorLink = document.createElement("a");
                console.log(anchorLink);
                anchorLink.textContent = r.recipeTitle;
                anchorLink.href = `./recipe-details.html?id=${r.recipeId}`;
                listItem.appendChild(anchorLink);
                this._recipeList.appendChild(listItem);
            });
        }
    }
    render(parentSelector, position) {
        const parentElement = isSelectorString(parentSelector)
            ? document.querySelector(parentSelector)
            : parentSelector;
        if (!parentElement) {
            throw new Error("parentElement not found in template");
        }
        insertElem(position, this._recipeListCard, parentElement);
    }
}
