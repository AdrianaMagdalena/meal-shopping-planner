import { Navigation } from "../components/common/navigation.js";
import { RecipeStorage } from "../storages/recipeStorage.js";
import { RecipeCard } from "../components/recipeCard.js";
import { SearchManager } from "../services/searchManager.js";
const navigation = new Navigation("../index.html", "javascript:void(0)", "javascript:void(0)", "javascript:void(0)");
navigation.render(document.body);
(async function () {
    const container = document.querySelector(".recipe-list");
    if (!container) {
        throw new Error("recipe-list container not found");
    }
    const recipeStorage = new RecipeStorage();
    const recipes = await recipeStorage.getAll();
    const renderResults = (recipesToRender) => {
        container.innerHTML = "";
        recipesToRender.forEach((recipe) => {
            const card = new RecipeCard(recipe);
            card.render(".recipe-list");
        });
    };
    renderResults(recipes);
    const searchManager = new SearchManager(recipeStorage, renderResults);
})();
