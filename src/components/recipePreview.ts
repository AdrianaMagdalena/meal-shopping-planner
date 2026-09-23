import { Recipe } from "../models/recipe.js";
import { AmountInput } from "./amountInput.js";
import { isSelectorString } from "../utils/typeGuards.js";
import { insertElem } from "../utils/insertElem.js";

export class RecipePreview {
  private readonly _preview: HTMLDivElement;
  private readonly _recipeImage: HTMLImageElement;
  private readonly _addToFavBtn: HTMLButtonElement;
  private readonly _recipeTitle: HTMLHeadingElement;
  private readonly _timeInfoWrap: HTMLDivElement;
  private readonly _dietTagsWrap: HTMLDivElement;
  private readonly _mealTagsWrap: HTMLDivElement;
  private readonly _servingsInputWrap: HTMLDivElement;
  private readonly _ingredientsWrap: HTMLDivElement;
  private readonly _stepsWrap: HTMLDivElement;

  constructor(obj: Recipe) {
    const preview = document.querySelector<HTMLDivElement>(".recipe-preview");
    if (!preview) {
      throw new Error("preview not found on page");
    }
    this._preview = preview;

    const recipeImage = this._preview.querySelector<HTMLImageElement>(
      ".recipe-preview__image",
    );
    if (!recipeImage) {
      throw new Error("recipeImage not found on page");
    }
    this._recipeImage = recipeImage;

    const addToFavBtn =
      this._preview.querySelector<HTMLButtonElement>(".button--favorites");
    if (!addToFavBtn) {
      throw new Error("addToFavBtn not found on page");
    }
    this._addToFavBtn = addToFavBtn;

    const recipeTitle = this._preview.querySelector<HTMLDivElement>("h1");
    if (!recipeTitle) {
      throw new Error("recipeTitle not found on page");
    }
    this._recipeTitle = recipeTitle;

    const timeInfoWrap =
      this._preview.querySelector<HTMLDivElement>(".info__times");
    if (!timeInfoWrap) {
      throw new Error("timeInfoWrap not found on page");
    }
    this._timeInfoWrap = timeInfoWrap;

    const dietTagsWrap =
      this._preview.querySelector<HTMLDivElement>(".info__diet-tags");
    if (!dietTagsWrap) {
      throw new Error("dietTagsWrap not found on page");
    }
    this._dietTagsWrap = dietTagsWrap;

    const mealTagsWrap =
      this._preview.querySelector<HTMLDivElement>(".info__meal-tags");
    if (!mealTagsWrap) {
      throw new Error("mealTagsWrap not found on page");
    }
    this._mealTagsWrap = mealTagsWrap;

    const servingsInputWrap = this._preview.querySelector<HTMLDivElement>(
      ".info__servings-amount",
    );
    if (!servingsInputWrap) {
      throw new Error("servingsInputWrap not found on page");
    }
    this._servingsInputWrap = servingsInputWrap;

    const ingredientsWrap =
      this._preview.querySelector<HTMLDivElement>(".ingredients__wrap");
    if (!ingredientsWrap) {
      throw new Error("ingredientsWrap not found on page");
    }
    this._ingredientsWrap = ingredientsWrap;

    const stepsWrap =
      this._preview.querySelector<HTMLDivElement>(".steps__wrap");
    if (!stepsWrap) {
      throw new Error("stepsWrap not found on page");
    }
    this._stepsWrap = stepsWrap;

    this._recipeImage.src = `../src/assets/illustrations/recipes/${obj.id}.png`;
    this._recipeTitle.textContent = obj.title;

    if (obj.preparationTime) {
      const prepTime = document.createElement("p");
      prepTime.classList.add("info__prep-time");
      prepTime.textContent = `Prep: ${obj.preparationTime} min`;
      this._timeInfoWrap.appendChild(prepTime);
    }

    if (obj.cookTime) {
      const cookTime = document.createElement("p");
      cookTime.classList.add("info__cook-time");
      cookTime.textContent = `Cooking: ${obj.cookTime} min`;
      this._timeInfoWrap.appendChild(cookTime);
    }

    obj.dietTags.forEach((t) => {
      const tag = document.createElement("p");
      tag.classList.add("info__tag");
      tag.textContent = t;
      this._dietTagsWrap.appendChild(tag);
    });

    obj.mealTypeTags.forEach((t) => {
      const tag = document.createElement("p");
      tag.classList.add("info__tag");
      tag.textContent = t;
      this._mealTagsWrap.appendChild(tag);
    });

    /*if (obj.servingsInfo) {
      const info = document.createElement("p");
      info.classList.add("info__servings-info");
      info.textContent = `Servings info: ${obj.servingsInfo}`;
      this._servingsInputWrap..before(info);
    }*/

    const inputStartValue = String(obj.servings);
    const amountInput = new AmountInput(
      "info__servings-input",
      "numeric",
      "[0-9]*",
      inputStartValue,
      "",
      "Servings amount",
      "",
      "Remove amout of servings",
      "Add amount of servings",
    );
    amountInput.render(this._servingsInputWrap, "prepend");

    obj.parts.forEach((p) => {
      const ingrPart = document.createElement("div");
      ingrPart.classList.add("ingredients__part");
      const stepsPart = document.createElement("div");

      if (p.title) {
        const ingrTitle = document.createElement("h3");
        const stepTitle = document.createElement("h3");
        ingrTitle.textContent = p.title;
        stepTitle.textContent = p.title;
        ingrPart.appendChild(ingrTitle);
        stepsPart.appendChild(stepTitle);
      }

      const ingrPartList = document.createElement("ul");

      p.ingredients.forEach((i) => {
        const ingredient = document.createElement("li");
        ingredient.textContent = `${i.quantity} unit ${i.id}`;

        if (i.optional) {
          ingredient.textContent += ` (optional)`;
        }

        ingrPartList.appendChild(ingredient);
      });

      const stepsPartList = document.createElement("ol");

      p.steps.forEach((s) => {
        const step = document.createElement("li");
        step.textContent = s;

        stepsPartList.appendChild(step);
      });

      ingrPart.appendChild(ingrPartList);
      stepsPart.appendChild(stepsPartList);

      this._ingredientsWrap.appendChild(ingrPart);
      this._stepsWrap.appendChild(stepsPart);
    });
  }

  render(parentSelector: string | HTMLElement, position: string): void {
    const parentElement = isSelectorString(parentSelector)
      ? document.querySelector<HTMLElement>(parentSelector)
      : parentSelector;
    if (!parentElement) {
      throw new Error("parentElement not found in template");
    }

    insertElem(position, this._preview, parentElement);
  }
}
