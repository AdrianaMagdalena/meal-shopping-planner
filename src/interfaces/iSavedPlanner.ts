export interface ISavedPlannerEntry {
  id: string;
  recipeId: string;
  recipeTitle: string;
  servingsAmount: number;
}

export interface ISavedPlannerDay {
  id: string;
  entries: ISavedPlannerEntry[];
}
