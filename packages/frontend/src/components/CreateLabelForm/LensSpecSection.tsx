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
      <div aria-label="Lens specs" className="card" role="group">
        <div aria-level={2} className="card__title" role="heading">
          Lens specs
        </div>
        <div className="card__section lens-specs">
          <LensSpecColumn form={form} side={LensSide.Left} />
          <LensSpecColumn form={form} side={LensSide.Right} />
        </div>
      </div>
    );
  },
});
