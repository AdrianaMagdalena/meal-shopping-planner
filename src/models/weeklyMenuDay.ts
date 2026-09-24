import { generateId } from "../utils/generateId.js";
import { WeeklyMenuEntry } from "./weeklyMenuEntry.js";

export class WeeklyMenuDay {
  private readonly _id: string;
  private _dayEntries: WeeklyMenuEntry[] = [];

  constructor() {
    this._id = generateId("menuday", 4);
  }

  get id() {
    return this._id;
  }

  get dayEntries() {
    return this._dayEntries;
  }

  addEntry(entry: WeeklyMenuEntry): void {
    this._dayEntries.push(entry);
  }

  removeEntry(entryId: string): void {
    this._dayEntries = this._dayEntries.filter((e) => e.id !== entryId);
  }

  getAllRecipeIds(): string[] {
    return this._dayEntries.map((e) => e.recipeId);
  }
}
