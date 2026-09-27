import { IFood } from "../interfaces/iFood.js";
import { IRecipe } from "../interfaces/iRecipe.js";
import { ISavedPlannerEntry } from "../interfaces/iSavedPlanner.js";
import { ISavedShoppingItem } from "../interfaces/iSavedShopping.js";

export function isFood(obj: any): obj is IFood {
  return (
    obj &&
    typeof obj.id === "string" &&
    typeof obj.name === "string" &&
    typeof obj.category === "string" &&
    typeof obj.unit === "string"
  );
}

export function isRecipe(obj: any): obj is IRecipe {
  return (
    obj &&
    typeof obj.id === "string" &&
    typeof obj.title === "string" &&
    Array.isArray(obj.dietTags) &&
    Array.isArray(obj.mealTypeTags) &&
    typeof obj.servings === "number" &&
    Array.isArray(obj.parts)
  );
}

export function isSelectorString(
  selector: string | HTMLElement,
): selector is string {
  return typeof selector === "string";
}

export function isSavedPlannerEntry(obj: any): obj is ISavedPlannerEntry {
  return (
    obj &&
    typeof obj.recipeId === "string" &&
    typeof obj.recipeTitle === "string" &&
    typeof obj.servingsAmount === "number"
  );
}

export function isSavedShoppingItem(obj: any): obj is ISavedShoppingItem {
  return (
    obj &&
    typeof obj.id === "string" &&
    typeof obj.category === "string" &&
    typeof obj.name === "string" &&
    typeof obj.unit === "string" &&
    typeof obj.quantity === "number"
  );
}
