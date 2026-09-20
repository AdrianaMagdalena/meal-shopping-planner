import { RecipeCard } from "../components/recipeCard.js";
import { RecipeStorage } from "../storages/recipeStorage.js";

(async function (): Promise<void> {
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
