export interface IRecipeIngredient {
  id: string;
  quantity: number;
  optional?: boolean;
}

export interface IRecipePart {
  title?: string;
  ingredients: IRecipeIngredient[];
  steps: string[];
}

export interface IRecipe {
  id: string;
  title: string;
  preparationTime?: number;
  cookTime: number;
  image: string;
  dietTags: string[];
  mealTypeTags: string[];
  servings: number;
  parts: IRecipePart[];
}
