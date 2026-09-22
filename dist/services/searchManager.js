import { SearchField } from "../components/searchField.js";
const tagTemplate = document.createElement("template");
const tagTemplateHTML = `
<label class="recipe-search__tag" for="">
    <input class="recipe-search__tag-input" type="checkbox" id="" />
    <div class="recipe-search__tag-marker"></div>
    <span></span>
</label>
`;
tagTemplate.innerHTML = tagTemplateHTML.trim();
export class SearchManager {
    constructor(recipeStorage, onResults) {
        this._dietTags = [];
        this._mealTags = [];
        const inputsWrap = document.querySelector(".recipe-search__inputs");
        if (!inputsWrap) {
            throw new Error("inputsWrap not found on page");
        }
        this._inputsWrap = inputsWrap;
        const clearButton = document.querySelector(".button--clear");
        if (!clearButton) {
            throw new Error("clearButton not found on page");
        }
        this._clearButton = clearButton;
        const showFiltersButton = document.querySelector(".button--show-filters");
        if (!showFiltersButton) {
            throw new Error("showFiltersButton not found on page");
        }
        this._showFiltersButton = showFiltersButton;
        const applyFiltersButton = document.querySelector(".button--apply");
        if (!applyFiltersButton) {
            throw new Error("applyFiltersButton not found on page");
        }
        this._applyFiltersButton = applyFiltersButton;
        const categoriesWrap = document.querySelector(".recipe-search__categories");
        if (!categoriesWrap) {
            throw new Error("categoriesWrap not found on page");
        }
        this._categoriesWrap = categoriesWrap;
        const dietTagsWrap = document.querySelector(".recipe-search__category--diet");
        if (!dietTagsWrap) {
            throw new Error("dietTagsWrap not found on page");
        }
        this._dietTagsWrap = dietTagsWrap;
        const mealTypeTagsWrap = document.querySelector(".recipe-search__category--meal");
        if (!mealTypeTagsWrap) {
            throw new Error("mealTypeTagsWrap not found on page");
        }
        this._mealTypeTagsWrap = mealTypeTagsWrap;
        this._recipeStorage = recipeStorage;
        this._onResults = onResults;
        this._searchField = new SearchField("Recipe search", "Search by keywords", "Search");
        this._searchField.render(this._inputsWrap, "prepend");
        this._searchField.searchBtn.addEventListener("click", () => {
            this.searchRecipes();
        });
        this._searchField.searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                this._searchField.searchBtn.click();
            }
        });
        this._clearButton.addEventListener("click", () => {
            this.clearSearch();
            // TODO: clear filters!!!
        });
        this._showFiltersButton.addEventListener("click", () => {
            this._showFiltersButton.classList.toggle("open");
            this._categoriesWrap.classList.toggle("open");
        });
    }
    async searchRecipes() {
        const keyword = this._searchField.searchInput.value;
        if (!keyword)
            return;
        const results = await this._recipeStorage.getByKeyword(keyword);
        this._onResults(results);
    }
    async clearSearch() {
        this._searchField.searchInput.value = "";
        const results = await this._recipeStorage.getAll();
        this._onResults(results);
    }
    renderTags() { }
    executeSearch() { }
}
