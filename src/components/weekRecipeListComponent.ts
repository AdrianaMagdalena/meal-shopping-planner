import {
  DROPDOWN_STORAGE_KEY,
  SHOPPING_LIST_STORAGE_KEY,
  WEEK_RECIPES_STORAGE_KEY,
} from "../utils/constants.js";
import { insertElem } from "../utils/insertElem.js";
import { isSavedPlannerEntry, isSelectorString } from "../utils/typeGuards.js";
import { ErrorScreenComponent } from "./errorScreenComponent.js";
import { ShoppingListComponent } from "./shopping/shoppingListComponent.js";

const template = document.createElement("template");
const templateHtml = `
<div class="weekly-list__container">
  <button class="delete-week-data__button button button--sec button--icon-before button--clear">Remove week's data</button>
  <div class="weekly-list__recipe-list">
      <div class="weekly-list__header-wrap">
          <h2>This week's recipes</h2>
          <button class="weekly-list__button button button--prim      button--icon-only button--show-recipes button--mini"></button>
      </div>
      <div class="weekly-list__wrap">
          <ul></ul>
      </div>
  </div>
</div>
`;
template.innerHTML = templateHtml.trim();

export class WeekRecipeListComponent {
  private readonly _weeklyListCont: HTMLDivElement;
  private readonly _removeWeekDataBtn: HTMLButtonElement;
  private readonly _dropdownButton: HTMLButtonElement;
  private readonly _recipeListWrap: HTMLDivElement;
  private readonly _recipeList: HTMLUListElement;

  constructor(onRemove: () => void) {
    const fragment = template.content.cloneNode(true) as DocumentFragment;

    const weeklyListCont = fragment.querySelector<HTMLDivElement>(
      ".weekly-list__container",
    );
    if (!weeklyListCont)
      throw new Error("weeklyListCont not found on template");
    this._weeklyListCont = weeklyListCont;

    const removeWeekDataBtn =
      this._weeklyListCont.querySelector<HTMLButtonElement>(
        ".delete-week-data__button",
      );
    if (!removeWeekDataBtn)
      throw new Error("removeWeekDataBtn not found on template");
    this._removeWeekDataBtn = removeWeekDataBtn;

    const dropdownButton =
      this._weeklyListCont.querySelector<HTMLButtonElement>(
        ".weekly-list__button",
      );
    if (!dropdownButton) throw new Error("dropdownButto not found on template");
    this._dropdownButton = dropdownButton;

    const recipeListWrap =
      this._weeklyListCont.querySelector<HTMLDivElement>(".weekly-list__wrap");
    if (!recipeListWrap) throw new Error("recipeListWrap not found on page");
    this._recipeListWrap = recipeListWrap;

    const recipeList =
      this._weeklyListCont.querySelector<HTMLUListElement>("ul");
    if (!recipeList) throw new Error("recipeList not found on template");
    this._recipeList = recipeList;

    this._removeWeekDataBtn.addEventListener("click", () => {
      onRemove();
    });

    this.handleDropdownState();
    this.generateWeekListData();
  }

  get weeklyListCont() {
    return this._weeklyListCont;
  }

  render(parentSelector: string | HTMLElement, position: string): void {
    const parentElement = isSelectorString(parentSelector)
      ? document.querySelector<HTMLElement>(parentSelector)
      : parentSelector;
    if (!parentElement) {
      throw new Error("parentElement not found in template");
    }

    insertElem(position, this._weeklyListCont, parentElement);
  }

  generateWeekListData() {
    this._recipeList.innerHTML = "";

    const rawData = localStorage.getItem(WEEK_RECIPES_STORAGE_KEY);
    if (!rawData) {
      const errorScreen = new ErrorScreenComponent(
        "../src/assets/illustrations/search.svg",
        "No recipe list to display!",
        "Finalize your weekly meal plan to generate a new recipe list",
      );
      errorScreen.render("main");
      return;
    }

    const parsedData: unknown = JSON.parse(rawData);
    if (!Array.isArray(parsedData)) {
      throw new TypeError("Invalid format of saved weekly recipe list!");
    }

    const validData = parsedData.filter(isSavedPlannerEntry);
    if (validData.length === 0) return;
    validData.forEach((d) => {
      const listItem = document.createElement("li");
      const anchorLink = document.createElement("a");

      anchorLink.textContent = d.recipeTitle;
      anchorLink.href = `./recipe-details.html?id=${d.recipeId}`;
      listItem.appendChild(anchorLink);
      this._recipeList.appendChild(listItem);
    });

    this.render("main", "append");
  }

  handleDropdownState() {
    let isDropdownOpen: string;
    const stateData = localStorage.getItem(DROPDOWN_STORAGE_KEY);
    if (!stateData) {
      isDropdownOpen = this._recipeListWrap.classList.contains("open")
        ? "open"
        : "closed";
      localStorage.setItem(DROPDOWN_STORAGE_KEY, isDropdownOpen);
    } else {
      isDropdownOpen = stateData;
      if (isDropdownOpen === "open") {
        this._recipeListWrap.classList.add("open");
        this._dropdownButton.classList.add("open");
        isDropdownOpen = "closed";
      } else {
        this._recipeListWrap.classList.remove("open");
        this._dropdownButton.classList.remove("open");
        isDropdownOpen = "open";
      }
    }

    this._dropdownButton.addEventListener("click", () => {
      isDropdownOpen = localStorage.getItem(DROPDOWN_STORAGE_KEY)!;
      if (isDropdownOpen === "open") {
        this._recipeListWrap.classList.remove("open");
        this._dropdownButton.classList.remove("open");
        isDropdownOpen = "closed";
      } else {
        this._recipeListWrap.classList.add("open");
        this._dropdownButton.classList.add("open");
        isDropdownOpen = "open";
      }
      localStorage.setItem(DROPDOWN_STORAGE_KEY, isDropdownOpen);
    });
  }
}
