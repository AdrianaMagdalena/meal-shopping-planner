import { ISavedPlannerDay } from "../interfaces/iSavedPlanner.js";
import { Recipe } from "../models/recipe.js";
import { PlannerDay } from "../models/plannerDay.js";
import { PlannerEntry } from "../models/plannerEntry.js";

export const DAY_LABELS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const PLAN_STORAGE_KEY = "weeklyPlan";
export const WEEK_RECIPES_STORAGE_KEY = "weeklyRecipeList";
export const SHOPPING_LIST_STORAGE_KEY = "shoppingList";

export class PlannerManager {
  private readonly _weekDays: PlannerDay[];

  constructor(weekdays?: PlannerDay[]) {
    this._weekDays =
      weekdays ??
      Array.from({ length: DAY_LABELS.length }, () => new PlannerDay());
  }

  get weekDays() {
    return this._weekDays;
  }

  static load(): PlannerManager {
    const rawData = localStorage.getItem(PLAN_STORAGE_KEY);
    if (!rawData) return new PlannerManager();

    try {
      const parsedData: unknown = JSON.parse(rawData);
      if (
        !Array.isArray(parsedData) ||
        parsedData.length !== DAY_LABELS.length
      ) {
        throw new Error("Invalid format of saved weekly menu!");
      }

      const weekDays = parsedData.map((dayData: ISavedPlannerDay) => {
        const entries = dayData.entries.map((entryData) =>
          PlannerEntry.fromSavedData(entryData),
        );
        return new PlannerDay(dayData.id, entries);
      });

      return new PlannerManager(weekDays);
    } catch (err) {
      console.error(
        "Failed to load saved weekly menu data. Trying again: ",
        err,
      );
      return new PlannerManager();
    }
  }

  save(): void {
    const data: ISavedPlannerDay[] = this._weekDays.map((day) => ({
      id: day.id,
      entries: day.dayEntries.map((entry) => entry.toSavedData()),
    }));

    localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(data));
  }

  addEntryToDay(dayIndex: number, recipe: Recipe, servings: number): void {
    if (dayIndex < 0 || dayIndex > 6)
      throw new Error("dayIndex out of 0 - 6 range");

    const day = this._weekDays[dayIndex];
    const entry = new PlannerEntry(recipe.id, recipe.title, servings);

    day.addEntry(entry);
    this.save();
  }

  removeEntryFromDay(dayIndex: number, entryId: string): void {
    if (dayIndex < 0 || dayIndex > 6)
      throw new Error("dayIndex out of 0 - 6 range");

    const day = this._weekDays[dayIndex];
    const removed = day.removeEntry(entryId);

    if (!removed)
      throw new Error("EntryId not existent on day. Unable to remove.");
    this.save();
  }

  removeAllEntries(): void {
    this._weekDays.forEach((day) => {
      day.dayEntries.forEach((entry) => {
        day.removeEntry(entry.id);
      });
    });
    this.save();
  }

  updateEntryServings(dayIndex: number, entryId: string, newServings: number) {
    if (dayIndex < 0 || dayIndex > 6)
      throw new Error("dayIndex out of 0 - 6 range");

    const day = this._weekDays[dayIndex];
    const entry = day.getEntryById(entryId);
    if (!entry) throw new Error("EntryId not existent on day.");

    entry.servingsAmount = newServings;
    this.save();
  }

  saveUniqueRecipeData(): void {
    const allEntriesData = this._weekDays.flatMap((day) => day.dayEntries);
    const filteredRecipeIds = new Set<string>();
    const filteredData = allEntriesData
      .filter((entry) => {
        if (filteredRecipeIds.has(entry.recipeId)) return false;
        filteredRecipeIds.add(entry.recipeId);
        return true;
      })
      .map((entry) => entry.toSavedData());

    localStorage.setItem(
      WEEK_RECIPES_STORAGE_KEY,
      JSON.stringify(filteredData),
    );
  }

  saveAllEntryData(): void {
    const allEntriesData = this._weekDays.flatMap((day) => day.dayEntries);
    const entriesDataToSave = allEntriesData.map((entry) =>
      entry.toSavedData(),
    );

    localStorage.setItem(
      SHOPPING_LIST_STORAGE_KEY,
      JSON.stringify(entriesDataToSave),
    );

    console.log(JSON.stringify(entriesDataToSave));
  }
}
