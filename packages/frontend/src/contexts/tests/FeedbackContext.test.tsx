import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEffect } from 'react';
import { expect, test, vi } from 'vitest';

import { SnackbarHost } from '../../components/Feedback/Snackbar';
import { FeedbackProvider, useFeedback } from '../FeedbackContext';

// Async harness that resolves with the context API once available
const renderWithFeedback = async () => {
  let resolveApi: (api: ReturnType<typeof useFeedback>) => void;
  const apiPromise = new Promise<ReturnType<typeof useFeedback>>((res) => {
    resolveApi = res;
  });

  function Harness() {
    const api = useFeedback();
    useEffect(() => {
      resolveApi(api);
    }, [api]);
    return null;
  }

  render(
    <FeedbackProvider>
      <Harness />
      <SnackbarHost />
    </FeedbackProvider>,
  );

  return apiPromise;
};

test('success snackbar auto-dismisses after its duration', async () => {
  vi.useFakeTimers();
  const utils = await renderWithFeedback();

  act(() => {
    utils.showSuccess('Saved successfully');
  });

  expect(screen.getByText('Saved successfully')).toBeInTheDocument();

  act(() => {
    vi.advanceTimersByTime(1999); // just before auto-dismiss
  });
  expect(screen.getByText('Saved successfully')).toBeInTheDocument();

  act(() => {
    vi.advanceTimersByTime(2); // cross 2000ms threshold
  });
  expect(screen.queryByText('Saved successfully')).toBeNull();
  vi.useRealTimers();
});

test('multiple errors collapse to only the latest after collapse window', async () => {
  vi.useFakeTimers();
  const utils = await renderWithFeedback();

  act(() => {
    utils.showError('Error A');
    utils.showError('Error B');
    utils.showError('Error C');
  });

  expect(screen.getByText('Error A')).toBeInTheDocument();
  expect(screen.getByText('Error B')).toBeInTheDocument();
  expect(screen.getByText('Error C')).toBeInTheDocument();

  act(() => {
    vi.advanceTimersByTime(3999); // just before collapse (4000ms)
  });
  expect(screen.getByText('Error A')).toBeInTheDocument();
  expect(screen.getByText('Error B')).toBeInTheDocument();
  expect(screen.getByText('Error C')).toBeInTheDocument();

  act(() => {
    vi.advanceTimersByTime(2); // cross collapse threshold
  });
  expect(screen.queryByText('Error A')).toBeNull();
  expect(screen.queryByText('Error B')).toBeNull();
  expect(screen.getByText('Error C')).toBeInTheDocument();
  vi.useRealTimers();
});

test('error snackbar can be manually dismissed via close button', async () => {
  const utils = await renderWithFeedback();
  act(() => {
    utils.showError('Closable error');
  });
  const closeBtn = screen.getByRole('button', { name: /close notification/i });
  await userEvent.click(closeBtn);
  expect(screen.queryByText('Closable error')).toBeNull();
});
