import { CHECKED_ITEMS_STORAGE_KEY, REMOVED_ITEMS_STORAGE_KEY, } from "./constants.js";
const loadIds = (key) => {
    const rawData = localStorage.getItem(key);
    if (!rawData)
        return [];
    try {
        const parsedData = JSON.parse(rawData);
        if (!Array.isArray(parsedData))
            return [];
        return parsedData.filter((id) => typeof id === "string");
    }
    catch {
        return [];
    }
};
const saveIds = (key, ids) => {
    localStorage.setItem(key, JSON.stringify(ids));
};
export const loadCheckedIds = () => loadIds(CHECKED_ITEMS_STORAGE_KEY);
export const saveCheckedIds = (ids) => saveIds(CHECKED_ITEMS_STORAGE_KEY, ids);
export const loadRemovedIds = () => loadIds(REMOVED_ITEMS_STORAGE_KEY);
export const saveRemovedIds = (ids) => saveIds(REMOVED_ITEMS_STORAGE_KEY, ids);
export const markChecked = (id, checked) => {
    const ids = loadCheckedIds();
    if (checked) {
        if (!ids.includes(id))
            ids.push(id);
        saveCheckedIds(ids);
    }
    else {
        saveCheckedIds(ids.filter((existing) => existing !== id));
    }
};
export const markRemoved = (ids) => {
    const removed = loadRemovedIds();
    ids.forEach((id) => {
        if (!removed.includes(id))
            removed.push(id);
    });
    saveRemovedIds(removed);
    saveCheckedIds([]);
};
