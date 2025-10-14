import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import type { LabelListItem } from '../../../stores/labelsList';

import PenIcon from '../../../assets/icons/pen.svg?react';
import './list-label-item.css';
import PrintIcon from '../../../assets/icons/print.svg?react';
import { ActionButton } from '../../atoms/Button/ActionButton';

type ListLabelItemProps = {
  item: LabelListItem;
  onEditCallback: (id: LabelListItem['id']) => void;
  onPrintCallback: (id: LabelListItem['id']) => void;
};

const ListLabelItemTemp = ({
  item,
  onEditCallback,
  onPrintCallback,
}: ListLabelItemProps) => {
  const { t } = useTranslation();
  const { creationDate, description, id, lensSpecs, name, timestamp } = item;
  const isoDate = new Date(timestamp).toISOString();

  return (
    <li className="label-card" data-label-id={id}>
      <div aria-label={name} className="label-card__top" role="group">
        <h3 className="label-card__title">{name}</h3>
        <span
          className={`label-card__badge${lensSpecs ? '' : ' label-card__badge--muted'}`}
        >
          {lensSpecs}
        </span>
        <time className="label-card__date" dateTime={isoDate}>
          {creationDate}
        </time>
        <div
          aria-label={t('labelActions')}
          className="label-card__actions"
          role="group"
        >
          <ActionButton
            icon={<PrintIcon aria-hidden="true" />}
            label={t('printLabel')}
            onClickHandler={() => onPrintCallback(id)}
          />
          <ActionButton
            icon={<PenIcon aria-hidden="true" />}
            label={t('editLabel')}
            onClickHandler={() => onEditCallback(id)}
          />
        </div>
      </div>
      {description ? (
        <p className="label-card__description">{description}</p>
      ) : null}
    </li>
  );
};

export const ListLabelItem = memo(ListLabelItemTemp);
