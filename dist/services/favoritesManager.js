export class FavoritesManager {
    constructor(storage) {
        this._storage = storage;
    }
    addFavorite(recipe) {
        let favorites = this._storage.getAllFavorites();
        if (!favorites)
            favorites = [];
        const alreadyFavorited = favorites.some((f) => f.recipeId === recipe.id);
        if (alreadyFavorited)
            return;
        const newFavorite = {
            recipeId: recipe.id,
            recipeTitle: recipe.title,
        };
        favorites?.push(newFavorite);
        this._storage.save(favorites);
    }
    removeFavorite(recipeId) {
        let favorites = this._storage.getAllFavorites();
        if (!favorites)
            favorites = [];
        const updatedFavorites = favorites.filter((f) => f.recipeId !== recipeId);
        this._storage.save(updatedFavorites);
    }
}
