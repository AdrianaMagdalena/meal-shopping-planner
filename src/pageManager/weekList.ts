import { Navigation } from "../components/navigation.js";

const navigation = new Navigation(
  "../index.html",
  "./search.html",
  "./planner.html",
  "javascript:void(0)",
  "./favorites.html",
);

navigation.render(document.body);

const openListBtn = document.querySelector<HTMLButtonElement>(
  ".button--show-recipes",
);
if (!openListBtn) throw new Error("openListBtn not found on page");

const weeklyMenuListWrap =
  document.querySelector<HTMLDivElement>(".weekly-list__wrap");
if (!weeklyMenuListWrap)
  throw new Error("weeklyMenuListWrap not found on page");

openListBtn.addEventListener("click", () => {
  weeklyMenuListWrap.classList.toggle("open");
  openListBtn.classList.toggle("open");
});
