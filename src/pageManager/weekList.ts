import { ErrorScreen } from "../components/errorScreen.js";
import { Navigation } from "../components/navigation.js";
import { ShoppingList } from "../components/shoppingList.js";
import { WeekRecipeList } from "../components/weekRecipeList.js";
import { ISavedPlannerEntry } from "../interfaces/iSavedPlanner.js";
import { ISavedShoppingItem } from "../interfaces/iSavedShopping.js";
import { Recipe } from "../models/recipe.js";
import { removeLoader } from "../utils/removeLoader.js";
import { SHOPPING_LIST_STORAGE_KEY } from "../services/plannerManager.js";
import { FoodStorage } from "../storages/foodStorage.js";
import { RecipeStorage } from "../storages/recipeStorage.js";
import { delay } from "../utils/delay.js";
import { roundIngredients } from "../utils/roundIngredients.js";
import { isSavedPlannerEntry } from "../utils/typeGuards.js";

const navigation = new Navigation(
  "../index.html",
  "./search.html",
  "./planner.html",
  "javascript:void(0)",
  "./favorites.html",
);

const getDataFromRecipe = async (
  recipe: Recipe,
  foodStorage: FoodStorage,
  items: ISavedShoppingItem[],
  ratio: number,
) => {
  for (const part of recipe.parts) {
    for (const ingredient of part.ingredients) {
      const food = await foodStorage.getById(ingredient.id);
      const id = food ? food.id : "Unknown";
      const category = food ? food.category : "Unknown category";
      const name = food ? food.name.toLowerCase() : "Unknown ingredient";
      const unit = food ? food.unit : "";
      const quantity = ingredient.quantity * ratio;

      items.push({ id, category, name, unit, quantity });
    }
  }
};

const addItemsQuantities = (
  items: ISavedShoppingItem[],
): ISavedShoppingItem[] => {
  const totals = new Map<string, ISavedShoppingItem>();

  items.forEach((item) => {
    const key = item.id;
    if (totals.has(key)) {
      totals.get(key)!.quantity += item.quantity;
    } else {
      totals.set(key, { ...item });
    }
  });

  const summarisedData = Array.from(totals.values());

  summarisedData.forEach((item) => {
    item.quantity = roundIngredients(item.quantity);
  });

  return summarisedData;
};

const buildShoppingItems = async (
  savedEntries: ISavedPlannerEntry[],
  recipeStorage: RecipeStorage,
  foodStorage: FoodStorage,
) => {
  let items: ISavedShoppingItem[] = [];

  for (const entry of savedEntries) {
    const recipe = await recipeStorage.getById(entry.recipeId);
    if (!recipe) continue;

    const ratio = entry.servingsAmount / recipe.servings;

    await getDataFromRecipe(recipe, foodStorage, items, ratio);
  }

  items = addItemsQuantities(items);

  return items;
};

(async () => {
  try {
    navigation.render(document.body);
    const foodStorage = new FoodStorage();
    const recipeStorage = new RecipeStorage();
    const [allRecipes] = await Promise.all([
      recipeStorage.getAll(),
      delay(600),
    ]);

    if (allRecipes.length === 0) {
      const errorScreen = new ErrorScreen(
        "../src/assets/illustrations/search.svg",
        "Could not get recipes data",
        "Please refresh the page or try again later.",
      );
      errorScreen.render("main");
    } else {
      const rawData = localStorage.getItem(SHOPPING_LIST_STORAGE_KEY);

      const parsedData: unknown = JSON.parse(rawData ?? "[]");
      if (!Array.isArray(parsedData)) {
        throw new TypeError("Invalid format of saved shopping list entries!");
      }

      const savedEntries = parsedData.filter(isSavedPlannerEntry);
      const shoppingItems = await buildShoppingItems(
        savedEntries,
        recipeStorage,
        foodStorage,
      );

      const shoppingList = new ShoppingList();
      const weekRecipeList = new WeekRecipeList(shoppingList);
      shoppingList.render("main", "append");
      shoppingList.renderList(shoppingItems);
    }
  } finally {
    removeLoader();
  }
})();
