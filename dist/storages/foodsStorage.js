import { Food } from "../models/food.js";
import { isFood } from "../utils/typeGuards.js";
export class FoodsStorage {
    constructor() {
        this._foods = null;
    }
    async getFoods() {
        if (this._foods !== null)
            return;
        try {
            const response = await fetch("../data/foods.json");
            if (!response.ok) {
                throw new Error("Error fetching foods data");
            }
            const data = await response.json();
            if (!Array.isArray(data)) {
                throw new TypeError("Invalid data format: expected an array");
            }
            const validFoods = data.filter(isFood);
            this._foods = validFoods.map((f) => new Food(f));
        }
        catch (err) {
            this._foods = [];
            console.log(err);
        }
    }
    async getAll() {
        await this.getFoods();
        return this._foods;
    }
    async getById(id) {
        await this.getFoods();
        return this._foods.find((f) => f.id === id);
    }
}
