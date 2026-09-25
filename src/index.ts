import { Navigation } from "./components/navigation.js";

const navigation = new Navigation(
  "javascript:void(0)",
  "./pages/search.html",
  "./pages/weekly-menu.html",
  "javascript:void(0)",
);

navigation.render(document.body);
