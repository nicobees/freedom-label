import { jsonParse, jsonStringify } from './jsonHandler';

export const isItemInSessionStorage = (key: string) => {
  return sessionStorage.getItem(key) !== null;
};

export const setItemToSessionStorage = (key: string, value: unknown) => {
  const stringified = jsonStringify(value);

  return sessionStorage.setItem(key, stringified);
};

export const getItemFromSessionStorage = <T = string>(key: string) => {
  const item = sessionStorage.getItem(key);

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
