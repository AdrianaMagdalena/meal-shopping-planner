import { Recipe } from "../models/recipe.js";
import { isRecipe } from "../utils/typeGuards.js";
export class RecipeStorage {
    constructor() {
        this._recipes = null;
    }
    async getRecipes() {
        if (this._recipes !== null)
            return;
        try {
            const response = await fetch("../data/recipes.json");
            if (!response.ok) {
                throw new Error("Error fetching data");
            }
            const data = await response.json();
            if (!Array.isArray(data)) {
                throw new TypeError("Invalid data format: expected an array");
            }
            const validRecipes = data.filter(isRecipe);
            this._recipes = validRecipes.map((r) => new Recipe(r));
        }
        catch (err) {
            this._recipes = [];
            console.error(err);
        }
    }
    async getAll() {
        await this.getRecipes();
        return this._recipes;
    }
    async getById(id) {
        await this.getRecipes();
        return this._recipes.find((r) => r.id === id);
    }
    async getByKeyword(keyword) {
        await this.getRecipes();
        return this._recipes.filter((r) => r.title.toLowerCase().includes(keyword.toLowerCase()));
    }
    async search(filters) {
        await this.getRecipes();
        let results = this._recipes;
        if (filters.keyword) {
            const lowerKeyword = filters.keyword.toLowerCase();
            results = results.filter((f) => f.title.toLowerCase().includes(lowerKeyword));
        }
        if (filters.dietTags && filters.dietTags.length > 0) {
            const lowerCategories = filters.dietTags.map((t) => t.toLowerCase());
            results = results.filter((r) => r.dietTags.every((t) => lowerCategories.includes(t.toLowerCase())));
        }
        if (filters.mealTypeTags && filters.mealTypeTags.length > 0) {
            const lowerCategories = filters.mealTypeTags.map((t) => t.toLowerCase());
            results = results.filter((r) => r.mealTypeTags.every((t) => lowerCategories.includes(t.toLowerCase())));
        }
        return results;
    }
}
