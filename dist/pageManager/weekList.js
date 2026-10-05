import { ErrorScreenComponent } from "../components/errorScreenComponent.js";
import { NavigationComponent } from "../components/navigationComponent.js";
import { ShoppingListComponent } from "../components/shopping/shoppingListComponent.js";
import { WeekRecipeListComponent } from "../components/weekRecipeListComponent.js";
import { SHOPPING_LIST_STORAGE_KEY } from "../utils/constants.js";
import { FoodStorage } from "../storages/foodStorage.js";
import { RecipeStorage } from "../storages/recipeStorage.js";
import { removeLoader } from "../utils/removeLoader.js";
import { delay } from "../utils/delay.js";
import { isSavedPlannerEntry } from "../utils/typeGuards.js";
import { buildShoppingItems } from "../services/shoppingListManager.js";
const navigation = new NavigationComponent("../index.html", "./search.html", "./planner.html", "javascript:void(0)", "./favorites.html");
(async () => {
    try {
        navigation.render(document.body);
        const foodStorage = new FoodStorage();
        const recipeStorage = new RecipeStorage();
        const [allRecipes] = await Promise.all([
            recipeStorage.getAll(),
            delay(600),
        ]);
        if (allRecipes.length === 0) {
            const errorScreen = new ErrorScreenComponent("../src/assets/illustrations/search.svg", "Could not get recipes data", "Please refresh the page or try again later.");
            errorScreen.render("main");
            return;
        }
        const rawData = localStorage.getItem(SHOPPING_LIST_STORAGE_KEY);
        const parsedData = JSON.parse(rawData ?? "[]");
        if (!Array.isArray(parsedData)) {
            throw new TypeError("Invalid format of saved shopping list entries!");
        }
        const savedEntries = parsedData.filter(isSavedPlannerEntry);
        const shoppingItems = await buildShoppingItems(savedEntries, recipeStorage, foodStorage);
        const shoppingList = new ShoppingListComponent();
        shoppingList.render("main", "append");
        shoppingList.renderList(shoppingItems);
        const weekRecipeList = new WeekRecipeListComponent(shoppingList);
    }
    finally {
        removeLoader();
    }
})();
