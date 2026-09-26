import { Navigation } from "./components/navigation.js";

const navigation = new Navigation(
  "javascript:void(0)",
  "./pages/search.html",
  "./pages/planner.html",
  "./pages/week-list.html",
  "./pages/favorites.html",
);

navigation.render(document.body);
