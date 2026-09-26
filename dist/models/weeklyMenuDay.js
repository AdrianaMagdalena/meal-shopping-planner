import { generateId } from "../utils/generateId.js";
export class WeeklyMenuDay {
    constructor(existingId, existingEntries) {
        this._dayEntries = [];
        this._id = existingId ?? generateId("menuday", 4);
        this._dayEntries = existingEntries ?? [];
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
        const initialLength = this._dayEntries.length;
        this._dayEntries = this._dayEntries.filter((e) => e.id !== entryId);
        return this._dayEntries.length < initialLength;
    }
    getAllRecipeIds() {
        return this._dayEntries.map((e) => e.recipeId);
    }
    getEntryById(id) {
        return this._dayEntries.find((e) => e.id === id);
    }
    getAllEntryIds() {
        return this._dayEntries.map((e) => e.id);
    }
}
