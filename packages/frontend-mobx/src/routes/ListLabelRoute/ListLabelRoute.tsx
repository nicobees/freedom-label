import { useNavigate } from '@tanstack/react-router';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';

import type { LabelListItem, LabelListStore } from '../../stores/labelsList';

import { Paths } from '..';
import { ListLabelView } from '../../components/views/ListLabel/ListLabelView';
import { usePrintLabelApiResponse } from '../../hooks/usePrintLabelApiResponse';
import { useRootStore } from '../../stores';

const ListLabelRoute = () => {
  const { labelsListStore, labelsStore } = useRootStore();
  const navigate = useNavigate();
  const handleMessage = usePrintLabelApiResponse();

  const onPrintCallback = useCallback(
    (id: LabelListItem['id']) => {
      void labelsStore.print({ labelId: id, onMutationHandler: handleMessage });
    },
    [handleMessage, labelsStore],
  );

  const onEditCallback = useCallback(
    (id: LabelListItem['id']) => {
      void navigate({ params: { id }, to: Paths.edit });
    },
    [navigate],
  );

  const onFilterCallback = useCallback(
    (filter: LabelListStore['filter']) => {
      void labelsListStore.setFilter(filter);
    },
    [labelsListStore],
  );

  const onSortCallback = useCallback(
    (sort: LabelListStore['sort']) => {
      labelsListStore.setSort(sort);
    },
    [labelsListStore],
  );

  const onLazyLoadCallback = useCallback(
    (additionalPages: number) => {
      void labelsListStore.loadNextPages(additionalPages);
    },
    [labelsListStore],
  );

  return (
    <ListLabelView
      hasMoreItems={labelsListStore.hasMoreItems}
      list={labelsListStore.labelsFiltered}
      onEditCallback={onEditCallback}
      onFilterCallback={onFilterCallback}
      onLazyLoadCallback={onLazyLoadCallback}
      onPrintCallback={onPrintCallback}
      onSortCallback={onSortCallback}
    />
  );
};

export default observer(ListLabelRoute);
