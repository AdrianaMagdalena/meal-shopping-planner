import { generateId } from "../utils/generateId.js";
export class WeeklyMenuEntry {
    constructor(recipeId, recipeTitle, servingsAmount, existingId) {
        this._id = existingId ?? generateId("menuentry", 8);
        this._recipeId = recipeId;
        this._recipeTitle = recipeTitle;
        this.servingsAmount = servingsAmount;
        this._servingsAmount = this.servingsAmount;
    }
    set servingsAmount(v) {
        if (Number.isNaN(v)) {
            throw new TypeError("Servings amount must be of numeric value!");
        }
        else if (v > 50 || v < 1) {
            throw new Error("Servings' amount can be between 1 and 50.");
        }
        this._servingsAmount = v;
    }
    static fromSavedData(data) {
        return new WeeklyMenuEntry(data.recipeId, data.recipeTitle, data.servingsAmount, data.id);
    }
    toSavedData() {
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
