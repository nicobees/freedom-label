import type { LabelListItem } from '../../../stores/labelsList';

type ListLabelItemProps = {
  item: string;
  onEditCallback: () => void;
  onPrintCallback: () => void;
};

const ListLabelItem = ({
  item,
  onEditCallback,
  onPrintCallback,
}: ListLabelItemProps) => {
  return (
    <li>
      <span>{item}</span>
      <button onClick={onPrintCallback}>Print</button>
      <button onClick={onEditCallback}>Edit</button>
    </li>
  );
};

type ListLabelViewProps = {
  list: LabelListItem[];
  onEditCallback: (id: LabelListItem['id']) => void;
  onPrintCallback: (id: LabelListItem['id']) => void;
};

export const ListLabelView = ({
  list,
  onEditCallback,
  onPrintCallback,
}: ListLabelViewProps) => {
  return (
    <section>
      {list.length === 0 ? (
        <p title="No labels available">No labels available</p>
      ) : (
        <ol>
          {list.map((label) => {
            const { creationDate, id, lensSpecs, name } = label;

            const dataToShow = `${name} - ${lensSpecs} (${creationDate})`;

            return (
              <ListLabelItem
                item={dataToShow}
                key={id}
                onEditCallback={() => {
                  onEditCallback(id);
                }}
                onPrintCallback={() => {
                  onPrintCallback(id);
                }}
              />
            );
          })}
        </ol>
      )}
    </section>
  );
};
