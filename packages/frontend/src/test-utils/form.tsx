import type { PropsWithChildren, ReactElement } from 'react';

import { render } from '@testing-library/react';

// Placeholder for future enhancement: if components require a form Provider,
// wire it here. For now, components under test create their own form instance.
export function FormTestProvider({ children }: PropsWithChildren) {
  return <>{children}</>;
}

export function renderWithForm(ui: ReactElement) {
  return render(<FormTestProvider>{ui}</FormTestProvider>);
}
