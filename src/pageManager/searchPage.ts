import { Navigation } from "../components/common/navigation.js";
import { RecipeStorage } from "../storages/recipeStorage.js";
import { RecipeCard } from "../components/recipeCard.js";
import { SearchField } from "../components/searchField.js";
import { Recipe } from "../models/recipe.js";

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

    recipesToRender.forEach((recipe) => {
      const card = new RecipeCard(recipe);
      card.render(".recipe-list");
    });
  };

  renderResults(recipes);
  const searchField = new SearchField(
    "Recipe search",
    "Search by keywords",
    "Search",
    "Clear search field",
    recipeStorage,
    renderResults,
  );
  searchField.render(".recipe-search");
})();
