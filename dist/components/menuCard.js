import { isSelectorString } from "../utils/typeGuards.js";
import { MenuEntry } from "./menuEntry.js";
import { DAY_LABELS } from "../services/weeklyMenuManager.js";
import { insertElem } from "../utils/insertElem.js";
const template = document.createElement("template");
const templateHTML = `
<div class="day-menu">
    <p class="day-menu__title">Monday</p>
</div>
`;
template.innerHTML = templateHTML.trim();
export class MenuCard {
    constructor(dayIndex) {
        const fragment = template.content.cloneNode(true);
        const dayCard = fragment.querySelector(".day-menu");
        if (!dayCard)
            throw new Error("dayCard not found in template");
        this._cardElem = dayCard;
        const cardTitle = this._cardElem.querySelector(".day-menu__title");
        if (!cardTitle)
            throw new Error("cardTitle not found in template");
        this._cardTitle = cardTitle;
        this._cardTitle.textContent = DAY_LABELS[dayIndex];
    }
    get cardElem() {
        return this._cardElem;
    }
    get cardTitle() {
        return this._cardTitle;
    }
    render(parentSelector, position) {
        const parentElement = isSelectorString(parentSelector)
            ? document.querySelector(parentSelector)
            : parentSelector;
        if (!parentElement) {
            throw new Error("parentElement not found in template");
        }
        insertElem(position, this._cardElem, parentElement);
    }
    renderHeader() {
        const header = document.createElement("div");
        header.classList.add("day-menu__header");
        const recipeHeader = document.createElement("p");
        recipeHeader.textContent = "Recipe:";
        const servingsHeader = document.createElement("p");
        servingsHeader.textContent = "Servings:";
        header.appendChild(recipeHeader);
        header.appendChild(servingsHeader);
        this._cardElem.appendChild(header);
    }
    renderEntry(menuEntry, onRemove) {
        const entry = new MenuEntry(menuEntry, onRemove);
        entry.render(this._cardElem, "append");
    }
}
