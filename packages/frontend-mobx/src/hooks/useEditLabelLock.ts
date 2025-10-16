import { t } from 'i18next';
import { useEffect, useState } from 'react';

import { useRootStore } from '../stores';

type UseEditLabelLockProps = {
  labelId: string;
};

export const useEditLabelLock = ({ labelId }: UseEditLabelLockProps) => {
  const [editLock, setEditLock] = useState<boolean>(false);
  const { editLabelStore, headerStore } = useRootStore();

  useEffect(() => {
    editLabelStore.updateLocksFromLocalStorage();
    const { lock, ownedLock } = editLabelStore.hasEditLock(labelId);

    if (!labelId) return;

    if (!lock) {
      const timestamp = Date.now();
      editLabelStore.addLock({ labelId, timestamp });
      setEditLock(false);
    } else {
      if (!ownedLock) {
        const messageHeader = t('onlyViewMode');
        const messageDetail = t('labelEditedByAnotherUser');
        headerStore.setViewMessage({
          detail: messageDetail,
          header: messageHeader,
          type: 'warning',
        });
        setEditLock(true);
      } else {
        setEditLock(false);
      }
    }

    return () => {
      console.info('cleanup edit lock 1: ', lock, ownedLock, editLock);
      if (lock && ownedLock) {
        console.info('cleanup edit lock 2: ', lock, ownedLock, editLock);
        editLabelStore.removeLock(labelId);
      }
      if (lock && !ownedLock) {
        headerStore.resetViewMessage();
      }
    };
  }, [headerStore, editLabelStore, editLock, labelId]);

  return { editLock };
};
