import { SearchField } from "../components/searchField.js";
import { SearchPanel } from "../components/searchPanel.js";
export class SearchManager {
    constructor(recipeStorage, onResults) {
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
        const applyFiltersButton = document.querySelector(".button--apply");
        if (!applyFiltersButton) {
            throw new Error("applyFiltersButton not found on page");
        }
        this._applyFiltersButton = applyFiltersButton;
        this._recipeStorage = recipeStorage;
        this._onResults = onResults;
        this._searchPanel = new SearchPanel(recipeStorage);
        this._searchField = new SearchField("Recipe search", "Search by keyword", "Search");
        this._searchField.render(this._inputsWrap, "prepend");
        this._searchField.searchBtn.addEventListener("click", () => {
            this.searchRecipesByKeyword();
        });
        this._searchField.searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                this._searchField.searchBtn.click();
            }
        });
        this._applyFiltersButton.addEventListener("click", () => {
            this.filterRecipesByCategories();
        });
        this._clearButton.addEventListener("click", () => {
            this.clearSearch();
        });
    }
    async searchRecipesByKeyword() {
        const keyword = this._searchField.searchInput.value;
        if (!keyword)
            return;
        const results = await this._recipeStorage.getByKeyword(keyword);
        this._onResults(results);
    }
    async clearSearch() {
        this._searchField.searchInput.value = "";
        const allCheckedTags = document.querySelectorAll(".recipe-search__categories-container input");
        allCheckedTags.forEach((t) => (t.checked = false));
        const results = await this._recipeStorage.getAll();
        this._onResults(results);
    }
    async filterRecipesByCategories() {
        let checkedDietCategory = [];
        let checkedMealCategory = [];
        const allDietCategories = document.querySelectorAll(".recipe-search__category--diet .recipe-search__tag input");
        const allMealCategories = document.querySelectorAll(".recipe-search__category--meal .recipe-search__tag input");
        allDietCategories.forEach((c) => {
            if (c.checked && c.nextElementSibling?.textContent) {
                checkedDietCategory.push(c.nextElementSibling.textContent);
            }
        });
        allMealCategories.forEach((c) => {
            if (c.checked && c.nextElementSibling?.textContent) {
                checkedMealCategory.push(c.nextElementSibling.textContent);
            }
        });
        console.log(checkedDietCategory);
        console.log(checkedMealCategory);
        const results = await this._recipeStorage.search({
            keyword: this._searchField.searchInput.value,
            dietTags: checkedDietCategory,
            mealTypeTags: checkedMealCategory,
        });
        this._onResults(results);
    }
}
