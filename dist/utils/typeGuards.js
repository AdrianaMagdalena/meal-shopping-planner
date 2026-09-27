export function isFood(obj) {
    return (obj &&
        typeof obj.id === "string" &&
        typeof obj.name === "string" &&
        typeof obj.category === "string" &&
        typeof obj.unit === "string");
}
export function isRecipe(obj) {
    return (obj &&
        typeof obj.id === "string" &&
        typeof obj.title === "string" &&
        Array.isArray(obj.dietTags) &&
        Array.isArray(obj.mealTypeTags) &&
        typeof obj.servings === "number" &&
        Array.isArray(obj.parts));
}
export function isSelectorString(selector) {
    return typeof selector === "string";
}
export function isSavedPlannerEntry(obj) {
    return (obj &&
        typeof obj.recipeId === "string" &&
        typeof obj.recipeTitle === "string" &&
        typeof obj.servingsAmount === "number");
}
export function isSavedShoppingItem(obj) {
    return (obj &&
        typeof obj.id === "string" &&
        typeof obj.category === "string" &&
        typeof obj.name === "string" &&
        typeof obj.unit === "string" &&
        typeof obj.quantity === "number");
}
