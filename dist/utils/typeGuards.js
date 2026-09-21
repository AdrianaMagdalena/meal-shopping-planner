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
