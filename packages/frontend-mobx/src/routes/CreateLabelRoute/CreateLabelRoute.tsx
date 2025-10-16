import { getRouteApi } from '@tanstack/react-router';
import { observer } from 'mobx-react-lite';

import type { LabelDataSubmit } from '../../validation/schema';

import { CreateLabelView } from '../../components/views/CreateLabel/CreateLabelView';
import { usePrintLabelApiResponse } from '../../hooks/usePrintLabelApiResponse';
import { useRouter } from '../../hooks/useRouter';
import { useRootStore } from '../../stores';

const route = getRouteApi('/create');

const CreateLabelRoute = () => {
  const { title } = useRouter();
  const { debug } = route.useSearch();

  const handleMessage = usePrintLabelApiResponse();

  const { labelsStore } = useRootStore();

  const onSubmitHandler = (data: LabelDataSubmit) => {
    labelsStore.addLabel(data);
  };

  return (
    <CreateLabelView
      debug={debug}
      loading={labelsStore.loadingPrintApi}
      onPrintCallback={handleMessage}
      onSaveCallback={onSubmitHandler}
      title={title}
    />
  );
};

export default observer(CreateLabelRoute);
