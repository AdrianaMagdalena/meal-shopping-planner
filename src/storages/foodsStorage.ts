import { Food } from "../models/food.js";
import { isFood } from "../utils/typeGuards.js";

export class FoodsStorage {
  private _foods: Food[] | null = null;

  async getFoods(): Promise<void> {
    if (this._foods !== null) return;

    try {
      const response = await fetch("../data/foods.json");

      if (!response.ok) {
        throw new Error("Error fetching foods data");
      }

      const data: unknown = await response.json();

      if (!Array.isArray(data)) {
        throw new TypeError("Invalid data format: expected an array");
      }

      const validFoods = data.filter(isFood);
      this._foods = validFoods.map((f) => new Food(f));
    } catch (err) {
      this._foods = [];
      console.log(err);
    }
  }

  async getAll(): Promise<Food[]> {
    await this.getFoods();
    return this._foods!;
  }

  async getById(id: string): Promise<Food | undefined> {
    await this.getFoods();
    return this._foods!.find((f) => f.id === id);
  }
}
