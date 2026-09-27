import { Navigation } from "../components/navigation.js";
import { PlannerManager, DAY_LABELS } from "../services/plannerManager.js";
import { MenuCard } from "../components/menuCard.js";
import { Modal } from "../components/modal.js";
const navigation = new Navigation("../index.html", "./search.html", "javascript:void(0)", "./week-list.html", "./favorites.html");
navigation.render(document.body);
const menuConatiner = document.querySelector(".planner");
if (!menuConatiner)
    throw new Error("menuContainer not found on page");
const menuManager = PlannerManager.load();
const confirmModal = new Modal("Success!", `You succesfully generated yout weekly shopping list! It'll be available in the "Week's list" submenu.`, "Okay", "../src/assets/illustrations/checklist.svg");
confirmModal.render("main", "append");
const generateListBtn = document.querySelector(".planner__button");
if (!generateListBtn)
    throw new Error("generateListBtn not found on page");
generateListBtn.addEventListener("click", () => {
    menuManager.saveUniqueRecipeData();
    confirmModal.openModal();
});
const renderDay = (dayIndex) => {
    const day = menuManager.weekDays[dayIndex];
    const menuCard = new MenuCard(dayIndex);
    const referenceElem = menuConatiner.children[dayIndex] ?? null;
    menuConatiner.insertBefore(menuCard.cardElem, referenceElem);
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
