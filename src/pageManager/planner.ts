import { Navigation } from "../components/navigation.js";
import {
  WeeklyMenuManager,
  DAY_LABELS,
} from "../services/weeklyMenuManager.js";
import { MenuCard } from "../components/menuCard.js";

const navigation = new Navigation(
  "../index.html",
  "./search.html",
  "javascript:void(0)",
  "./week-list.html",
  "./favorites.html",
);
navigation.render(document.body);

const menuConatiner = document.querySelector<HTMLDivElement>(".planner");
if (!menuConatiner) throw new Error("menuContainer not found on page");

const menuManager = WeeklyMenuManager.load();

const renderDay = (dayIndex: number): void => {
  const day = menuManager.weekDays[dayIndex];
  const menuCard = new MenuCard(dayIndex);

  const referenceElem = menuConatiner.children[dayIndex] ?? null;
  menuConatiner.insertBefore(menuCard.cardElem, referenceElem);

  if (day.dayEntries.length > 0) {
    menuCard.renderHeader();
  }

  day.dayEntries.forEach((e) => {
    const onRemove = (entryId: string): void => {
      menuManager.removeEntryFromDay(dayIndex, entryId);
      rerenderDay(dayIndex);
    };

    menuCard.renderEntry(e, onRemove);
  });
};

const rerenderDay = (dayIndex: number): void => {
  const oldCard = menuConatiner.children[dayIndex];
  oldCard.remove();
  renderDay(dayIndex);
};

for (let i = 0; i < DAY_LABELS.length; i++) {
  renderDay(i);
}
