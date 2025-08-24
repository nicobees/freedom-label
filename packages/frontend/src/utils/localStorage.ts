export const getItemFromLocalStorage = <T = string>(key: string) => {
  return localStorage.getItem(key) as null | T;
};
