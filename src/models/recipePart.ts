import { RecipeIngredient } from "./recipeIngredient.js";

export class RecipePart {
  constructor(
    public ingredients: RecipeIngredient[],
    public steps: string[],
    public partTitle?: string,
  ) {}
}
