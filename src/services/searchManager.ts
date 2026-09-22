import { SearchField } from "../components/searchField.js";
import { Recipe } from "../models/recipe.js";
import { RecipeStorage } from "../storages/recipeStorage.js";

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
  private _inputsWrap: HTMLDivElement;
  private _clearButton: HTMLButtonElement;
  private _showFiltersButton: HTMLButtonElement;
  private _applyFiltersButton: HTMLButtonElement;
  private _categoriesWrap: HTMLDivElement;
  private _dietTagsWrap: HTMLDivElement;
  private _mealTypeTagsWrap: HTMLDivElement;
  private _searchField: SearchField;
  private _recipeStorage: RecipeStorage;
  private _onResults: (recpes: Recipe[]) => void;
  private _dietTags: string[] = [];
  private _mealTags: string[] = [];

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

    const showFiltersButton = document.querySelector<HTMLButtonElement>(
      ".button--show-filters",
    );
    if (!showFiltersButton) {
      throw new Error("showFiltersButton not found on page");
    }
    this._showFiltersButton = showFiltersButton;

    const applyFiltersButton =
      document.querySelector<HTMLButtonElement>(".button--apply");
    if (!applyFiltersButton) {
      throw new Error("applyFiltersButton not found on page");
    }
    this._applyFiltersButton = applyFiltersButton;

    const categoriesWrap = document.querySelector<HTMLDivElement>(
      ".recipe-search__categories",
    );
    if (!categoriesWrap) {
      throw new Error("categoriesWrap not found on page");
    }
    this._categoriesWrap = categoriesWrap;

    const dietTagsWrap = document.querySelector<HTMLDivElement>(
      ".recipe-search__category--diet",
    );
    if (!dietTagsWrap) {
      throw new Error("dietTagsWrap not found on page");
    }
    this._dietTagsWrap = dietTagsWrap;

    const mealTypeTagsWrap = document.querySelector<HTMLDivElement>(
      ".recipe-search__category--meal",
    );
    if (!mealTypeTagsWrap) {
      throw new Error("mealTypeTagsWrap not found on page");
    }
    this._mealTypeTagsWrap = mealTypeTagsWrap;
    this._recipeStorage = recipeStorage;
    this._onResults = onResults;

    this._searchField = new SearchField(
      "Recipe search",
      "Search by keywords",
      "Search",
    );
    this._searchField.render(this._inputsWrap, "prepend");

    this._searchField.searchBtn.addEventListener("click", (): void => {
      this.searchRecipes();
    });

    this._searchField.searchInput.addEventListener(
      "keydown",
      (e: KeyboardEvent): void => {
        if (e.key === "Enter") {
          this._searchField.searchBtn.click();
        }
      },
    );

    this._clearButton.addEventListener("click", (): void => {
      this.clearSearch();
      // TODO: clear filters!!!
    });

    this._showFiltersButton.addEventListener("click", (): void => {
      this._showFiltersButton.classList.toggle("open");
      this._categoriesWrap.classList.toggle("open");
    });
  }

  async searchRecipes(): Promise<void> {
    const keyword = this._searchField.searchInput.value;
    if (!keyword) return;

    const results = await this._recipeStorage.getByKeyword(keyword);
    this._onResults(results);
  }

  async clearSearch(): Promise<void> {
    this._searchField.searchInput.value = "";

    const results = await this._recipeStorage.getAll();
    this._onResults(results);
  }

  renderTags() {}
  executeSearch() {}
}
