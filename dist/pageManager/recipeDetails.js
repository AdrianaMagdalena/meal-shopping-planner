import { FoodStorage } from "../storages/foodStorage.js";
import { RecipeStorage } from "../storages/recipeStorage.js";
import { Navigation } from "../components/navigation.js";
import { ErrorScreen } from "../components/errorScreen.js";
import { renderRecipePreview } from "../components/recipePreview.js";
const navigation = new Navigation("../index.html", "./search.html", "./weekly-menu.html", "javascript:void(0)");
navigation.render(document.body);
(async () => {
    const params = new URLSearchParams(window.location.search);
    const recipeId = params.get("id");
    if (!recipeId) {
        throw new Error("No recipe ID in URL");
    }
    const foodStorage = new FoodStorage();
    const recipeStorage = new RecipeStorage();
    const recipe = await recipeStorage.getById(recipeId);
    if (!recipe) {
        const errorScreen = new ErrorScreen("../src/assets/illustrations/no-results.png", "The recipe was not found");
        errorScreen.render(".main");
    }
    else {
        await renderRecipePreview(recipe, foodStorage);
        // TODO: insert amount manager here
    }
})();
