import { Recipe } from "../models/recipe.js";
import { AmountInput } from "./amountInput.js";
import { FoodStorage } from "../storages/foodStorage.js";

const renderBasicInfo = (preview: HTMLElement, recipe: Recipe): void => {
  const recipeImage = preview.querySelector<HTMLImageElement>(
    ".recipe-preview__image",
  );
  if (!recipeImage) throw new Error("recipeImage not found on page");

  const recipeTitle = preview.querySelector<HTMLDivElement>("h1");
  if (!recipeTitle) throw new Error("recipeTitle not found on page");

  recipeImage.src = `../src/assets/illustrations/recipes/${recipe.id}.png`;
  recipeTitle.textContent = recipe.title;

  const addToFavBtn =
    preview.querySelector<HTMLButtonElement>(".button--favorites");
  if (!addToFavBtn) throw new Error("addToFavBtn not found on page");
};

const renderTimeInfo = (preview: HTMLElement, recipe: Recipe): void => {
  const timeInfoWrap = preview.querySelector<HTMLDivElement>(".info__times");
  if (!timeInfoWrap) throw new Error("timeInfoWrap not found on page");

  if (recipe.preparationTime) {
    const prepTime = document.createElement("p");
    prepTime.classList.add("info__prep-time");
    prepTime.textContent = `Prep: ${recipe.preparationTime} min`;
    timeInfoWrap.appendChild(prepTime);
  }

  if (recipe.cookTime) {
    const cookTime = document.createElement("p");
    cookTime.classList.add("info__cook-time");
    cookTime.textContent = `Cooking: ${recipe.cookTime} min`;
    timeInfoWrap.appendChild(cookTime);
  }
};

const renderTags = (preview: HTMLElement, recipe: Recipe) => {
  const dietTagsWrap =
    preview.querySelector<HTMLDivElement>(".info__diet-tags");
  if (!dietTagsWrap) throw new Error("dietTagsWrap not found on page");

  const mealTagsWrap =
    preview.querySelector<HTMLDivElement>(".info__meal-tags");
  if (!mealTagsWrap) throw new Error("mealTagsWrap not found on page");

  recipe.dietTags.forEach((t) => {
    const tag = document.createElement("p");
    tag.classList.add("tag");
    tag.textContent = t;
    dietTagsWrap.appendChild(tag);
  });

  recipe.mealTypeTags.forEach((t) => {
    const tag = document.createElement("p");
    tag.classList.add("tag");
    tag.textContent = t;
    mealTagsWrap.appendChild(tag);
  });
};

const renderServingsAdjuster = (
  preview: HTMLElement,
  recipe: Recipe,
): AmountInput => {
  const servingsInputWrap = preview.querySelector<HTMLDivElement>(
    ".info__servings-amount",
  );
  if (!servingsInputWrap)
    throw new Error("servingsInputWrap not found on page");

  if (recipe.servingInfo) {
    const info = document.createElement("p");
    info.classList.add("info__servings-info");
    info.textContent = `Servings info: ${recipe.servingInfo}`;
    servingsInputWrap.before(info);
  }

  const inputStartValue = String(recipe.servings);
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
  amountInput.render(servingsInputWrap, "prepend");

  const servingsInput = amountInput.inputInput;
  if (!servingsInput) throw new Error("servingsInput not found on page");

  const addToPlanBtn =
    document.querySelector<HTMLButtonElement>(".button--plan");
  if (!addToPlanBtn) throw new Error("addToPlanBtn not found on page");

  return amountInput;
};

const renderIngredientList = async (
  preview: HTMLElement,
  recipe: Recipe,
  foodStorage: FoodStorage,
) => {
  const ingredientsWrap =
    preview.querySelector<HTMLDivElement>(".ingredients__wrap");
  if (!ingredientsWrap) throw new Error("ingredientsWrap not found on page");

  for (const p of recipe.parts) {
    const ingrPart = document.createElement("div");
    ingrPart.classList.add("ingredients__part");

    if (p.title) {
      const ingrTitle = document.createElement("h3");
      ingrTitle.textContent = p.title;
      ingrPart.appendChild(ingrTitle);
    }

    const ingrPartList = document.createElement("ul");

    for (const i of p.ingredients) {
      const food = await foodStorage.getById(i.id);
      const foodName = food ? food.name : "Unknown ingredient";
      const foodUnit = food ? food.unit : "";

      const ingredient = document.createElement("li");
      ingredient.dataset.originalAmount = String(i.quantity);

      const ingrAmount = document.createElement("span");
      const ingrUnit = document.createElement("span");
      const ingrName = document.createElement("span");
      ingrAmount.classList.add("ingredients__ingr-amount");
      ingrAmount.textContent = `${i.quantity}`;
      ingrUnit.classList.add("ingredients__ingr-unit");
      ingrUnit.textContent = ` ${foodUnit}`;
      ingrName.textContent = ` ${foodName.toLowerCase()}`;

      if (i.optional) {
        ingrName.textContent += ` (optional)`;
      }

      ingredient.appendChild(ingrAmount);
      ingredient.appendChild(ingrUnit);
      ingredient.appendChild(ingrName);
      ingrPartList.appendChild(ingredient);
    }

    ingrPart.appendChild(ingrPartList);
    ingredientsWrap.appendChild(ingrPart);
  }
};

const renderSteps = async (preview: HTMLElement, recipe: Recipe) => {
  const stepsWrap = preview.querySelector<HTMLDivElement>(".steps__wrap");
  if (!stepsWrap) throw new Error("stepsWrap not found on page");

  for (const p of recipe.parts) {
    const stepsPart = document.createElement("div");

    if (p.title) {
      const stepTitle = document.createElement("h3");
      stepTitle.textContent = p.title;
      stepsPart.appendChild(stepTitle);
    }

    const stepsPartList = document.createElement("ol");

    p.steps.forEach((s) => {
      const step = document.createElement("li");
      step.textContent = s;

      stepsPartList.appendChild(step);
    });

    stepsPart.appendChild(stepsPartList);
    stepsWrap.appendChild(stepsPart);
  }
};

export const renderRecipePreview = async (
  recipe: Recipe,
  foodStorage: FoodStorage,
): Promise<{ amountInput: AmountInput; previewElement: HTMLDivElement }> => {
  const preview = document.querySelector<HTMLDivElement>(".recipe-preview");
  if (!preview) throw new Error("preview not found on page");

  renderBasicInfo(preview, recipe);
  renderTimeInfo(preview, recipe);
  renderTags(preview, recipe);
  const amountInput = renderServingsAdjuster(preview, recipe);
  await renderIngredientList(preview, recipe, foodStorage);
  renderSteps(preview, recipe);

  return { amountInput, previewElement: preview };
};
