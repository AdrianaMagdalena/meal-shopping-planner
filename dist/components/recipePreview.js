import { AmountInput } from "./amountInput.js";
const renderBasicInfo = (preview, recipe) => {
    const recipeImage = preview.querySelector(".recipe-preview__image");
    if (!recipeImage)
        throw new Error("recipeImage not found on page");
    const recipeTitle = preview.querySelector("h1");
    if (!recipeTitle)
        throw new Error("recipeTitle not found on page");
    recipeImage.src = `../src/assets/illustrations/recipes/${recipe.id}.png`;
    recipeTitle.textContent = recipe.title;
    const addToFavBtn = preview.querySelector(".button--favorites");
    if (!addToFavBtn)
        throw new Error("addToFavBtn not found on page");
};
const renderTimeInfo = (preview, recipe) => {
    const timeInfoWrap = preview.querySelector(".info__times");
    if (!timeInfoWrap)
        throw new Error("timeInfoWrap not found on page");
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
const renderTags = (preview, recipe) => {
    const dietTagsWrap = preview.querySelector(".info__diet-tags");
    if (!dietTagsWrap)
        throw new Error("dietTagsWrap not found on page");
    const mealTagsWrap = preview.querySelector(".info__meal-tags");
    if (!mealTagsWrap)
        throw new Error("mealTagsWrap not found on page");
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
};
const renderServingsAdjuster = (preview, recipe) => {
    const servingsInputWrap = preview.querySelector(".info__servings-amount");
    if (!servingsInputWrap)
        throw new Error("servingsInputWrap not found on page");
    if (recipe.servingInfo) {
        const info = document.createElement("p");
        info.classList.add("info__servings-info");
        info.textContent = `Servings info: ${recipe.servingInfo}`;
        servingsInputWrap.before(info);
    }
    const inputStartValue = String(recipe.servings);
    const amountInput = new AmountInput("info__servings-input", "numeric", "[0-9]*", inputStartValue, "", "Servings amount", "", "Remove amout of servings", "Add amount of servings");
    amountInput.render(servingsInputWrap, "prepend");
    const servingsInput = preview.querySelector(".info__servings-input");
    if (!servingsInput)
        throw new Error("servingsInput not found on page");
};
const renderIngredientList = async (preview, recipe, foodStorage) => {
    const ingredientsWrap = preview.querySelector(".ingredients__wrap");
    if (!ingredientsWrap)
        throw new Error("ingredientsWrap not found on page");
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
            const ingrAmount = document.createElement("span");
            const ingrName = document.createElement("span");
            ingrAmount.classList.add("ingredients__ingr-amount");
            ingrAmount.textContent = `${i.quantity} ${foodUnit}`;
            ingrName.textContent = ` ${foodName.toLowerCase()}`;
            if (i.optional) {
                ingrName.textContent += ` (optional)`;
            }
            ingredient.appendChild(ingrAmount);
            ingredient.appendChild(ingrName);
            ingrPartList.appendChild(ingredient);
        }
        ingrPart.appendChild(ingrPartList);
        ingredientsWrap.appendChild(ingrPart);
    }
};
const renderSteps = async (preview, recipe) => {
    const stepsWrap = preview.querySelector(".steps__wrap");
    if (!stepsWrap)
        throw new Error("stepsWrap not found on page");
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
export const renderRecipePreview = async (recipe, foodStorage) => {
    const preview = document.querySelector(".recipe-preview");
    if (!preview)
        throw new Error("preview not found on page");
    renderBasicInfo(preview, recipe);
    renderTimeInfo(preview, recipe);
    renderTags(preview, recipe);
    renderServingsAdjuster(preview, recipe);
    renderIngredientList(preview, recipe, foodStorage);
    renderSteps(preview, recipe);
};
