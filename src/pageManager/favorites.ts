import { FavoritesListComponent } from "../components/favorites/favoritesListComponent.js";
import { Navigation } from "../components/navigation.js";
import { FavoritesStorage } from "../storages/favoritesStorage.js";

const navigation = new Navigation(
  "../index.html",
  "./search.html",
  "./planner.html",
  "./week-list.html",
  "javascript:void(0)",
);

navigation.render(document.body);

const favoritesStorage = new FavoritesStorage();
const allFavs = favoritesStorage.getAllFavorites();

const favList = new FavoritesListComponent(allFavs);
