import { RecipeCard } from "../components/recipeCard.js";
import { RecipeStorage } from "../storages/recipeStorage.js";
import { Navigation } from "../components/common/navigation.js";
const navigation = new Navigation("../index.html", "javascript:void(0)", "javascript:void(0)", "javascript:void(0)");
navigation.render(document.body);
(async function () {
    const container = document.querySelector(".recipe-list");
    if (!container) {
        throw new Error("recipe-list container not found");
    }
    const recipeStorage = new RecipeStorage();
    const recipes = await recipeStorage.getAll();
    recipes.forEach((recipe) => {
        const card = new RecipeCard(recipe);
        card.render(".recipe-list");
    });
})();
