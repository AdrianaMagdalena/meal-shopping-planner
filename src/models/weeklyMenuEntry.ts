import { ISavedWeeklyMenuEntry } from "../interfaces/iSavedWeeklyMenu.js";
import { generateId } from "../utils/generateId.js";
import { Recipe } from "./recipe.js";

export class WeeklyMenuEntry {
  private readonly _id: string;
  private readonly _recipeId: string;
  private readonly _recipeTitle: string;
  private _servingsAmount: number;

  constructor(
    recipeId: string,
    recipeTitle: string,
    servingsAmount: number,
    existingId?: string,
  ) {
    this._id = existingId ?? generateId("menuentry", 8);
    this._recipeId = recipeId;
    this._recipeTitle = recipeTitle;

    this.servingsAmount = servingsAmount;
    this._servingsAmount = this.servingsAmount;
  }

  set servingsAmount(v: number) {
    if (Number.isNaN(v)) {
      throw new TypeError("Servings amount must be of numeric value!");
    } else if (v > 50 || v < 1) {
      throw new Error("Servings' amount can be between 1 and 50.");
    }
    this._servingsAmount = v;
  }

  static fromSavedData(data: ISavedWeeklyMenuEntry): WeeklyMenuEntry {
    return new WeeklyMenuEntry(
      data.recipeId,
      data.recipeTitle,
      data.servingsAmount,
      data.id,
    );
  }

  toSavedData(): ISavedWeeklyMenuEntry {
    return {
      id: this._id,
      recipeId: this._recipeId,
      recipeTitle: this._recipeTitle,
      servingsAmount: this._servingsAmount,
    };
  }

  get id() {
    return this._id;
  }

  get recipeId() {
    return this._recipeId;
  }

  get recipeTitle() {
    return this._recipeTitle;
  }

  get servingsAmount() {
    return this._servingsAmount;
  }
}
