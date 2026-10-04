import {
  CHECKED_ITEMS_STORAGE_KEY,
  REMOVED_ITEMS_STORAGE_KEY,
} from "./constants.js";

const loadIds = (key: string): string[] => {
  const rawData = localStorage.getItem(key);
  if (!rawData) return [];

  try {
    const parsedData: unknown = JSON.parse(rawData);
    if (!Array.isArray(parsedData)) return [];
    return parsedData.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
};

const saveIds = (key: string, ids: string[]): void => {
  localStorage.setItem(key, JSON.stringify(ids));
};

export const loadCheckedIds = (): string[] =>
  loadIds(CHECKED_ITEMS_STORAGE_KEY);
export const saveCheckedIds = (ids: string[]): void =>
  saveIds(CHECKED_ITEMS_STORAGE_KEY, ids);

export const loadRemovedIds = (): string[] =>
  loadIds(REMOVED_ITEMS_STORAGE_KEY);
export const saveRemovedIds = (ids: string[]): void =>
  saveIds(REMOVED_ITEMS_STORAGE_KEY, ids);

export const markChecked = (id: string, checked: boolean): void => {
  const ids = loadCheckedIds();
  if (checked) {
    if (!ids.includes(id)) ids.push(id);
    saveCheckedIds(ids);
  } else {
    saveCheckedIds(ids.filter((existing) => existing !== id));
  }
};

export const markRemoved = (ids: string[]): void => {
  const removed = loadRemovedIds();
  ids.forEach((id) => {
    if (!removed.includes(id)) removed.push(id);
  });
  saveRemovedIds(removed);
  saveCheckedIds([]);
};
