import { getRouteApi } from '@tanstack/react-router';
import { observer } from 'mobx-react-lite';

import type { LabelDataSubmit } from '../../validation/schema';

import { CreateLabelView } from '../../components/views/CreateLabel/CreateLabelView';
import { useEditLabelLock } from '../../hooks/useEditLabelLock';
import { usePrintLabelApiResponse } from '../../hooks/usePrintLabelApiResponse';
import { useRouter } from '../../hooks/useRouter';
import { useRootStore } from '../../stores';

const route = getRouteApi('/edit/$id');

const EditLabelRoute = () => {
  const { title } = useRouter();
  const { debug } = route.useSearch();
  const { id } = route.useParams();

  const handleMessage = usePrintLabelApiResponse();

  const { labelsStore } = useRootStore();

  const labelData = labelsStore.getById(id);

  const { editLock } = useEditLabelLock({ labelId: id ?? '' });

  if (!id || !labelData)
    return <div>No label data with the current id: {id}</div>;

  const onSubmitHandler = (data: LabelDataSubmit) => {
    labelsStore.addLabel(data);
  };

  return (
    <CreateLabelView
      debug={debug}
      labelData={labelData}
      loading={labelsStore.loadingPrintApi}
      onlyViewMode={editLock}
      onPrintCallback={handleMessage}
      onSaveCallback={onSubmitHandler}
      title={title}
    />
  );
};

export default observer(EditLabelRoute);
