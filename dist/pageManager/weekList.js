import { ErrorScreen } from "../components/errorScreen.js";
import { Navigation } from "../components/navigation.js";
import { ShoppingList } from "../components/shoppingList.js";
import { WeekRecipeList } from "../components/weekRecipeList.js";
import { SHOPPING_LIST_STORAGE_KEY } from "../services/plannerManager.js";
import { FoodStorage } from "../storages/foodStorage.js";
import { RecipeStorage } from "../storages/recipeStorage.js";
import { isSavedPlannerEntry } from "../utils/typeGuards.js";
const navigation = new Navigation("../index.html", "./search.html", "./planner.html", "javascript:void(0)", "./favorites.html");
navigation.render(document.body);
const rawData = localStorage.getItem(SHOPPING_LIST_STORAGE_KEY);
if (!rawData) {
    if (!document.querySelector(".error-screen")) {
        const errorScreen = new ErrorScreen("../src/assets/illustrations/search.svg", "No plan saved!", "Finalize the weekly meal plan to generate a shopping list");
        errorScreen.render("main");
    }
}
const parsedData = JSON.parse(rawData ?? "[]");
if (!Array.isArray(parsedData)) {
    throw new TypeError("Invalid format of saved shopping list entries");
}
const savedEntries = parsedData.filter(isSavedPlannerEntry);
const getDataFromRecipe = async (recipe, foodStorage, items, ratio) => {
    for (const part of recipe.parts) {
        for (const ingredient of part.ingredients) {
            const food = await foodStorage.getById(ingredient.id);
            const name = food ? food.name : "Unknown ingredient";
            const unit = food ? food.unit : "";
            const quantity = ingredient.quantity * ratio;
            items.push({ name, unit, quantity });
        }
    }
};
const buildShoppingItems = async (savedEntries, recipeStorage, foodStorage) => {
    const items = [];
    for (const entry of savedEntries) {
        const recipe = await recipeStorage.getById(entry.recipeId);
        if (!recipe)
            continue;
        const ratio = entry.servingsAmount / recipe.servings;
        await getDataFromRecipe(recipe, foodStorage, items, ratio);
    }
    return items;
};
(async () => {
    const foodStorage = new FoodStorage();
    const recipeStorage = new RecipeStorage();
    const allRecipes = await recipeStorage.getAll();
    if (allRecipes.length === 0) {
        const errorScreen = new ErrorScreen("../src/assets/illustrations/search.svg", "No recipes found");
        errorScreen.render("main");
    }
    else {
        const rawData = localStorage.getItem(SHOPPING_LIST_STORAGE_KEY);
        const parsedData = JSON.parse(rawData ?? "[]");
        if (!Array.isArray(parsedData)) {
            throw new TypeError("Invalid format of saved shopping list entries!");
        }
        const savedEntries = parsedData.filter(isSavedPlannerEntry);
        const shoppingItems = await buildShoppingItems(savedEntries, recipeStorage, foodStorage);
        const shoppingList = new ShoppingList();
        shoppingList.renderList(shoppingItems);
    }
})();
const weekRecipeList = new WeekRecipeList();
