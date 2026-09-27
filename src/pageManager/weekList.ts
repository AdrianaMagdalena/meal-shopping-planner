import { Navigation } from "../components/navigation.js";
import { WeekRecipeList } from "../components/weekRecipeList.js";

const navigation = new Navigation(
  "../index.html",
  "./search.html",
  "./planner.html",
  "javascript:void(0)",
  "./favorites.html",
);

navigation.render(document.body);

const weekRecipeList = new WeekRecipeList();
weekRecipeList.render("main", "prepend");
