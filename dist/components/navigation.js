import { isSelectorString } from "../utils/typeGuards.js";
const template = document.createElement("template");
const templateHTML = `
<nav>
    <a class="nav-logo">
        <span class="logo-label">Homepage</span>
    </a>
    <button class="nav-btn" aria-label="Navigation"></button>
    <ul class="nav-menu">
    <li class="nav-item nav-item__recipes"><a>Recipes</a></li>
    <li class="nav-item nav-item__planner"><a>Planner</a></li>
    <li class="nav-item nav-item__week"><a>Week's list</a></li>
    <li class="nav-item nav-item__favs"><a>Favorites</a></li>
    </ul>
</nav>
`;
template.innerHTML = templateHTML.trim();
export class Navigation {
    constructor(homeLink, recipesLink, plannerLink, weekListLink, favoritesLink) {
        const fragment = template.content.cloneNode(true);
        const navElement = fragment.querySelector("nav");
        if (!navElement) {
            throw new Error("navElement not found in template");
        }
        this._navElement = navElement;
        const navButton = this._navElement.querySelector(".nav-btn");
        if (!navButton) {
            throw new Error("navButton not found in template");
        }
        const navMenu = this._navElement.querySelector(".nav-menu");
        if (!navMenu) {
            throw new Error("navMenu not found in template");
        }
        const homeAnchor = this._navElement.querySelector(".nav-logo");
        if (!homeAnchor) {
            throw new Error("homeAnchor not found in template");
        }
        this._homeAnchor = homeAnchor;
        const recipesAnchor = this._navElement.querySelector(".nav-item__recipes a");
        if (!recipesAnchor) {
            throw new Error("recipesAnchor not found in template");
        }
        this._recipesAnchor = recipesAnchor;
        const plannerAnchor = this._navElement.querySelector(".nav-item__planner a");
        if (!plannerAnchor) {
            throw new Error("plannerAnchor not found in template");
        }
        this._plannerAnchor = plannerAnchor;
        const weekListAnchor = this._navElement.querySelector(".nav-item__week a");
        if (!weekListAnchor) {
            throw new Error("weekListAnchor not found in template");
        }
        this._weekListAnchor = weekListAnchor;
        const favoritesAnchor = this._navElement.querySelector(".nav-item__favs a");
        if (!favoritesAnchor) {
            throw new Error("favoritesAnchor not found in template");
        }
        this._favoritesAnchor = favoritesAnchor;
        this._homeAnchor.href = homeLink;
        this._recipesAnchor.href = recipesLink;
        this._plannerAnchor.href = plannerLink;
        this._weekListAnchor.href = weekListLink;
        this._favoritesAnchor.href = favoritesLink;
        navButton.addEventListener("click", () => {
            navMenu.classList.toggle("opened");
            const navHeight = this._navElement.offsetHeight;
            document.body.style.setProperty("--nav-height-counted", `${navHeight}px`);
        });
    }
    render(parentSelector) {
        const parentElement = isSelectorString(parentSelector)
            ? document.querySelector(parentSelector)
            : parentSelector;
        if (!parentElement) {
            throw new Error("parentElement not found in template");
        }
        parentElement.prepend(this._navElement);
        const navHeight = this._navElement.offsetHeight;
        document.body.style.setProperty("--nav-height-counted", `${navHeight}px`);
    }
}
