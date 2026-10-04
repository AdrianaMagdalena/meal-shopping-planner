import { FoodStorage } from "../storages/foodStorage.js";
import { RecipeStorage } from "../storages/recipeStorage.js";
import { Navigation } from "../components/navigation.js";
import { ErrorScreen } from "../components/errorScreen.js";
import { renderRecipePreview } from "../components/recipePreview.js";
import { AddToPlanModal } from "../components/modals/addToPlanModal.js";
import { PlannerManager } from "../services/plannerManager.js";
import { ServingsManager } from "../services/servingsManager.js";
import { FavoritesStorage } from "../storages/favoritesStorage.js";
import { FavoritesManager } from "../services/favoritesManager.js";
import { delay } from "../utils/delay.js";
import { removeLoader } from "../utils/removeLoader.js";
const navigation = new Navigation("../index.html", "./search.html", "./planner.html", "./week-list.html", "./favorites.html");
(async () => {
    try {
        navigation.render(document.body);
        const params = new URLSearchParams(window.location.search);
        const recipeId = params.get("id");
        if (!recipeId) {
            throw new Error("No recipe ID in URL");
        }
        const foodStorage = new FoodStorage();
        const recipeStorage = new RecipeStorage();
        const [recipe] = await Promise.all([
            recipeStorage.getById(recipeId),
            delay(600),
        ]);
        const favoritesStorage = new FavoritesStorage();
        const favoritesManager = new FavoritesManager(favoritesStorage);
        const onFavoriteToggle = (r) => favoritesManager.toggleFavorite(r);
        if (!recipe) {
            const preview = document.querySelector(".recipe-preview");
            if (preview)
                preview.remove();
            const errorScreen = new ErrorScreen("../src/assets/illustrations/search.svg", "The recipe was not found");
            errorScreen.render("main");
        }
        else {
            const isFavorited = favoritesManager.isFavorited(recipe.id);
            const { amountInput, previewElement } = await renderRecipePreview(recipe, foodStorage, isFavorited, onFavoriteToggle);
            const servingsManager = new ServingsManager(recipe, amountInput, previewElement);
            const modal = new AddToPlanModal("Confirm choice", "Choose the days to which you'd like to add the recipe to and confirm the amount of servings. You can later modify them in the planner.", (dayIndex, recipe, servings) => {
                const menuManager = PlannerManager.load();
                menuManager.addEntryToDay(dayIndex, recipe, servings);
            });
            modal.render(document.body, "append");
            const addToPlanBtn = document.querySelector(".button--plan");
            if (!addToPlanBtn)
                throw new Error("addToPlanBtn not found on page");
            const servingsInput = document.querySelector(".info__servings-input .input__input");
            if (!servingsInput)
                throw new Error("servingsInput not found on page");
            addToPlanBtn?.addEventListener("click", () => {
                const currentServings = servingsInput?.value;
                modal.openModal(recipe, Number(currentServings));
            });
        }
    }
    finally {
        removeLoader();
    }
})();
