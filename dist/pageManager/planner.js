import { Navigation } from "../components/navigation.js";
import { PlannerManager } from "../services/plannerManager.js";
import { PlannerCardComponent } from "../components/planner/plannerCardComponent.js";
import { Modal } from "../components/modals/modal.js";
import { removeLoader } from "../utils/removeLoader.js";
import { delay } from "../utils/delay.js";
import { CHECKED_ITEMS_STORAGE_KEY, DAY_LABELS, REMOVED_ITEMS_STORAGE_KEY, } from "../utils/constants.js";
const navigation = new Navigation("../index.html", "./search.html", "javascript:void(0)", "./week-list.html", "./favorites.html");
(async () => {
    try {
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
            menuManager.saveAllEntryData();
            localStorage.removeItem(CHECKED_ITEMS_STORAGE_KEY);
            localStorage.removeItem(REMOVED_ITEMS_STORAGE_KEY);
            confirmModal.openModal();
        });
        const removeAllEntriesBtn = document.querySelector(".remove-entries__button");
        if (!removeAllEntriesBtn)
            throw new Error("removeAllEntriesBtn not found on page");
        removeAllEntriesBtn.addEventListener("click", () => {
            menuManager.removeAllEntries();
            for (let i = 0; i < DAY_LABELS.length; i++) {
                rerenderDay(i);
            }
        });
        const renderDay = (dayIndex) => {
            const day = menuManager.weekDays[dayIndex];
            const plannerCard = new PlannerCardComponent(dayIndex);
            const referenceElem = menuConatiner.children[dayIndex] ?? null;
            menuConatiner.insertBefore(plannerCard.cardElem, referenceElem);
            if (day.dayEntries.length > 0) {
                plannerCard.renderHeader();
            }
            day.dayEntries.forEach((e) => {
                const onRemove = (entryId) => {
                    menuManager.removeEntryFromDay(dayIndex, entryId);
                    rerenderDay(dayIndex);
                };
                const onServingsChange = (entryId, newServings) => {
                    menuManager.updateEntryServings(dayIndex, entryId, newServings);
                };
                plannerCard.renderEntry(e, onRemove, onServingsChange);
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
        await delay(600);
    }
    finally {
        removeLoader();
    }
})();
