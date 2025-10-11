import { screen, within } from '@testing-library/react';

const patientInfoItems = () => {
  const patientInfoGroup = screen.getByRole('group', { name: 'Patient Info' });
  const name = within(patientInfoGroup).getByRole('textbox', {
    name: 'Name',
  });
  const surname = within(patientInfoGroup).getByRole('textbox', {
    name: 'Surname',
  });

  return { name, surname };
};

const manifacturingItems = () => {
  const manufacturingInfoGroup = screen.getByRole('group', {
    name: 'Manufacturing Info',
  });

  const description = within(manufacturingInfoGroup).getByRole('textbox', {
    name: 'Description',
  });

  const productionDateGroup = screen.getByRole('group', {
    name: 'Production Date',
  });
  const productionDateDay = within(productionDateGroup).getByRole('combobox', {
    name: /production date day/i,
  });
  const productionDateMonth = within(productionDateGroup).getByRole(
    'combobox',
    {
      name: /production date month/i,
    },
  );
  const productionDateYear = within(productionDateGroup).getByRole('combobox', {
    name: /production date year/i,
  });

  const dueDateGroup = screen.getByRole('group', {
    name: 'Due Date',
  });
  const dueDateDay = within(dueDateGroup).getByRole('combobox', {
    name: /due date day/i,
  });
  const dueDateMonth = within(dueDateGroup).getByRole('combobox', {
    name: /due date month/i,
  });
  const dueDateYear = within(dueDateGroup).getByRole('combobox', {
    name: /due date year/i,
  });

  return {
    description,
    dueDateDay,
    dueDateMonth,
    dueDateYear,
    productionDateDay,
    productionDateMonth,
    productionDateYear,
  };
};

const leftLensSpecsItems = () => {
  const leftLensGroup = screen.getByRole('group', {
    name: 'left Lens Specs',
  });

  const leftLensSpecsCheckbox = within(leftLensGroup).getByRole('checkbox', {
    name: /left lens enabled/i,
  });

  const copyLeftToRightButton = within(leftLensGroup).getByRole('button', {
    name: /copy lens specs left to right/i,
  });

  const leftLensGroupData = within(leftLensGroup).getByRole('group', {
    name: /left lens specs data/i,
  });

  const bc = within(leftLensGroupData).getByRole('textbox', {
    name: /bc/i,
  });
  const dia = within(leftLensGroupData).getByRole('textbox', {
    name: /dia/i,
  });

  const pwrGroup = within(leftLensGroupData).getByRole('group', {
    name: /pwr/i,
  });
  const pwrSign = within(pwrGroup).getByRole('combobox', {
    name: /pwr sign/i,
  });
  const pwr = within(pwrGroup).getByRole('textbox', {
    name: /pwr/i,
  });

  const cylGroup = within(leftLensGroupData).getByRole('group', {
    name: /cyl/i,
  });
  const cylSign = within(cylGroup).getByRole('combobox', {
    name: /cyl sign/i,
  });
  const cyl = within(cylGroup).getByRole('textbox', {
    name: /cyl/i,
  });

  const ax = within(leftLensGroupData).getByRole('textbox', {
    name: /ax/i,
  });

  const addGroup = within(leftLensGroupData).getByRole('group', {
    name: /add/i,
  });
  const addSign = within(addGroup).getByRole('combobox', {
    name: /add sign/i,
  });
  const add = within(addGroup).getByRole('textbox', {
    name: /add/i,
  });

  const sag = within(leftLensGroupData).getByRole('textbox', {
    name: /sag/i,
  });

  return {
    add,
    addSign,
    ax,
    bc,
    copyLeftToRightButton,
    cyl,
    cylSign,
    dia,
    leftLensSpecsCheckbox,
    pwr,
    pwrSign,
    sag,
  };
};

export const getCreateLabelPageElements = () => {
  return {
    ...patientInfoItems(),
    ...manifacturingItems(),
    ...leftLensSpecsItems(),
  };
};
