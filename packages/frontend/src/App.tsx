import { useForm } from '@tanstack/react-form';
// import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';


const API_ENDPOINT = 'http://localhost:8000';

const createUriWithParams = (baseUri: string, paramNames: string[]): string => {
  const urlParams = new URLSearchParams(window.location.search);
  const queryParams: string[] = [];

  paramNames.forEach(paramName => {
    const paramValue = urlParams.get(paramName);
    if (paramValue) {
      queryParams.push(`${paramName}=${encodeURIComponent(paramValue)}`);
    }
  });

  if (queryParams.length > 0) {
    return `${baseUri}?${queryParams.join('&')}`;
  }

  return baseUri;
};

// Zod schema for PatientInfo
const PatientInfoSchema = z.object({
  name: z.string().min(2).max(14),
  surname: z.string().min(2).max(14),
});

// Inferred type for PatientInfo

// type PatientInfo = z.infer<typeof PatientInfoSchema>;

// Zod schema for LeftRightSpecs
const LeftRightSpecsSchema = z.object({
  bc: z.string().regex(/^\d{1,2}\.\d{2}$/, 'Invalid BC format'),
  dia: z.string().regex(/^\d{1,2}\.\d{2}$/, 'Invalid DIA format'),
  pwr: z.string().regex(/^[+-]?\d{1,2}\.\d{2}$/, 'Invalid PWR format'),
  cyl: z.string().regex(/^[+-]?\d{1,2}\.\d{2}$/, 'Invalid CYL format'),
  ax: z.string().regex(/^\d{3}$/, 'Invalid AX format'),
  add: z.string().regex(/^[+-]?\d{1,2}\.\d{2}$/, 'Invalid ADD format'),
  sag: z.string().regex(/^\d{1,2}\.\d{2}$/, 'Invalid SAG format'),
});

// Inferred type for LeftRightSpecs
type LeftRightSpecs = z.infer<typeof LeftRightSpecsSchema>;

// Zod schema for LensSpecs
const LensSpecsSchema = z.object({
  left: LeftRightSpecsSchema,
  right: LeftRightSpecsSchema.optional(),
});

// Inferred type for LensSpecs

// type LensSpecs = z.infer<typeof LensSpecsSchema>;

// Zod schema for the main LabelData
const LabelDataSchema = z.object({
  patient_info: PatientInfoSchema,
  description: z.string().min(0).max(24),
  batch: z
    .string()
    .regex(/^\d{2}-\d{4}$/, 'Invalid batch format (e.g., 25-0001)'),
  due_date: z.string().regex(/^\d{2}\/\d{4}$/, 'Invalid date format (MM/YYYY)'),
  lens_specs: LensSpecsSchema,
});

// Inferred type for LabelData
export type LabelData = z.infer<typeof LabelDataSchema>;

export function App() {
  const form = useForm({
    defaultValues: {
      patient_info: { name: '', surname: '' },
      description: '',
      batch: '',
      due_date: '',
      lens_specs: {
        left: { bc: '', dia: '', pwr: '', cyl: '', ax: '', add: '', sag: '' },
      },
    },
    // validator: zodValidator,
    onSubmit: async ({ value }) => {
      const base_uri = `${API_ENDPOINT}/label/create-print`;
      console.info('inside sumbit: ', value);

      const uri = createUriWithParams(base_uri, ['debug', 'debug_border']);

      await fetch(uri, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(value),
      });
    },
  });

  return (
    <div className="app-container">
      <h3 className="app-header">
        Freedom Label
      </h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        className="app-form"
      >
        {/* Patient Info */}
        <div className="grid-cols-2">
          <form.Field
            name="patient_info.name"
            validators={{
              onChange: PatientInfoSchema.shape.name,
            }}
            children={(field) => (
              <>
                <label
                  htmlFor={field.name}
                  className="form-field-label"
                >
                  Patient Name:
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="form-field-input"
                />
                {field.state.meta.errors && (
                  <p className="error-message">
                    {field.state.meta.errors.join(', ')}
                  </p>
                )}
              </>
            )}
          />
          <form.Field
            name="patient_info.surname"
            validators={{
              onChange: PatientInfoSchema.shape.surname,
            }}
            children={(field) => (
              <>
                <label
                  htmlFor={field.name}
                  className="form-field-label"
                >
                  Patient Surname:
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="form-field-input"
                />
                {field.state.meta.errors && (
                  <p className="error-message">
                    {field.state.meta.errors.join(', ')}
                  </p>
                )}
              </>
            )}
          />
        </div>

        {/* Description */}
        <div className="mt-4">
          <form.Field
            name="description"
            validators={{
              onChange: LabelDataSchema.shape.description,
            }}
            children={(field) => (
              <>
                <label
                  htmlFor={field.name}
                  className="form-field-label"
                >
                  Description:
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="form-field-input"
                />
                {field.state.meta.errors && (
                  <p className="error-message">
                    {field.state.meta.errors.join(', ')}
                  </p>
                )}
              </>
            )}
          />
        </div>

        {/* Batch and Due Date */}
        <div className="mt-4 grid-cols-2">
          <form.Field
            name="batch"
            validators={{
              onChange: LabelDataSchema.shape.batch,
            }}
            children={(field) => (
              <>
                <label
                  htmlFor={field.name}
                  className="form-field-label"
                >
                  Batch:
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="form-field-input"
                />
                {field.state.meta.errors && (
                  <p className="error-message">
                    {field.state.meta.errors.join(', ')}
                  </p>
                )}
              </>
            )}
          />
          <form.Field
            name="due_date"
            validators={{
              onChange: LabelDataSchema.shape.due_date,
            }}
            children={(field) => (
              <>
                <label
                  htmlFor={field.name}
                  className="form-field-label"
                >
                  Due Date:
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="form-field-input"
                />
                {field.state.meta.errors && (
                  <p className="error-message">
                    {field.state.meta.errors.join(', ')}
                  </p>
                )}
              </>
            )}
          />
        </div>

        {/* Lens Specs - Left Eye */}
        <h4 className="section-header">
          Left Eye Specs
        </h4>
        <div className="grid-cols-3">
          {Object.keys(LeftRightSpecsSchema.shape).map((key) => (
            <form.Field
              key={key}
              name={
                `lens_specs.left.${key}` as `lens_specs.left.${keyof LeftRightSpecs}`
              }
              validators={{
                onChange:
                  LeftRightSpecsSchema.shape[key as keyof LeftRightSpecs],
              }}
              children={(field) => (
                <>
                  <label
                    htmlFor={field.name}
                    className="form-field-label"
                  >
                    {key.toUpperCase()}:
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="form-field-input"
                  />
                  {field.state.meta.errors && (
                    <p className="error-message">
                      {field.state.meta.errors.join(', ')}
                    </p>
                  )}
                </>
              )}
            />
          ))}
        </div>

        {/* Lens Specs - Right Eye */}
        {/* <h4 className="mt-6 text-lg font-semibold dark:text-white">
          Right Eye Specs
        </h4>
        <div className="grid grid-cols-3 gap-4">
          {Object.keys(LeftRightSpecsSchema.shape).map((key) => (
            <form.Field
              key={key}
              name={
                `lens_specs.right.${key}` as `lens_specs.right.${keyof LeftRightSpecs}`
              }
              validators={{
                onChange:
                  LeftRightSpecsSchema.shape[key as keyof LeftRightSpecs],
              }}
              children={(field) => (
                <>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    {key.toUpperCase()}:
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
                      {field.state.meta.errors.map((error) => error.message).join(', ')}
                    </p>
                  )}
                </>
              )}
            />
          ))}
        </div> */}

        <div className="mt-4">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit}
                className="submit-button"
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
