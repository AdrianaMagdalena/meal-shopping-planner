import { Navigation } from "../components/navigation.js";

const navigation = new Navigation(
  "../index.html",
  "./search.html",
  "./planner.html",
  "./week-list.html",
  "javascript:void(0)",
);

navigation.render(document.body);
