import { observer } from 'mobx-react-lite';

import { useRootStore } from '../../stores';

const ListLabelRoute = () => {
  const { lensesStore } = useRootStore();

  const labelsData = Array.from(lensesStore.lenses.entries());

  return (
    <section>
      <h2 aria-hidden="true">List Label</h2>
      {labelsData.length === 0 ? (
        <p title="No labels available">No labels available</p>
      ) : (
        <ol>
          {Array.from(lensesStore.lenses.entries()).map(([, label]) => {
            const { description, id, patient_info, timestamp } = label;

            const formattedData = new Date(timestamp).toISOString();
            const dataToShow = `${patient_info.name} ${patient_info.surname} - ${description} (${formattedData})`;
            return <li key={id}>{dataToShow}</li>;
          })}
        </ol>
      )}
    </section>
  );
};

export default observer(ListLabelRoute);
