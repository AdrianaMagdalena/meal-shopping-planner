import { WEEK_RECIPES_STORAGE_KEY } from "../services/plannerManager.js";
import { insertElem } from "../utils/insertElem.js";
import { isSavedPlannerEntry, isSelectorString } from "../utils/typeGuards.js";
import { ErrorScreen } from "./errorScreen.js";
const template = document.createElement("template");
const templateHtml = `
<div class="weekly-list__recipe-list">
    <div class="weekly-list__header-wrap">
        <h2>This week's recipes</h2>
        <button class="weekly-list__button button button--prim      button--icon-only button--show-recipes button--mini"></button>
    </div>
    <div class="weekly-list__wrap">
        <ul></ul>
    </div>
</div>
`;
template.innerHTML = templateHtml.trim();
const DROPDOWN_STORAGE_KEY = "dropdown-state";
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
        let isDropdownOpen;
        const stateData = localStorage.getItem(DROPDOWN_STORAGE_KEY);
        if (!stateData) {
            isDropdownOpen = this._recipeListWrap.classList.contains("open")
                ? "open"
                : "closed";
            localStorage.setItem(DROPDOWN_STORAGE_KEY, isDropdownOpen);
        }
        else {
            isDropdownOpen = stateData;
            if (isDropdownOpen === "open") {
                this._recipeListWrap.classList.add("open");
                this._dropdownButton.classList.add("open");
                isDropdownOpen = "closed";
            }
            else {
                this._recipeListWrap.classList.remove("open");
                this._dropdownButton.classList.remove("open");
                isDropdownOpen = "open";
            }
        }
        this._dropdownButton.addEventListener("click", () => {
            isDropdownOpen = localStorage.getItem(DROPDOWN_STORAGE_KEY);
            if (isDropdownOpen === "open") {
                this._recipeListWrap.classList.remove("open");
                this._dropdownButton.classList.remove("open");
                isDropdownOpen = "closed";
            }
            else {
                this._recipeListWrap.classList.add("open");
                this._dropdownButton.classList.add("open");
                isDropdownOpen = "open";
            }
            localStorage.setItem(DROPDOWN_STORAGE_KEY, isDropdownOpen);
        });
        const rawData = localStorage.getItem(WEEK_RECIPES_STORAGE_KEY);
        if (!rawData) {
            if (!document.querySelector(".error-screen")) {
                const errorScreen = new ErrorScreen("../src/assets/illustrations/search.svg", "No data to display!", "Finalize the weeklu meal plan to generate recipe and shopping list");
                errorScreen.render("main");
            }
        }
        else {
            const parsedData = JSON.parse(rawData);
            if (!Array.isArray(parsedData)) {
                throw new TypeError("Invalid format of saved weekly recipe list!");
            }
            parsedData.filter(isSavedPlannerEntry).forEach((r) => {
                const listItem = document.createElement("li");
                const anchorLink = document.createElement("a");
                anchorLink.textContent = r.recipeTitle;
                anchorLink.href = `./recipe-details.html?id=${r.recipeId}`;
                listItem.appendChild(anchorLink);
                this._recipeList.appendChild(listItem);
            });
            this.render("main", "append");
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
