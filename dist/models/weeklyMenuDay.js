import { generateId } from "../utils/generateId.js";
export class WeeklyMenuDay {
    constructor() {
        this._dayEntries = [];
        this._id = generateId("menuday", 4);
    }
    get id() {
        return this._id;
    }
    get dayEntries() {
        return this._dayEntries;
    }
    addEntry(entry) {
        this._dayEntries.push(entry);
    }
    removeEntry(entryId) {
        this._dayEntries = this._dayEntries.filter((e) => e.id !== entryId);
    }
    getAllRecipeIds() {
        return this._dayEntries.map((e) => e.recipeId);
    }
}
