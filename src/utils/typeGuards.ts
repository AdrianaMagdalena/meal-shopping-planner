import { IRecipe } from "../interfaces/iRecipe.js";

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
