import { jsonParse, jsonStringify } from './jsonHandler';

export const isItemInLocalStorage = (key: string) => {
  return localStorage.getItem(key) !== null;
};

export const setItemToLocalStorage = (key: string, value: unknown) => {
  const stringified = jsonStringify(value);

  return localStorage.setItem(key, stringified);
};

export const getItemFromLocalStorage = <T = string>(key: string) => {
  const item = localStorage.getItem(key);

  try {
    if (!item) return null;

    return jsonParse<null | T>(item);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return item as null | T;
    }
    throw error;
  }
};
