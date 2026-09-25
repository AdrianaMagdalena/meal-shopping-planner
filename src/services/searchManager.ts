import { Input } from "../components/input.js";
import { SearchPanel } from "../components/searchPanel.js";
import { Recipe } from "../models/recipe.js";
import { RecipeStorage } from "../storages/recipeStorage.js";

export class SearchManager {
  private _inputsWrap: HTMLDivElement;
  private _clearButton: HTMLButtonElement;
  private _applyFiltersButton: HTMLButtonElement;
  private _searchInput: Input;
  private _searchPanel: SearchPanel;
  private _recipeStorage: RecipeStorage;
  private _onResults: (recipes: Recipe[]) => void;

  constructor(
    recipeStorage: RecipeStorage,
    onResults: (recipes: Recipe[]) => void,
  ) {
    const inputsWrap = document.querySelector<HTMLDivElement>(
      ".recipe-search__inputs",
    );
    if (!inputsWrap) {
      throw new Error("inputsWrap not found on page");
    }
    this._inputsWrap = inputsWrap;

    const clearButton =
      document.querySelector<HTMLButtonElement>(".button--clear");
    if (!clearButton) {
      throw new Error("clearButton not found on page");
    }
    this._clearButton = clearButton;

    const applyFiltersButton =
      document.querySelector<HTMLButtonElement>(".button--apply");
    if (!applyFiltersButton) {
      throw new Error("applyFiltersButton not found on page");
    }
    this._applyFiltersButton = applyFiltersButton;

    this._recipeStorage = recipeStorage;
    this._onResults = onResults;

    this._searchPanel = new SearchPanel(recipeStorage);
    this._searchInput = new Input(
      "recipe-search__search-input",
      "Recipe search",
      "",
      "Search by keyword",
      "",
      "Search",
    );
    this._searchInput.render(this._inputsWrap, "prepend");

    if (!this._searchInput.trailBtn) {
      throw new Error("trailBtn not found on searchInput");
    }
    this._searchInput.trailBtn.addEventListener("click", (): void => {
      this.searchRecipesByKeyword();
    });

    this._searchInput.inputInput.addEventListener(
      "keydown",
      (e: KeyboardEvent): void => {
        if (e.key === "Enter") {
          this._searchInput.trailBtn?.click();
        }
      },
    );

    this._applyFiltersButton.addEventListener("click", (): void => {
      this.filterRecipesByCategories();
    });

    this._clearButton.addEventListener("click", (): void => {
      this.clearSearch();
    });
  }

  async searchRecipesByKeyword(): Promise<void> {
    const keyword = this._searchInput.inputInput.value;
    if (!keyword) return;

    const results = await this._recipeStorage.getByKeyword(keyword);
    this._onResults(results);
  }

  async clearSearch(): Promise<void> {
    this._searchInput.inputInput.value = "";
    const allCheckedTags = document.querySelectorAll<HTMLInputElement>(
      ".recipe-search__categories-container input",
    );
    allCheckedTags.forEach((t) => (t.checked = false));
    const results = await this._recipeStorage.getAll();
    this._onResults(results);
  }

  async filterRecipesByCategories(): Promise<void> {
    let checkedDietCategory: string[] = [];
    let checkedMealCategory: string[] = [];

    const allDietCategories = document.querySelectorAll<HTMLInputElement>(
      ".recipe-search__category--diet .recipe-search__tag input",
    );
    const allMealCategories = document.querySelectorAll<HTMLInputElement>(
      ".recipe-search__category--meal .recipe-search__tag input",
    );

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
      keyword: this._searchInput.inputInput.value,
      dietTags: checkedDietCategory,
      mealTypeTags: checkedMealCategory,
    });

    this._onResults(results);
  }
}
