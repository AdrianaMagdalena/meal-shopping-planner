import { Recipe } from "../models/recipe.js";
import { WeeklyMenuDay } from "../models/weeklyMenuDay.js";
import { WeeklyMenuEntry } from "../models/weeklyMenuEntry.js";

export const DAY_LABELS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export class WeeklyMenuManager {
  private _weekDays: WeeklyMenuDay[] = [
    new WeeklyMenuDay(),
    new WeeklyMenuDay(),
    new WeeklyMenuDay(),
    new WeeklyMenuDay(),
    new WeeklyMenuDay(),
    new WeeklyMenuDay(),
    new WeeklyMenuDay(),
  ];

  get weekDays() {
    return this._weekDays;
  }

  addEntryToDay(dayIndex: number, recipe: Recipe, servings: number): void {
    if (dayIndex < 0 || dayIndex > 6)
      throw new Error("dayIndex out of 0 - 6 range");

    const day = this._weekDays[dayIndex];
    const entry = new WeeklyMenuEntry(recipe, servings);

    day.addEntry(entry);
  }

  removeEntryFromDay(dayIndex: number, entryId: string): void {
    if (dayIndex < 0 || dayIndex > 6)
      throw new Error("dayIndex out of 0 - 6 range");

    const day = this._weekDays[dayIndex];
    const removed = day.removeEntry(entryId);

    if (!removed)
      throw new Error("EntryId not existent on day. Unable to remove.");
  }

  updateEntryServings(dayIndex: number, entryId: string, newServings: number) {
    if (dayIndex < 0 || dayIndex > 6)
      throw new Error("dayIndex out of 0 - 6 range");

    const day = this._weekDays[dayIndex];
    const entry = day.getEntryById(entryId);
    if (!entry) throw new Error("EntryId not existent on day.");

    entry.servingsAmount = newServings;
  }
}
