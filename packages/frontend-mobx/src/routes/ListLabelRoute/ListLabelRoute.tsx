import { useNavigate } from '@tanstack/react-router';
import { observer } from 'mobx-react-lite';

import type { LabelListItem } from '../../stores/labelsList';

import { Paths } from '..';
import { ListLabelView } from '../../components/views/ListLabel/ListLabelView';
import { usePrintLabelApiResponse } from '../../hooks/usePrintLabelApiResponse';
import { useRootStore } from '../../stores';

const ListLabelRoute = () => {
  const { labelsListStore, labelsStore } = useRootStore();
  const navigate = useNavigate();
  const handleMessage = usePrintLabelApiResponse();

  const onPrintCallback = (id: LabelListItem['id']) => {
    void labelsStore.print({ labelId: id, onMutationHandler: handleMessage });
  };

  const onEditCallback = (id: LabelListItem['id']) => {
    console.info('inside edit callback: ', id);
    void navigate({ params: { id }, to: Paths.edit });
  };

  return (
    <ListLabelView
      list={labelsListStore.labels}
      onEditCallback={onEditCallback}
      onPrintCallback={onPrintCallback}
    />
  );
};

export default observer(ListLabelRoute);
