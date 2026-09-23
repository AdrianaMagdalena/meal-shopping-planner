import { Navigation } from "../components/common/navigation.js";
import { RecipeStorage } from "../storages/recipeStorage.js";
import { ErrorScreen } from "../components/errorScreen.js";

const navigation = new Navigation(
  "../index.html",
  "./search.html",
  "javascript:void(0)",
  "javascript:void(0)",
);
navigation.render(document.body);

(async () => {
  const params = new URLSearchParams(window.location.search);
  const recipeId = params.get("id");

  if (!recipeId) {
    throw new Error("No recipe ID in URL");
  }

  const recipeStorage = new RecipeStorage();
  const recipe = await recipeStorage.getById(recipeId);

  if (!recipe) {
    const errorScreen = new ErrorScreen(
      "../src/assets/illustrations/no-results.png",
      "The recipe was not found",
    );
    errorScreen.render(".recipe-preview");
  }

  // render the recipe here
})();
