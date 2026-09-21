import { Recipe } from "../models/recipe.js";
import { RecipeStorage } from "../storages/recipeStorage.js";
import { generateId } from "../utils/generateId.js";
import { isSelectorString } from "../utils/typeGuards.js";

const template = document.createElement("template");
const templateHTML = `
<div class="search">
  <label class="search__label"></label>
  <div class="search__wrap">
    <button class="search__action search__action--search"></button>
    <input class="search__input" />
    <button class="search__action search__action--clear"></button>
  </div>
</div>
`;

template.innerHTML = templateHTML.trim();

export class SearchField {
  private readonly _searchField: HTMLDivElement;
  private readonly _searchLabel: HTMLLabelElement;
  private readonly _searchInput: HTMLInputElement;
  private readonly _searchBtn: HTMLButtonElement;
  private readonly _clearBtn: HTMLButtonElement;
  private readonly _recipeStorage: RecipeStorage;
  private readonly _onResults: (recipes: Recipe[]) => void;

  constructor(
    inputLabel: string,
    placeholderText: string,
    searchBtnAriaLabel: string,
    clearBtnAriaLabel: string,
    recipeStorage: RecipeStorage,
    onResults: (recipes: Recipe[]) => void,
  ) {
    const fragment = template.content.cloneNode(true) as DocumentFragment;

    const searchField = fragment.querySelector<HTMLDivElement>(".search");
    if (!searchField) {
      throw new Error("searchField not found in template");
    }
    this._searchField = searchField;

    const searchLabel =
      this._searchField.querySelector<HTMLLabelElement>(".search__label");
    if (!searchLabel) {
      throw new Error("searchLabel not found in template");
    }
    this._searchLabel = searchLabel;

    const searchInput =
      this._searchField.querySelector<HTMLInputElement>(".search__input");
    if (!searchInput) {
      throw new Error("searchInput not found in template");
    }
    this._searchInput = searchInput;

    const searchBtn = this._searchField.querySelector<HTMLButtonElement>(
      ".search__action--search",
    );
    if (!searchBtn) {
      throw new Error("searchBtn not found in template");
    }
    this._searchBtn = searchBtn;

    const clearBtn = this._searchField.querySelector<HTMLButtonElement>(
      ".search__action--clear",
    );
    if (!clearBtn) {
      throw new Error("clearBtn not found in template");
    }
    this._clearBtn = clearBtn;

    const inputId = generateId("search", 5);
    this._searchLabel.textContent = inputLabel;
    this._searchLabel.setAttribute("for", inputId);
    this._searchInput.id = inputId;
    this._searchInput.placeholder = placeholderText;
    this._searchBtn.setAttribute("aria-label", searchBtnAriaLabel);
    this._clearBtn.setAttribute("aria-label", clearBtnAriaLabel);

    this._recipeStorage = recipeStorage;
    this._onResults = onResults;

    this._searchBtn.addEventListener("click", (): void => {
      this.searchRecipes();
    });

    this._searchInput.addEventListener("keydown", (e: KeyboardEvent): void => {
      if (e.key === "Enter") {
        this._searchBtn.click();
      } else if (e.key === "Escape") {
        this._clearBtn.click();
      }
    });

    this._clearBtn.addEventListener("click", (): void => {
      this.clearSearch();
    });
  }

  render(parentSelector: string): void {
    const parentElement = isSelectorString(parentSelector)
      ? document.querySelector(parentSelector)
      : parentSelector;
    if (!parentElement) {
      throw new Error("parentElement not found in template");
    }
    parentElement.appendChild(this._searchField);
  }

  async searchRecipes(): Promise<void> {
    const keyword = this._searchInput.value;
    if (!keyword) return;

    const results = await this._recipeStorage.getByKeyword(keyword);
    this._onResults(results);
  }

  async clearSearch(): Promise<void> {
    this._searchInput.value = "";

    const results = await this._recipeStorage.getAll();
    this._onResults(results);
  }
}
