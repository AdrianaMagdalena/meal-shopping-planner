import { roundIngredients } from "../utils/roundIngredients.js";
import { SHOPPING_CATEGORY_ORDER } from "../utils/constants.js";
const getDataFromRecipe = async (recipe, foodStorage, items, ratio) => {
    for (const part of recipe.parts) {
        for (const ingredient of part.ingredients) {
            const food = await foodStorage.getById(ingredient.id);
            items.push({
                id: food ? food.id : "Unknown",
                category: food ? food.category : "Unknown category",
                name: food ? food.name.toLowerCase() : "Unknown ingredient",
                unit: food ? food.unit : "",
                quantity: ingredient.quantity * ratio,
            });
        }
    }
};
const addItemsQuantities = (items) => {
    const totals = new Map();
    items.forEach((item) => {
        if (totals.has(item.id)) {
            totals.get(item.id).quantity += item.quantity;
        }
        else {
            totals.set(item.id, { ...item });
        }
    });
    const summarised = Array.from(totals.values());
    summarised.forEach((item) => {
        item.quantity = roundIngredients(item.quantity);
    });
    return summarised;
};
export const buildShoppingItems = async (savedEntries, recipeStorage, foodStorage) => {
    let items = [];
    for (const entry of savedEntries) {
        const recipe = await recipeStorage.getById(entry.recipeId);
        if (!recipe)
            continue;
        const ratio = entry.servingsAmount / recipe.servings;
        await getDataFromRecipe(recipe, foodStorage, items, ratio);
    }
    return addItemsQuantities(items);
};
export const groupByCategory = (items) => {
    const grouped = new Map();
    items.forEach((item) => {
        if (!grouped.has(item.category))
            grouped.set(item.category, []);
        grouped.get(item.category).push(item);
    });
    return grouped;
};
export const sortByFixedOrder = (grouped) => {
    const sorted = Array.from(grouped.entries()).sort(([a], [b]) => {
        const indexA = SHOPPING_CATEGORY_ORDER.indexOf(a);
        const indexB = SHOPPING_CATEGORY_ORDER.indexOf(b);
        return ((indexA === -1 ? SHOPPING_CATEGORY_ORDER.length : indexA) -
            (indexB === -1 ? SHOPPING_CATEGORY_ORDER.length : indexB));
    });
    return new Map(sorted);
};
