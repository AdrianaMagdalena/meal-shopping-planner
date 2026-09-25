import { FoodStorage } from "../storages/foodStorage.js";
import { RecipeStorage } from "../storages/recipeStorage.js";
import { Navigation } from "../components/navigation.js";
import { ErrorScreen } from "../components/errorScreen.js";
import { renderRecipePreview } from "../components/recipePreview.js";
import { AddToPlanModal } from "../components/addToPlanModal.js";
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
        const preview = document.querySelector(".recipe-preview");
        preview.remove();
        const errorScreen = new ErrorScreen("../src/assets/illustrations/no-results.png", "The recipe was not found");
        errorScreen.render("main");
        return;
    }
    await renderRecipePreview(recipe, foodStorage);
    const modal = new AddToPlanModal("Confirm choice", "Choose the days to which you'd like to add the recipe to and confirm the amount of servings. You can later modify them in the planner.", (dayIndex, servings) => {
        // handling recipe local storage
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
    // TODO: insert amount manager here
})();
