export class RecipeIngredient {
  constructor(
    public recipeId: string,
    public quantity: number,
    public optional?: boolean,
  ) {}
}
