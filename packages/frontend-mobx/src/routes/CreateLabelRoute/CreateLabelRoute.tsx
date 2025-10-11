import { getRouteApi } from '@tanstack/react-router';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

import type { LabelDataSubmit } from '../../validation/schema';

import { CreateLabelView } from '../../components/views/CreateLabel/CreateLabelView';
import { useFeedback } from '../../contexts/FeedbackContext';
import { useRouter } from '../../hooks/useRouter';
import { useRootStore } from '../../stores';

const route = getRouteApi('/create');

const CreateLabelRoute = () => {
  const { title } = useRouter();
  const { showError, showSuccess } = useFeedback();
  const { debug } = route.useSearch();
  const { t } = useTranslation();

  const { lensesStore } = useRootStore();

  const onCreatePrintLabelResponse = (
    errorMessage?: string,
    filename?: string,
  ) => {
    const messageBaseLabel = errorMessage
      ? 'errorInPrintingLabel'
      : 'labelPrintedSuccessfully';
    const messageBase = t(messageBaseLabel);
    const detailMessage = errorMessage ? errorMessage : filename;

    const fullMessage = detailMessage
      ? `${messageBase}: ${detailMessage}`
      : messageBase;
    const method = errorMessage ? showError : showSuccess;

    method(fullMessage);
  };

  const onSubmitHandler = (data: LabelDataSubmit) => {
    lensesStore.addLens(data);
  };

  return (
    <CreateLabelView
      debug={debug}
      loading={lensesStore.loadingPrintApi}
      onPrintCallback={onCreatePrintLabelResponse}
      onSaveCallback={onSubmitHandler}
      title={title}
    />
  );
};

export default observer(CreateLabelRoute);
