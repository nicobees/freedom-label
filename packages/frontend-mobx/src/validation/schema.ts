import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const validationErrorMessages = {
  add: 'Invalid ADD format',
  ax: 'Invalid AX format',
  batch: 'Invalid Batch format',
  bc: 'Invalid BC format',
  bc_toric: 'Invalid BC Toric format',
  cyl: 'Invalid CYL format',
  dia: 'Invalid DIA format',
  pwr: 'Invalid PWR format',
  sag: 'Invalid SAG format',
  sag_toric: 'Invalid SAG Toric format',
};

export const LensSpecsDataSchema = z.object({
  add: z.string().regex(/^[+-]?\d{1,2}\.\d{2}$/, validationErrorMessages.add),
  ax: z
    .string({ invalid_type_error: 'Invalid AX format: 3-digits string' })
    .regex(/^\d{1,3}$/, validationErrorMessages.ax),
  batch: z
    .string()
    .regex(/^.{0,7}$/, validationErrorMessages.batch)
    .optional()
    .nullable(),
  bc: z.string().regex(/^\d{1,2}\.\d{2}$/, validationErrorMessages.bc),
  bc_toric: z
    .string()
    .regex(/^\d{1,2}\.\d{2}$/, validationErrorMessages.bc_toric)
    .optional()
    .nullable(),
  cyl: z.string().regex(/^[+-]?\d{1,2}\.\d{2}$/, validationErrorMessages.cyl),
  dia: z.string().regex(/^\d{1,2}\.\d{2}$/, validationErrorMessages.dia),
  pwr: z.string().regex(/^[+-]?\d{1,2}\.\d{2}$/, validationErrorMessages.pwr),
  sag: z.string().regex(/^\d{1,4}$/, validationErrorMessages.sag),
  sag_toric: z
    .string()
    .regex(/^\d{1,4}$/, validationErrorMessages.sag_toric)
    .optional()
    .nullable(),
});

export type LensSpecsData = z.infer<typeof LensSpecsDataSchema>;

export const LensSide = {
  Left: 'left',
  Right: 'right',
} as const;
export type LensSide = (typeof LensSide)[keyof typeof LensSide];

const LensSpecsGridSchema = z.discriminatedUnion('enabled', [
  z.object({
    data: LensSpecsDataSchema,
    enabled: z.literal(true),
  }),
  z.object({
    data: z.unknown().nullable(),
    enabled: z.literal(false),
  }),
]);

type LensSpecsGrid = z.infer<typeof LensSpecsGridSchema>;

const LensesSpecsSchema = z.object({
  [LensSide.Left]: LensSpecsGridSchema,
  [LensSide.Right]: LensSpecsGridSchema,
});

export type LensesSpecs = z.infer<typeof LensesSpecsSchema>;

export type LensesSpecsKeys = keyof LensesSpecs;

const PatientInfoSchema = z.object({
  name: z.string().min(2).max(30),
  surname: z.string().min(2).max(30),
});

export type PatientInfo = z.infer<typeof PatientInfoSchema>;

const dateStringRegex = /^\d{2}\/\d{2}\/\d{4}$/;
const dateStringValidationErrorMessage = 'Invalid date format (DD/MM/YYYY)';

export const LabelDataSchemaBase = z.object({
  description: z.string().min(2).max(24),
  due_date: z.string().regex(dateStringRegex, dateStringValidationErrorMessage),
  id: z.string().uuid().nullable(),
  lens_specs: LensesSpecsSchema,
  patient_info: PatientInfoSchema,
  production_date: z
    .string()
    .regex(dateStringRegex, dateStringValidationErrorMessage),
});

export const LabelDataSchema = LabelDataSchemaBase.extend({}).superRefine(
  (data, ctx) => {
    // check lens_specs enabled
    const { lens_specs } = data;

    const { left, right } = lens_specs;

    const leftEnabled = left?.enabled ?? false;
    const rightEnabled = right?.enabled ?? false;

    if (!leftEnabled && !rightEnabled) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Provide at least one LensSpec side',
        path: [`lens_specs.${LensSide.Left}.enabled`],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Provide at least one LensSpec side',
        path: [`lens_specs.${LensSide.Right}.enabled`],
      });

      return;
    }

    // check lens_specs data properly filled
    const leftResults = LensSpecsGridSchema.safeParse(left);
    const rightResults = LensSpecsGridSchema.safeParse(right);

    if (!leftResults.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Properly fill all data',
        path: [`lens_specs.${LensSide.Left}.enabled`],
      });
    }

    if (!rightResults.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Properly fill all data',
        path: [`lens_specs.${LensSide.Right}.enabled`],
      });
    }
  },
);

export type LabelData = z.infer<typeof LabelDataSchema>;

const LensSpecDataTransform = (value: LensSpecsGrid) => {
  const { data, enabled } = value;

  if (!enabled) return null;

  const computedBatch = data.batch === '' ? undefined : data.batch;

  return { ...data, batch: computedBatch };
};

const LensSpecsGridSubmitSchema = LensSpecsGridSchema.transform(
  LensSpecDataTransform,
);

const LensesSpecsSubmitSchema = z.object({
  [LensSide.Left]: LensSpecsGridSubmitSchema,
  [LensSide.Right]: LensSpecsGridSubmitSchema,
});

export const LabelDataSubmitSchema = LabelDataSchemaBase.extend({
  id: z
    .string()
    .uuid()
    .nullable()
    .transform((value) => {
      if (value) return value;

      return uuidv4();
    }),
  lens_specs: LensesSpecsSubmitSchema,
});

export type LabelDataSubmit = z.infer<typeof LabelDataSubmitSchema>;

export const UrlSearchSchema = z.object({
  debug: z.boolean().optional(),
});

// TODO: remove the commented code
/**
 * "patient_info": {
        "name": "gabriele",
        "surname": "cara"
    },
    "description": "Lente sclerale F2mid",
    "batch": "25-0001",
    "due_date": "04/2026",
    "lens_specs": {
        "left": {
            "bc": "1.24",
            "dia": "1.24",
            "pwr": "+1.24",
            "cyl": "+1.24",
            "ax": "123",
            "add": "+1.24",
            "sag": "10.04"
        }
    }
 */
