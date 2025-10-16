import {
  getItemFromSessionStorage,
  setItemToSessionStorage,
} from '../../utils/sessionStorage';

export const USER_ID_SESSION_STORAGE_KEY = 'freedom-label:user-id:v1';

export const GET = (): null | string => {
  const userId = getItemFromSessionStorage<string>(USER_ID_SESSION_STORAGE_KEY);

  return userId ?? null;
};

export const PUT = (userId: string): void => {
  setItemToSessionStorage(USER_ID_SESSION_STORAGE_KEY, userId);
};
