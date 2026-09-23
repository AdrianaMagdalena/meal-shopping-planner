import { AmountInput } from "./amountInput.js";
export const renderRecipePreview = async (recipe, foodsStorage) => {
    const preview = document.querySelector(".recipe-preview");
    if (!preview) {
        throw new Error("preview not found on page");
    }
    const recipeImage = preview.querySelector(".recipe-preview__image");
    if (!recipeImage) {
        throw new Error("recipeImage not found on page");
    }
    const addToFavBtn = preview.querySelector(".button--favorites");
    if (!addToFavBtn) {
        throw new Error("addToFavBtn not found on page");
    }
    const recipeTitle = preview.querySelector("h1");
    if (!recipeTitle) {
        throw new Error("recipeTitle not found on page");
    }
    const timeInfoWrap = preview.querySelector(".info__times");
    if (!timeInfoWrap) {
        throw new Error("timeInfoWrap not found on page");
    }
    const dietTagsWrap = preview.querySelector(".info__diet-tags");
    if (!dietTagsWrap) {
        throw new Error("dietTagsWrap not found on page");
    }
    const mealTagsWrap = preview.querySelector(".info__meal-tags");
    if (!mealTagsWrap) {
        throw new Error("mealTagsWrap not found on page");
    }
    const ingredientsWrap = preview.querySelector(".ingredients__wrap");
    if (!ingredientsWrap) {
        throw new Error("ingredientsWrap not found on page");
    }
    const stepsWrap = preview.querySelector(".steps__wrap");
    if (!stepsWrap) {
        throw new Error("stepsWrap not found on page");
    }
    recipeImage.src = `../src/assets/illustrations/recipes/${recipe.id}.png`;
    recipeTitle.textContent = recipe.title;
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
    recipe.dietTags.forEach((t) => {
        const tag = document.createElement("p");
        tag.classList.add("info__tag");
        tag.textContent = t;
        dietTagsWrap.appendChild(tag);
    });
    recipe.mealTypeTags.forEach((t) => {
        const tag = document.createElement("p");
        tag.classList.add("info__tag");
        tag.textContent = t;
        mealTagsWrap.appendChild(tag);
    });
    /*if (recipe.servingsInfo) {
        const info = document.createElement("p");
        info.classList.add("info__servings-info");
        info.textContent = `Servings info: ${recipe.servingsInfo}`;
        servingsInputWrap..before(info);
      }*/
    for (const p of recipe.parts) {
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
        for (const i of p.ingredients) {
            const food = await foodsStorage.getById(i.id);
            const ingredient = document.createElement("li");
            const foodName = food ? food.name : "Unknown ingredient";
            const foodUnit = food ? food.unit : "";
            ingredient.textContent = `${i.quantity} ${foodUnit} ${foodName}`;
            if (i.optional) {
                ingredient.textContent += ` (optional)`;
            }
            ingrPartList.appendChild(ingredient);
        }
        const stepsPartList = document.createElement("ol");
        p.steps.forEach((s) => {
            const step = document.createElement("li");
            step.textContent = s;
            stepsPartList.appendChild(step);
        });
        ingrPart.appendChild(ingrPartList);
        stepsPart.appendChild(stepsPartList);
        ingredientsWrap.appendChild(ingrPart);
        stepsWrap.appendChild(stepsPart);
    }
};
export class RecipePreview {
    constructor(obj, foodStorage) {
        this._recipe = obj;
        this._foodStorage = foodStorage;
        const servingsInputWrap = document.querySelector(".info__servings-amount");
        if (!servingsInputWrap) {
            throw new Error("servingsInputWrap not found on page");
        }
        this._servingsInputWrap = servingsInputWrap;
        const inputStartValue = String(obj.servings);
        const amountInput = new AmountInput("info__servings-input", "numeric", "[0-9]*", inputStartValue, "", "Servings amount", "", "Remove amout of servings", "Add amount of servings");
        this._amountInput = amountInput;
        amountInput.render(this._servingsInputWrap, "prepend");
    }
}
