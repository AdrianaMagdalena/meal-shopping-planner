import { Recipe } from "../models/recipe.js";
import { ISavedPlannerEntry } from "../interfaces/iSavedPlanner.js";
import { ISavedShoppingItem } from "../interfaces/iSavedShopping.js";
import { FoodStorage } from "../storages/foodStorage.js";
import { RecipeStorage } from "../storages/recipeStorage.js";
import { roundIngredients } from "../utils/roundIngredients.js";
import { SHOPPING_CATEGORY_ORDER } from "../utils/constants.js";

const getDataFromRecipe = async (
  recipe: Recipe,
  foodStorage: FoodStorage,
  items: ISavedShoppingItem[],
  ratio: number,
): Promise<void> => {
  for (const part of recipe.parts) {
    for (const ingredient of part.ingredients) {
      const food = await foodStorage.getById(ingredient.id);
      items.push({
        id: food ? food.id : "Unknown",
        category: food ? food.category : "Unknown category",
        name: food ? food.name.toLowerCase() : "Unknown ingredient",
        unit: food ? food.unit : "",
        quantity: ingredient.quantity * ratio,
      });
    }
  }
};

const addItemsQuantities = (
  items: ISavedShoppingItem[],
): ISavedShoppingItem[] => {
  const totals = new Map<string, ISavedShoppingItem>();

  items.forEach((item) => {
    if (totals.has(item.id)) {
      totals.get(item.id)!.quantity += item.quantity;
    } else {
      totals.set(item.id, { ...item });
    }
  });

  const summarised = Array.from(totals.values());
  summarised.forEach((item) => {
    item.quantity = roundIngredients(item.quantity);
  });

  return summarised;
};

export const buildShoppingItems = async (
  savedEntries: ISavedPlannerEntry[],
  recipeStorage: RecipeStorage,
  foodStorage: FoodStorage,
): Promise<ISavedShoppingItem[]> => {
  let items: ISavedShoppingItem[] = [];

  for (const entry of savedEntries) {
    const recipe = await recipeStorage.getById(entry.recipeId);
    if (!recipe) continue;

    const ratio = entry.servingsAmount / recipe.servings;
    await getDataFromRecipe(recipe, foodStorage, items, ratio);
  }

  return addItemsQuantities(items);
};

export const groupByCategory = (
  items: ISavedShoppingItem[],
): Map<string, ISavedShoppingItem[]> => {
  const grouped = new Map<string, ISavedShoppingItem[]>();

  items.forEach((item) => {
    if (!grouped.has(item.category)) grouped.set(item.category, []);
    grouped.get(item.category)!.push(item);
  });

  return grouped;
};

export const sortByFixedOrder = (
  grouped: Map<string, ISavedShoppingItem[]>,
): Map<string, ISavedShoppingItem[]> => {
  const sorted = Array.from(grouped.entries()).sort(([a], [b]) => {
    const indexA = SHOPPING_CATEGORY_ORDER.indexOf(a);
    const indexB = SHOPPING_CATEGORY_ORDER.indexOf(b);
    return (
      (indexA === -1 ? SHOPPING_CATEGORY_ORDER.length : indexA) -
      (indexB === -1 ? SHOPPING_CATEGORY_ORDER.length : indexB)
    );
  });
  return new Map(sorted);
};
