import { generateId } from "../utils/generateId.js";
export class WeeklyMenuEntry {
    constructor(recipe, servingsAmount) {
        this._id = generateId("menuentry", 8);
        this._recipeId = recipe.id;
        this._recipeTitle = recipe.title;
        this.servingsAmount = servingsAmount;
        this._servingsAmount = this.servingsAmount;
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
    set servingsAmount(v) {
        if (Number.isNaN(v)) {
            throw new TypeError("Servings amount must be of numeric value!");
        }
        else if (v > 50 || v < 1) {
            throw new Error("Servings' amount can be between 1 and 50.");
        }
        this._servingsAmount = v;
    }
}
