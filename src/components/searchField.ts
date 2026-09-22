import { generateId } from "../utils/generateId.js";
import { isSelectorString } from "../utils/typeGuards.js";
import { insertElem } from "../utils/insertElem.js";

const template = document.createElement("template");
const templateHTML = `
<div class="search">
  <label class="search__label"></label>
  <div class="search__wrap">
  <input class="search__input" />
  <button class="search__action"></button>
  </div>
</div>
`;

template.innerHTML = templateHTML.trim();

export class SearchField {
  private readonly _searchField: HTMLDivElement;
  private readonly _searchLabel: HTMLLabelElement;
  private _searchInput: HTMLInputElement;
  private _searchBtn: HTMLButtonElement;

  constructor(
    inputLabel: string,
    placeholderText: string,
    searchBtnAriaLabel: string,
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

    const searchBtn =
      this._searchField.querySelector<HTMLButtonElement>(".search__action");
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
  }

  get searchBtn() {
    return this._searchBtn;
  }

  get searchInput() {
    return this._searchInput;
  }

  render(parentSelector: string | HTMLElement, position: string): void {
    const parentElement = isSelectorString(parentSelector)
      ? document.querySelector<HTMLElement>(parentSelector)
      : parentSelector;
    if (!parentElement) {
      throw new Error("parentElement not found in template");
    }

    insertElem(position, this._searchField, parentElement);
  }
}
