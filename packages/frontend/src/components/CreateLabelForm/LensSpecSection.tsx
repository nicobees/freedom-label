import { formOptions } from '@tanstack/react-form';

import { withForm } from '../../hooks/useCreateLabelForm';
import { LensSide } from '../../validation/schema';
import { defaultValues } from './defaultValues';
import { LensSpecColumn } from './LensSpecColumn';

const formOptionsObject = formOptions({
  defaultValues,
});

export const LensSpecSection = withForm({
  ...formOptionsObject,
  render: ({ form }) => {
    return (
      <fieldset className="section" role="group">
        <legend>Lens specs</legend>
        <div className="lens-specs">
          <LensSpecColumn form={form} side={LensSide.Left} />
          <LensSpecColumn form={form} side={LensSide.Right} />
        </div>
      </fieldset>
    );
  },
});
