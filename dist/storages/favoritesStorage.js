import { isFavoriteItem } from "../utils/typeGuards.js";
export const FAVORITES_STORAGE_KEY = "favorites";
export class FavoritesStorage {
    constructor() {
        this._favorites = null;
    }
    load() {
        if (this._favorites !== null)
            return;
        const rawData = localStorage.getItem(FAVORITES_STORAGE_KEY);
        if (!rawData) {
            this._favorites = [];
            return;
        }
        try {
            const parsedData = JSON.parse(rawData);
            this._favorites = Array.isArray(parsedData)
                ? parsedData.filter(isFavoriteItem)
                : [];
        }
        catch {
            this._favorites = [];
        }
    }
    save(favorites) {
        this._favorites = favorites;
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    }
    getAllFavorites() {
        this.load();
        return this._favorites;
    }
    getFavoriteByRecipeId(recipeId) {
        this.load();
        return this._favorites.find((item) => item.recipeId === recipeId);
    }
}
