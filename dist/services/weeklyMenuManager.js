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
const STORAGE_KEY = "weeklyMenu";
export class WeeklyMenuManager {
    constructor(weekdays) {
        this._weekDays =
            weekdays ??
                Array.from({ length: DAY_LABELS.length }, () => new WeeklyMenuDay());
    }
    get weekDays() {
        return this._weekDays;
    }
    static load() {
        const rawData = localStorage.getItem(STORAGE_KEY);
        if (!rawData)
            return new WeeklyMenuManager();
        try {
            const parsedData = JSON.parse(rawData);
            if (!Array.isArray(parsedData) ||
                parsedData.length !== DAY_LABELS.length) {
                throw new Error("Invalid format of saved weekly menu!");
            }
            const weekDays = parsedData.map((dayData) => {
                const entries = dayData.entries.map((entryData) => WeeklyMenuEntry.fromSavedData(entryData));
                return new WeeklyMenuDay(dayData.id, entries);
            });
            return new WeeklyMenuManager(weekDays);
        }
        catch (err) {
            console.error("Failed to load saved weekly menu data. Trying again: ", err);
            return new WeeklyMenuManager();
        }
    }
    save() {
        const data = this._weekDays.map((day) => ({
            id: day.id,
            entries: day.dayEntries.map((entry) => entry.toSavedData()),
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    addEntryToDay(dayIndex, recipe, servings) {
        if (dayIndex < 0 || dayIndex > 6)
            throw new Error("dayIndex out of 0 - 6 range");
        const day = this._weekDays[dayIndex];
        const entry = new WeeklyMenuEntry(recipe.id, recipe.title, servings);
        day.addEntry(entry);
        this.save();
    }
    removeEntryFromDay(dayIndex, entryId) {
        if (dayIndex < 0 || dayIndex > 6)
            throw new Error("dayIndex out of 0 - 6 range");
        const day = this._weekDays[dayIndex];
        const removed = day.removeEntry(entryId);
        if (!removed)
            throw new Error("EntryId not existent on day. Unable to remove.");
        this.save();
    }
    updateEntryServings(dayIndex, entryId, newServings) {
        if (dayIndex < 0 || dayIndex > 6)
            throw new Error("dayIndex out of 0 - 6 range");
        const day = this._weekDays[dayIndex];
        const entry = day.getEntryById(entryId);
        if (!entry)
            throw new Error("EntryId not existent on day.");
        entry.servingsAmount = newServings;
        this.save();
    }
}
