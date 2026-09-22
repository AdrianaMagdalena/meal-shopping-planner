import { generateId } from "../utils/generateId.js";
import { isSelectorString } from "../utils/typeGuards.js";
import { insertElem } from "../utils/insertElem.js";
const template = document.createElement("template");
const templateHTML = `
<div class="search">
  <label class="search__label"></label>
  <div class="search__wrap">
  <input class="search__input" />
  <button class="search__action search__action"></button>
  </div>
</div>
`;
template.innerHTML = templateHTML.trim();
export class SearchField {
    constructor(inputLabel, placeholderText, searchBtnAriaLabel, recipeStorage, onResults) {
        const fragment = template.content.cloneNode(true);
        const searchField = fragment.querySelector(".search");
        if (!searchField) {
            throw new Error("searchField not found in template");
        }
        this._searchField = searchField;
        const searchLabel = this._searchField.querySelector(".search__label");
        if (!searchLabel) {
            throw new Error("searchLabel not found in template");
        }
        this._searchLabel = searchLabel;
        const searchInput = this._searchField.querySelector(".search__input");
        if (!searchInput) {
            throw new Error("searchInput not found in template");
        }
        this._searchInput = searchInput;
        const searchBtn = this._searchField.querySelector(".search__action");
        if (!searchBtn) {
            throw new Error("searchBtn not found in template");
        }
        this._searchBtn = searchBtn;
        const inputId = generateId("search", 5);
        this._searchLabel.textContent = inputLabel;
        this._searchLabel.setAttribute("for", inputId);
        this._searchInput.id = inputId;
        this._searchInput.placeholder = placeholderText;
        this._searchBtn.setAttribute("aria-label", searchBtnAriaLabel);
        this._recipeStorage = recipeStorage;
        this._onResults = onResults;
        this._searchBtn.addEventListener("click", () => {
            this.searchRecipes();
        });
        this._searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                this._searchBtn.click();
            }
        });
    }
    render(parentSelector, position) {
        const parentElement = isSelectorString(parentSelector)
            ? document.querySelector(parentSelector)
            : parentSelector;
        if (!parentElement) {
            throw new Error("parentElement not found in template");
        }
        insertElem(position, this._searchField, parentElement);
    }
    async searchRecipes() {
        const keyword = this._searchInput.value;
        if (!keyword)
            return;
        const results = await this._recipeStorage.getByKeyword(keyword);
        this._onResults(results);
    }
    async clearSearch() {
        this._searchInput.value = "";
        const results = await this._recipeStorage.getAll();
        this._onResults(results);
    }
}
