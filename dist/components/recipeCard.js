import { isSelectorString } from "../utils/typeGuards.js";
const template = document.createElement("template");
const templateHtml = `
<div class="recipe-card">
    <div class="recipe-card__img-wrap">
    <div class="recipe-card__btn-wrap">
    <button class="recipe-card__add-btn">Add to plan</button>
    <button 
    class="recipe-card__fav-btn" aria-label="Add to favorites"
    ></button>
    </div>
    <img
        class="recipe-card__img"
        src=""
        alt=""
    />
    </div>
    <div class="recipe-card__content">
    <div class="recipe-card__content-half">
        <h3></h3>
        <div class="recipe-card__cooking-wrap"></div>
    </div>
    <div class="recipe-card__divider"></div>
    <div class="recipe-card__content-half recipe-card__content-half--btm">
        <div class="recipe-card__diet-tags">
            <p>Diet:</p>
        </div>
        <div class="recipe-card__meal-tags">
            <p>Meal:</p>
        </div>
    </div>
    </div>
</div>
`;
template.innerHTML = templateHtml.trim();
export class RecipeCard {
    constructor(obj) {
        const fragment = template.content.cloneNode(true);
        const recipeCard = fragment.querySelector(".recipe-card");
        if (!recipeCard) {
            throw new Error("recipeCard not found in template");
        }
        this._cardElement = recipeCard;
        const addToPlanBtn = this._cardElement.querySelector("button.recipe-card__add-btn");
        if (!addToPlanBtn) {
            throw new Error("addToPlanBtn not found in template");
        }
        this._addToPlanBtn = addToPlanBtn;
        const addToFavoritesBtn = this._cardElement.querySelector("button.recipe-card__fav-btn");
        if (!addToFavoritesBtn) {
            throw new Error("_addToFavoritesBtn not found in template");
        }
        this._addToFavoritesBtn = addToFavoritesBtn;
        const imgElement = this._cardElement.querySelector("img.recipe-card__img");
        if (!imgElement) {
            throw new Error("imgElement not found in template");
        }
        this._imgElement = imgElement;
        const titleElement = this._cardElement.querySelector("h3");
        if (!titleElement) {
            throw new Error("titleElement not found in template");
        }
        this._titleElement = titleElement;
        const cookTimeWrap = this._cardElement.querySelector(".recipe-card__cooking-wrap");
        if (!cookTimeWrap) {
            throw new Error("cookTimeWrap not found in template");
        }
        this._cookTimeWrap = cookTimeWrap;
        const dietTagWrap = this._cardElement.querySelector(".recipe-card__diet-tags");
        if (!dietTagWrap) {
            throw new Error("dietTagWrap not found in template");
        }
        this._dietTagWrap = dietTagWrap;
        const mealTagWrap = this._cardElement.querySelector(".recipe-card__meal-tags");
        if (!mealTagWrap) {
            throw new Error("mealTagWrap not found in template");
        }
        this._mealTagWrap = mealTagWrap;
        this._imgElement.src = `../src/assets/illustrations/recipes/${obj.id}.png`;
        this._titleElement.textContent = obj.title;
        if (obj.preparationTime) {
            const prepTime = document.createElement("p");
            prepTime.textContent = `Prep: ${obj.preparationTime} min`;
            prepTime.classList.add("recipe-card__prep-time");
            this._cookTimeWrap.appendChild(prepTime);
        }
        if (obj.cookTime) {
            const cookTime = document.createElement("p");
            cookTime.textContent = `Cooking: ${obj.cookTime} min`;
            cookTime.classList.add("recipe-card__cook-time");
            this._cookTimeWrap.appendChild(cookTime);
        }
        obj.dietTags.forEach((tag) => {
            const cardTag = document.createElement("p");
            cardTag.classList.add("recipe-card__tag");
            cardTag.textContent = tag;
            this._dietTagWrap.appendChild(cardTag);
        });
        obj.mealTypeTags.forEach((tag) => {
            const cardTag = document.createElement("p");
            cardTag.classList.add("recipe-card__tag");
            cardTag.textContent = tag;
            this._mealTagWrap.appendChild(cardTag);
        });
    }
    render(parentSelector) {
        const parentElement = isSelectorString(parentSelector)
            ? document.querySelector(parentSelector)
            : parentSelector;
        if (!parentElement) {
            throw new Error("parentElement not found in template");
        }
        parentElement.appendChild(this._cardElement);
    }
}
