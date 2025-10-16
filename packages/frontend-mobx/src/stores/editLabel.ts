import { action, makeObservable, observable, reaction } from 'mobx';

import type { LabelStoreDataItem } from './labels';

import {
  GET as getLocksFromLocalStorage,
  PUT as updateLocksToLocalStorage,
} from '../services/localStorage/locks';
import {
  GET as getUserFromSessionStorage,
  PUT as saveUserToSessionStorage,
} from '../services/sessionStorage/userId';

export type LockData = {
  labelId: LabelStoreDataItem['id'];
  timestamp: number;
};

export type LockStoreData = LockData & {
  userId: string;
};

export class EditLabelStore {
  disposeUpdateLocks: () => void;
  locks: Map<string, LockStoreData>;

  constructor() {
    makeObservable(this, {
      addLock: action,
      hasEditLock: false,
      locks: observable,
      removeLock: action,
      updateLocksFromLocalStorage: action,
    });

    this.locks = this.getLocksFromLocalStorage();

    this.disposeUpdateLocks = reaction(
      () => Array.from(this.locks.values()).map((item) => item),
      (locks) => {
        updateLocksToLocalStorage(locks);
      },
    );
  }

  addLock(lock: LockData) {
    const { timestamp } = lock;

    const userId =
      this.getUserIdFromSessionStorage() ?? this.createNewUserId(timestamp);

    this.addUserIdToSessionStorage(userId);
    this.locks.set(lock.labelId, { ...lock, userId });
  }

  hasEditLock(labelId: string): { lock: boolean; ownedLock: boolean } {
    // this.updateLocksFromLocalStorage();

    // const currentLocks = this.getLocksFromLocalStorage();

    const lock = this.locks.get(labelId);

    if (!lock) return { lock: false, ownedLock: false };

    const userId = this.getUserIdFromSessionStorage();

    if (!userId) {
      // console.error('No user ID found in session storage');
      return { lock: true, ownedLock: false };
    }

    if (lock.userId !== userId) {
      // console.error('User ID does not match the lock owner');
      return { lock: true, ownedLock: false };
    }

    return { lock: true, ownedLock: true };
  }

  removeLock(labelId: string) {
    const { lock: editLock, ownedLock } = this.hasEditLock(labelId);

    if (!editLock) return;

    if (!ownedLock) return;

    this.locks.delete(labelId);
  }

  updateLocksFromLocalStorage() {
    this.locks = this.getLocksFromLocalStorage();
  }

  private addUserIdToSessionStorage(userId: string): void {
    saveUserToSessionStorage(userId);
  }

  private createNewUserId(timestamp: number): string {
    const id = crypto.randomUUID().split('-')[0];

    return `${timestamp.toString(36)}-${id}`;
  }

  private getLocksFromLocalStorage(): Map<string, LockStoreData> {
    const entries = getLocksFromLocalStorage().map((lock) => {
      return [lock.labelId, lock] as const;
    });

    return new Map(entries);
  }

  private getUserIdFromSessionStorage(): null | string {
    return getUserFromSessionStorage();
  }
}
