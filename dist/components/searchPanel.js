import { generateId } from "../utils/generateId.js";
const tagTemplate = document.createElement("template");
const tagTemplateHTML = `
<label class="recipe-search__tag" for="">
    <div class="recipe-search__tag-marker"></div>
    <input class="recipe-search__tag-input" type="checkbox" id="" />
    <span></span>
</label>
`;
tagTemplate.innerHTML = tagTemplateHTML.trim();
export class SearchPanel {
    constructor(recipeStorage) {
        this._dietTags = [];
        this._mealTags = [];
        const showFiltersButton = document.querySelector(".button--show-filters");
        if (!showFiltersButton) {
            throw new Error("showFiltersButton not found on page");
        }
        this._showFiltersButton = showFiltersButton;
        const categoriesWrap = document.querySelector(".recipe-search__categories");
        if (!categoriesWrap) {
            throw new Error("categoriesWrap not found on page");
        }
        this._categoriesWrap = categoriesWrap;
        const dietTagsWrap = document.querySelector(".recipe-search__category--diet .recipe-search__category-list");
        if (!dietTagsWrap) {
            throw new Error("dietTagsWrap not found on page");
        }
        this._dietTagsWrap = dietTagsWrap;
        const mealTypeTagsWrap = document.querySelector(".recipe-search__category--meal .recipe-search__category-list");
        if (!mealTypeTagsWrap) {
            throw new Error("mealTypeTagsWrap not found on page");
        }
        this._mealTypeTagsWrap = mealTypeTagsWrap;
        this._showFiltersButton.addEventListener("click", () => {
            this._showFiltersButton.classList.toggle("open");
            this._categoriesWrap.classList.toggle("open");
        });
        this._recipeStorage = recipeStorage;
        const allRecipes = this._recipeStorage.recipes;
        const dietCategories = [];
        const mealCategories = [];
        if (allRecipes !== null) {
            allRecipes.forEach((r) => {
                r.dietTags.forEach((t) => dietCategories.push(t.toLowerCase()));
                r.mealTypeTags.forEach((t) => mealCategories.push(t.toLowerCase()));
            });
            let dietTagSet = new Set(dietCategories);
            let mealTagSet = new Set(mealCategories);
            this._mealTags = [...mealTagSet];
            this._dietTags = [...dietTagSet];
        }
        this._dietTags.forEach((t) => {
            const fragment = tagTemplate.content.cloneNode(true);
            const searchTag = fragment.querySelector(".recipe-search__tag");
            if (!searchTag) {
                throw new Error("searchTag not found in template");
            }
            const tagInput = searchTag.querySelector(".recipe-search__tag-input");
            if (!tagInput) {
                throw new Error("tagInput not found in template");
            }
            const tagText = searchTag.querySelector("span");
            if (!tagText) {
                throw new Error("tagText not found in template");
            }
            const tagId = generateId("diet", 4);
            searchTag.setAttribute("for", tagId);
            tagInput.setAttribute("id", tagId);
            tagText.textContent = t;
            this._dietTagsWrap.appendChild(searchTag);
        });
        this._mealTags.forEach((t) => {
            const fragment = tagTemplate.content.cloneNode(true);
            const searchTag = fragment.querySelector(".recipe-search__tag");
            if (!searchTag) {
                throw new Error("searchTag not found in template");
            }
            const tagInput = searchTag.querySelector(".recipe-search__tag-input");
            if (!tagInput) {
                throw new Error("tagInput not found in template");
            }
            const tagText = searchTag.querySelector("span");
            if (!tagText) {
                throw new Error("tagText not found in template");
            }
            searchTag.setAttribute("for", `meal-${t}`);
            tagInput.setAttribute("id", `meal-${t}`);
            tagText.textContent = t;
            this._mealTypeTagsWrap.appendChild(searchTag);
        });
    }
    get dietTags() {
        return this._dietTags;
    }
    get mealTags() {
        return this._mealTags;
    }
}
