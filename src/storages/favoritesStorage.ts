import { IFavoriteItem } from "../interfaces/iFavorites.js";
import { isFavoriteItem } from "../utils/typeGuards.js";

export const FAVORITES_STORAGE_KEY = "favorites";

export class FavoritesStorage {
  private _favorites: IFavoriteItem[] | null = null;

  private load(): void {
    if (this._favorites !== null) return;

    const rawData = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!rawData) {
      this._favorites = [];
      return;
    }

    try {
      const parsedData: unknown = JSON.parse(rawData);
      this._favorites = Array.isArray(parsedData)
        ? parsedData.filter(isFavoriteItem)
        : [];
    } catch {
      this._favorites = [];
    }
  }

  save(favorites: IFavoriteItem[]): void {
    this._favorites = favorites;
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }

  getAllFavorites(): IFavoriteItem[] {
    this.load();
    return this._favorites!;
  }

  getFavoriteByRecipeId(recipeId: string): IFavoriteItem | undefined {
    this.load();
    return this._favorites!.find((item) => item.recipeId === recipeId);
  }
}
