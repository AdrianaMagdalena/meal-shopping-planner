import { generateId } from "../utils/generateId.js";
import { PlannerEntry } from "./plannerEntry.js";

export class PlannerDay {
  private readonly _id: string;
  private _dayEntries: PlannerEntry[] = [];

  constructor(existingId?: string, existingEntries?: PlannerEntry[]) {
    this._id = existingId ?? generateId("planday", 4);
    this._dayEntries = existingEntries ?? [];
  }

  get id() {
    return this._id;
  }

  get dayEntries() {
    return this._dayEntries;
  }

  addEntry(entry: PlannerEntry): void {
    this._dayEntries.push(entry);
  }

  removeEntry(entryId: string): boolean {
    const initialLength = this._dayEntries.length;
    this._dayEntries = this._dayEntries.filter((e) => e.id !== entryId);
    return this._dayEntries.length < initialLength;
  }

  getAllRecipeIds(): string[] {
    return this._dayEntries.map((e) => e.recipeId);
  }

  getEntryById(id: string): PlannerEntry | undefined {
    return this._dayEntries.find((e) => e.id === id);
  }

  getAllEntryIds(): string[] {
    return this._dayEntries.map((e) => e.id);
  }
}
