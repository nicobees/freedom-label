import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import { DarkModeToggle } from './components/DarkModeToggle';

const API_ENDPOINT = 'http://localhost:8000';

export function App() {
  const form = useForm({
    defaultValues: {
      patientName: '',
      pwr: '',
      dueDate: '',
    },
    onSubmit: async ({ value }) => {
      const uri = `${API_ENDPOINT}/print-label`;
      await fetch(uri, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_name: value.patientName,
          pwr: value.pwr,
          due_date: value.dueDate,
        }),
      });
    },
    validatorAdapter: zodValidator,
  });

  return (
    <div className="p-2">
      <div className="flex justify-end">
        <DarkModeToggle />
      </div>
      <h3 className="text-center text-2xl font-bold dark:text-white">
        Freedom Label
      </h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        className="mx-auto mt-4 max-w-xl"
      >
        <div>
          <form.Field
            name="patientName"
            validators={{
              onChange: z
                .string()
                .min(1, 'Patient name is required')
                .max(64, 'Patient name is too long'),
            }}
            children={(field) => (
              <>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Patient Name:
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
                {field.state.meta.errors && (
                  <p className="mt-2 text-sm text-red-600">
                    {field.state.meta.errors.join(', ')}
                  </p>
                )}
              </>
            )}
          />
        </div>
        <div className="mt-4">
          <form.Field
            name="pwr"
            validators={{
              onChange: z
                .string()
                .min(1, 'PWR is required')
                .max(6, 'PWR is too long'),
            }}
            children={(field) => (
              <>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  PWR:
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
                {field.state.meta.errors && (
                  <p className="mt-2 text-sm text-red-600">
                    {field.state.meta.errors.join(', ')}
                  </p>
                )}
              </>
            )}
          />
        </div>
        <div className="mt-4">
          <form.Field
            name="dueDate"
            validators={{
              onChange: z
                .string()
                .min(1, 'Due date is required')
                .max(7, 'Due date is too long'),
            }}
            children={(field) => (
              <>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Due Date:
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
                {field.state.meta.errors && (
                  <p className="mt-2 text-sm text-red-600">
                    {field.state.meta.errors.join(', ')}
                  </p>
                )}
              </>
            )}
          />
        </div>
        <div className="mt-4">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
              >
                {isSubmitting ? 'Printing...' : 'Print'}
              </button>
            )}
          />
        </div>
      </form>
    </div>
  );
}

export default App;
