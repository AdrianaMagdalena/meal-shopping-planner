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
  cookTime?: number;
  dietTags: string[];
  mealTypeTags: string[];
  servingInfo?: string;
  servings: number;
  parts: IRecipePart[];
}
