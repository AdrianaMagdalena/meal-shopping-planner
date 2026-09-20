import { IRecipe } from "../interfaces/iRecipe";

export function isRecipe(obj: any): obj is IRecipe {
  return (
    obj &&
    typeof obj.id === "string" &&
    typeof obj.title === "string" &&
    typeof obj.cookTime === "number" &&
    typeof obj.image === "string" &&
    Array.isArray(obj.dietTags) &&
    Array.isArray(obj.mealTypeTags) &&
    typeof obj.servings === "number" &&
    Array.isArray(obj.parts)
  );
}
