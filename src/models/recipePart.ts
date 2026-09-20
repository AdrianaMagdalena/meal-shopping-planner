import { RecipeIngredient } from "./recipeIngredient";

export class RecipePart {
  constructor(
    public ingredients: RecipeIngredient[],
    public steps: string[],
    public partTitle?: string,
  ) {}
}
