import { Navigation } from "../components/navigation.js";
import { RecipeStorage } from "../storages/recipeStorage.js";
import { RecipeCard } from "../components/recipeCard.js";
import { Recipe } from "../models/recipe.js";
import { SearchManager } from "../services/searchManager.js";
import { ErrorScreen } from "../components/errorScreen.js";
import { AddToPlanModal } from "../components/addToPlanModal.js";
import { PlannerManager } from "../services/plannerManager.js";
import { FavoritesStorage } from "../storages/favoritesStorage.js";
import { FavoritesManager } from "../services/favoritesManager.js";

const navigation = new Navigation(
  "../index.html",
  "javascript:void(0)",
  "./planner.html",
  "./week-list.html",
  "./favorites.html",
);

navigation.render(document.body);

(async function (): Promise<void> {
  const container = document.querySelector(".recipe-list");
  if (!container) {
    throw new Error("recipe-list container not found");
  }

  const recipeStorage = new RecipeStorage();
  const recipes = await recipeStorage.getAll();
  const favoritesStorage = new FavoritesStorage();
  const favoritesManager = new FavoritesManager(favoritesStorage);

  const renderResults = (recipesToRender: Recipe[]): void => {
    container!.innerHTML = "";

    if (recipesToRender.length === 0) {
      const errorScreen = new ErrorScreen(
        "../src/assets/illustrations/search.svg",
        "No recipes found",
        "Try a different keyword or adjust your filters.",
      );
      errorScreen.render(".recipe-list");
      return;
    }

    const onFavoriteToggle = (r: Recipe): void =>
      favoritesManager.toggleFavorite(r);

    recipesToRender.forEach((recipe) => {
      const isFavorited = favoritesManager.isFavorited(recipe.id);

      const card = new RecipeCard(recipe, isFavorited, onFavoriteToggle);
      card.render(".recipe-list");

      const addToPlanBtn =
        card.cardElement.querySelector<HTMLButtonElement>(".button--plan");
      if (!addToPlanBtn) throw new Error("addToPlanBtn not found on page");

      addToPlanBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        modal.openModal(recipe, Number(recipe.servings));
      });
    });
  };

  renderResults(recipes);

  const searchManager = new SearchManager(recipeStorage, renderResults);

  const modal = new AddToPlanModal(
    "Confirm choice",
    "Choose the days to which you'd like to add the recipe to and confirm the amount of servings. You can later modify them in the planner.",
    (dayIndex: number, recipe: Recipe, servings: number) => {
      const menuManager = PlannerManager.load();
      menuManager.addEntryToDay(dayIndex, recipe, servings);
    },
  );
  modal.render(document.body, "append");
})();
