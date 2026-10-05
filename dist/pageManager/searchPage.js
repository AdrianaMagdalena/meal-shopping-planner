import { NavigationComponent } from "../components/navigationComponent.js";
import { RecipeStorage } from "../storages/recipeStorage.js";
import { RecipeCardComponent } from "../components/recipeCardComponent.js";
import { SearchManager } from "../services/searchManager.js";
import { ErrorScreenComponent } from "../components/errorScreenComponent.js";
import { AddToPlanModalComponent } from "../components/modals/addToPlanModalComponent.js";
import { PlannerManager } from "../services/plannerManager.js";
import { FavoritesStorage } from "../storages/favoritesStorage.js";
import { FavoritesManager } from "../services/favoritesManager.js";
import { delay } from "../utils/delay.js";
import { removeLoader } from "../utils/removeLoader.js";
const navigation = new NavigationComponent("../index.html", "javascript:void(0)", "./planner.html", "./week-list.html", "./favorites.html");
(async () => {
    try {
        navigation.render(document.body);
        const container = document.querySelector(".recipe-list");
        if (!container) {
            throw new Error("recipe-list container not found");
        }
        const recipeStorage = new RecipeStorage();
        const [recipes] = await Promise.all([recipeStorage.getAll(), delay(600)]);
        const favoritesStorage = new FavoritesStorage();
        const favoritesManager = new FavoritesManager(favoritesStorage);
        const renderResults = (recipesToRender) => {
            container.innerHTML = "";
            if (recipesToRender.length === 0) {
                const errorScreen = new ErrorScreenComponent("../src/assets/illustrations/search.svg", "No recipes found", "Try a different keyword or adjust your filters.");
                errorScreen.render(".recipe-list");
                return;
            }
            const onFavoriteToggle = (r) => favoritesManager.toggleFavorite(r);
            recipesToRender.forEach((recipe) => {
                const isFavorited = favoritesManager.isFavorited(recipe.id);
                const card = new RecipeCardComponent(recipe, isFavorited, onFavoriteToggle);
                card.render(".recipe-list");
                const addToPlanBtn = card.cardElement.querySelector(".button--plan");
                if (!addToPlanBtn)
                    throw new Error("addToPlanBtn not found on page");
                addToPlanBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    modal.openModalComponent(recipe, Number(recipe.servings));
                });
            });
        };
        renderResults(recipes);
        const searchManager = new SearchManager(recipeStorage, renderResults);
        const modal = new AddToPlanModalComponent("Confirm choice", "Choose the days to which you'd like to add the recipe to and confirm the amount of servings. You can later modify them in the planner.", (dayIndex, recipe, servings) => {
            const menuManager = PlannerManager.load();
            menuManager.addEntryToDay(dayIndex, recipe, servings);
        });
        modal.render(document.body, "append");
    }
    finally {
        removeLoader();
    }
})();
