import { ErrorScreenComponent } from "../components/errorScreenComponent.js";
import { NavigationComponent } from "../components/navigationComponent.js";
import { ShoppingListComponent } from "../components/shopping/shoppingListComponent.js";
import { WeekRecipeListComponent } from "../components/weekRecipeListComponent.js";
import {
  SHOPPING_LIST_STORAGE_KEY,
  WEEK_RECIPES_STORAGE_KEY,
} from "../utils/constants.js";
import { FoodStorage } from "../storages/foodStorage.js";
import { RecipeStorage } from "../storages/recipeStorage.js";
import { removeLoader } from "../utils/removeLoader.js";
import { delay } from "../utils/delay.js";
import { isSavedPlannerEntry } from "../utils/typeGuards.js";
import { buildShoppingItems } from "../services/shoppingListManager.js";
import { WarningModalComponent } from "../components/modals/warningModalComponent.js";

const navigation = new NavigationComponent(
  "../index.html",
  "./search.html",
  "./planner.html",
  "javascript:void(0)",
  "./favorites.html",
);

(async () => {
  try {
    navigation.render(document.body);
    const foodStorage = new FoodStorage();
    const recipeStorage = new RecipeStorage();
    const [allRecipes] = await Promise.all([
      recipeStorage.getAll(),
      delay(600),
    ]);

    if (allRecipes.length === 0) {
      const errorScreen = new ErrorScreenComponent(
        "../src/assets/illustrations/search.svg",
        "Could not get recipes data",
        "Please refresh the page or try again later.",
      );
      errorScreen.render("main");
      return;
    }

    const rawData = localStorage.getItem(SHOPPING_LIST_STORAGE_KEY);
    const parsedData: unknown = JSON.parse(rawData ?? "[]");
    if (!Array.isArray(parsedData)) {
      throw new TypeError("Invalid format of saved shopping list entries!");
    }

    const savedEntries = parsedData.filter(isSavedPlannerEntry);
    const shoppingItems = await buildShoppingItems(
      savedEntries,
      recipeStorage,
      foodStorage,
    );

    const shoppingList = new ShoppingListComponent();
    shoppingList.render("main", "append");
    shoppingList.renderList(shoppingItems);

    const onConfirm = () => {
      localStorage.removeItem(WEEK_RECIPES_STORAGE_KEY);
      localStorage.removeItem(SHOPPING_LIST_STORAGE_KEY);
      weekRecipeList.weeklyListCont.remove();
      shoppingList.renderList([]);
      weekRecipeList.generateWeekListData();

      warningModalComponent.closeModalComponent();
    };

    const warningModalComponent = new WarningModalComponent(
      "Warning!",
      "This will remove the recipe list and all shoping list items. Are you sure you want to do that?",
      "No, keep them",
      "Yes, continue",
      onConfirm,
      "../src/assets/illustrations/warning.svg",
    );
    warningModalComponent.render(document.body, "append");

    const onRemove = () => {
      warningModalComponent.openModalComponent();
    };

    const weekRecipeList = new WeekRecipeListComponent(onRemove);
  } finally {
    removeLoader();
  }
})();
