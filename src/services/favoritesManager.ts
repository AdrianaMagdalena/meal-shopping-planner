import { Recipe } from "../models/recipe.js";
import { FavoritesStorage } from "../storages/favoritesStorage.js";

export class FavoritesManager {
  private _storage: FavoritesStorage;

  constructor(storage: FavoritesStorage) {
    this._storage = storage;
  }

  addFavorite(recipe: Recipe): void {
    let favorites = this._storage.getAllFavorites();
    if (!favorites) favorites = [];

    const alreadyFavorited = favorites.some((f) => f.recipeId === recipe.id);

    if (alreadyFavorited) return;

    const newFavorite = {
      recipeId: recipe.id,
      recipeTitle: recipe.title,
    };

    favorites?.push(newFavorite);
    this._storage.save(favorites);
  }

  removeFavorite(recipeId: string): void {
    let favorites = this._storage.getAllFavorites();
    if (!favorites) favorites = [];

    const updatedFavorites = favorites.filter((f) => f.recipeId !== recipeId);
    this._storage.save(updatedFavorites);
  }

  isFavorited(recipeId: string): boolean {
    return this._storage.getFavoriteByRecipeId(recipeId) !== undefined;
  }

  toggleFavorite(recipe: Recipe): void {
    if (this.isFavorited(recipe.id)) {
      this.removeFavorite(recipe.id);
    } else {
      this.addFavorite(recipe);
    }
  }
}
