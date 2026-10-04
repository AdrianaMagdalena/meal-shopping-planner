import { AddToPlanModal } from "../components/addToPlanModal.js";
import { FavoritesListComponent } from "../components/favorites/favoritesListComponent.js";
import { Navigation } from "../components/navigation.js";
import { FavoritesManager } from "../services/favoritesManager.js";
import { removeLoader } from "../utils/removeLoader.js";
import { PlannerManager } from "../services/plannerManager.js";
import { FavoritesStorage } from "../storages/favoritesStorage.js";
import { RecipeStorage } from "../storages/recipeStorage.js";
import { delay } from "../utils/delay.js";
const navigation = new Navigation("../index.html", "./search.html", "./planner.html", "./week-list.html", "javascript:void(0)");
(async () => {
    try {
        navigation.render(document.body);
        const recipeStorage = new RecipeStorage();
        const favoritesStorage = new FavoritesStorage();
        const favoritesManager = new FavoritesManager(favoritesStorage);
        const modal = new AddToPlanModal("Confirm choice", "Choose the days to which you'd like to add the recipe to and confirm the amount of servings. You can later modify them in the planner.", (dayIndex, recipe, servings) => {
            const plannerManager = PlannerManager.load();
            plannerManager.addEntryToDay(dayIndex, recipe, servings);
        });
        modal.render(document.body, "append");
        const renderFavoriteList = () => {
            const oldFavoritesList = document.querySelector(".favorites-list__list");
            oldFavoritesList?.remove();
            const allFavorites = favoritesStorage.getAllFavorites();
            const favoritesList = new FavoritesListComponent(allFavorites, onRemove, onAddToPlan);
            favoritesList.render("main");
        };
        const onRemove = (recipeId) => {
            favoritesManager.removeFavorite(recipeId);
            renderFavoriteList();
        };
        const onAddToPlan = async (recipeId) => {
            const recipe = await recipeStorage.getById(recipeId);
            if (!recipe)
                return;
            modal.openModal(recipe, recipe.servings);
        };
        renderFavoriteList();
        await delay(600);
    }
    finally {
        removeLoader();
    }
})();
