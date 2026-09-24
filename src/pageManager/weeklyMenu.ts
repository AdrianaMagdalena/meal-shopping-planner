import { Navigation } from "../components/common/navigation.js";

const navigation = new Navigation(
  "../index.html",
  "./search.html",
  "javascript:void(0)",
  "javascript:void(0)",
);
navigation.render(document.body);
