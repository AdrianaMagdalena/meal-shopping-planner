import { Navigation } from "../components/common/navigation.js";
import { RecipeStorage } from "../storages/recipeStorage.js";
import { RecipeCard } from "../components/recipeCard.js";
import { Recipe } from "../models/recipe.js";
import { SearchManager } from "../services/searchManager.js";
import { ErrorScreen } from "../components/errorScreen.js";

const navigation = new Navigation(
  "../index.html",
  "javascript:void(0)",
  "javascript:void(0)",
  "javascript:void(0)",
);

navigation.render(document.body);

(async function (): Promise<void> {
  const container = document.querySelector(".recipe-list");
  if (!container) {
    throw new Error("recipe-list container not found");
  }

  const recipeStorage = new RecipeStorage();
  const recipes = await recipeStorage.getAll();

  const renderResults = (recipesToRender: Recipe[]): void => {
    container!.innerHTML = "";

    if (recipesToRender.length === 0) {
      const errorScreen = new ErrorScreen(
        "../src/assets/illustrations/no-results.png",
        "No recipes found",
        "Try a different keyword or adjust your filters.",
      );
      errorScreen.render(".recipe-list");
      return;
    }

    recipesToRender.forEach((recipe) => {
      const card = new RecipeCard(recipe);
      card.render(".recipe-list");
    });
  };

  renderResults(recipes);

  const searchManager = new SearchManager(recipeStorage, renderResults);
})();
