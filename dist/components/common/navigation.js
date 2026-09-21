import { isSelectorString } from "../../utils/typeGuards.js";
const template = document.createElement("template");
const templateHTML = `
<nav>
    <a class="nav-logo">
        <span class="logo-label">Homepage</span>
    </a>
    <button class="nav-btn" aria-label="Navigation"></button>
    <ul class="nav-menu">
    <li class="nav-item nav-item__recipes"><a>Recipes</a></li>
    <li class="nav-item nav-item__menu"><a>Weekly menu</a></li>
    <li class="nav-item nav-item__favs"><a>Favorites</a></li>
    </ul>
</nav>
`;
template.innerHTML = templateHTML.trim();
export class Navigation {
    constructor(homeLink, recipesLink, weeklyMenuLink, favoritesLink) {
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
        const weeklyMenuAnchor = this._navElement.querySelector(".nav-item__menu a");
        if (!weeklyMenuAnchor) {
            throw new Error("weeklyMenuAnchor not found in template");
        }
        this._weeklyMenuAnchor = weeklyMenuAnchor;
        const favoritesAnchor = this._navElement.querySelector(".nav-item__favs a");
        if (!favoritesAnchor) {
            throw new Error("favoritesAnchor not found in template");
        }
        this._favoritesAnchor = favoritesAnchor;
        this._homeAnchor.href = homeLink;
        this._recipesAnchor.href = recipesLink;
        this._weeklyMenuAnchor.href = weeklyMenuLink;
        this._favoritesAnchor.href = favoritesLink;
        navButton.addEventListener("click", () => {
            navMenu.classList.toggle("opened");
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
        this._navElement.style.setProperty("--nav-height-counted", `${navHeight}px`);
    }
}
