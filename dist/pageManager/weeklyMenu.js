import { Navigation } from "../components/navigation.js";
import { WeeklyMenuManager, DAY_LABELS, } from "../services/weeklyMenuManager.js";
import { MenuCard } from "../components/menuCard.js";
const navigation = new Navigation("../index.html", "./search.html", "javascript:void(0)", "javascript:void(0)");
navigation.render(document.body);
const menuConatiner = document.querySelector(".weekly-menu");
if (!menuConatiner)
    throw new Error("menuContainer not found on page");
const menuManager = new WeeklyMenuManager();
const renderDay = (dayIndex) => {
    const day = menuManager.weekDays[dayIndex];
    const menuCard = new MenuCard(dayIndex);
    menuCard.render(menuConatiner, "append");
    if (day.dayEntries.length > 0) {
        menuCard.renderHeader();
    }
    day.dayEntries.forEach((e) => {
        const onRemove = (entryId) => {
            menuManager.removeEntryFromDay(dayIndex, entryId);
            rerenderDay(dayIndex);
        };
        menuCard.renderEntry(e, onRemove);
    });
};
const rerenderDay = (dayIndex) => {
    const oldCard = menuConatiner.children[dayIndex];
    oldCard.remove();
    renderDay(dayIndex);
};
for (let i = 0; i < DAY_LABELS.length; i++) {
    renderDay(i);
}
