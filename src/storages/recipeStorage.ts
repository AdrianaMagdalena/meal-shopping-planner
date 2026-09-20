import { Recipe } from "../models/recipe.js";
import { isRecipe } from "../utils/typeGuards.js";

export class RecipeStorage {
  private recipes: Recipe[] | null = null;

  async getRecipes(): Promise<void> {
    if (this.recipes !== null) return;

    try {
      const response = await fetch("../../../data/recipes.json");

      if (!response.ok) {
        throw new Error("Error fetching data");
      }

      const data: unknown = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Invalid data format: expected an array");
      }

      const validRecipes = data.filter(isRecipe);
      this.recipes = validRecipes.map((r) => new Recipe(r));
    } catch (err) {
      this.recipes = [];
      console.error(err);
    }
  }

  async getAll(): Promise<Recipe[]> {
    await this.getRecipes();
    return this.recipes!;
  }

  async getById(id: string): Promise<Recipe | undefined> {
    await this.getRecipes();
    return this.recipes!.find((r) => r.id === id);
  }
}
