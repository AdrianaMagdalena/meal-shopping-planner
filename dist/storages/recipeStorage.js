import { Recipe } from "../models/recipe.js";
import { isRecipe } from "../utils/typeGuards.js";
export class RecipeStorage {
    constructor() {
        this.recipes = null;
    }
    async getRecipes() {
        if (this.recipes !== null)
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
            this.recipes = validRecipes.map((r) => new Recipe(r));
        }
        catch (err) {
            this.recipes = [];
            console.error(err);
        }
    }
    async getAll() {
        await this.getRecipes();
        return this.recipes;
    }
    async getById(id) {
        await this.getRecipes();
        return this.recipes.find((r) => r.id === id);
    }
    async getByKeyword(keyword) {
        await this.getRecipes();
        const lowerKeyword = keyword.toLowerCase();
        return this.recipes.filter((r) => r.title.toLowerCase().includes(lowerKeyword));
    }
}
