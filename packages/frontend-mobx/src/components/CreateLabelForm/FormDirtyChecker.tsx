import { useStore } from '@tanstack/react-form';
import { Block } from '@tanstack/react-router';

import type { FormType } from '../../hooks/useCreateLabelForm';

// Extract the blocking logic for easier testing
export function shouldBlockNavigation(isDirty: boolean): boolean {
  if (!isDirty) return false;

  const shouldLeave = confirm(
    'There are unsaved/unsubmitted changes. You will lose your changes.Are you sure you want to leave?',
  );
  return !shouldLeave;
}

export const FormDirtyChecker = ({ form }: { form: FormType }) => {
  const isDirty = useStore(form.store, (state): boolean => state.isDirty);

  return (
    <Block
      enableBeforeUnload={isDirty}
      shouldBlockFn={() => shouldBlockNavigation(isDirty)}
    />
  );
};
