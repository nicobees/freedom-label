import { useEffect, useRef } from 'react';

const RELATIVE_WORKER_FOLDER_PATH = '../workers/';

type UseWorkerProps = {
  onMessageCallback: (event: MessageEvent) => void;
  workerFileName: string;
};

export const useWorker = ({
  onMessageCallback,
  workerFileName,
}: UseWorkerProps) => {
  const worker = useRef<null | Worker>(null);

  const postMessage = (message: unknown) => {
    if (!worker.current) return;

    worker.current?.postMessage(message);
  };

  // We use the `useEffect` hook to setup the worker as soon as the `App` component is mounted.
  useEffect(() => {
    if (!worker.current) {
      const workerPath = `${RELATIVE_WORKER_FOLDER_PATH}${workerFileName}`;
      // Create the worker if it does not yet exist.
      const workerUrl = new URL(workerPath, import.meta.url);
      worker.current = new Worker(workerUrl, {
        type: 'module',
      });

      worker.current.onmessage = onMessageCallback;
      worker.current.onerror = (error) => {
        console.error('Worker error callback:', error);
      };
    }

    // Define a cleanup function for when the component is unmounted.
    return () => {
      worker.current?.terminate();
      worker.current = null;
    };
  }, [workerFileName, onMessageCallback]);

  return { postMessage };
};
