export interface ISavedWeeklyMenuEntry {
  id: string;
  recipeId: string;
  recipeTitle: string;
  servingsAmount: number;
}

export interface ISavedWeeklyMenuDay {
  id: string;
  entries: ISavedWeeklyMenuEntry[];
}
